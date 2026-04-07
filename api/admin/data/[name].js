// Vercel Serverless Function — 어드민 데이터 읽기/쓰기
// GET  /api/admin/data/:name  → GitHub API로 JSON 읽기
// POST /api/admin/data/:name  → GitHub API로 JSON 쓰기 (자동 커밋)
// 환경변수: ADMIN_PASSWORD, GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO

import { createHash } from 'crypto';

const ALLOWED_FILES = ['profile', 'projects', 'organizations', 'skills', 'githubDescriptions'];

function validateToken(req) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const expected = createHash('sha256').update(adminPassword).digest('hex');
  const auth = req.headers['authorization'] || '';
  return auth === `Bearer ${expected}`;
}

async function githubRequest(path, options = {}) {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.message || 'GitHub API 오류'), { status: res.status, data });
  return data;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!validateToken(req)) {
    return res.status(401).json({ error: '인증 필요' });
  }

  const { name } = req.query;
  if (!ALLOWED_FILES.includes(name)) {
    return res.status(403).json({ error: '접근 불가한 파일입니다.' });
  }

  const filePath = `src/data/${name}.json`;

  // ─── GET: 파일 읽기 ───────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const file = await githubRequest(filePath);
      const content = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'));
      res.json({ data: content, sha: file.sha });
    } catch (err) {
      res.status(err.status || 500).json({ error: '파일 읽기 실패', detail: err.message });
    }
    return;
  }

  // ─── POST: 파일 쓰기 (커밋) ──────────────────────────────
  if (req.method === 'POST') {
    const { data, sha, message } = req.body || {};
    if (data === undefined) {
      return res.status(400).json({ error: 'data 필드가 필요합니다.' });
    }

    try {
      // SHA가 없으면 현재 파일 SHA 조회
      let fileSha = sha;
      if (!fileSha) {
        const file = await githubRequest(filePath);
        fileSha = file.sha;
      }

      const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
      const commitMessage = message || `어드민 패널: ${name}.json 업데이트`;

      await githubRequest(filePath, {
        method: 'PUT',
        body: JSON.stringify({ message: commitMessage, content, sha: fileSha }),
      });

      res.json({ ok: true, message: '저장 완료! Vercel이 자동으로 사이트를 업데이트합니다.' });
    } catch (err) {
      res.status(err.status || 500).json({ error: '파일 저장 실패', detail: err.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
