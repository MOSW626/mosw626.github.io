// Vercel Serverless Function — 어드민 로그인
// Vercel 환경변수: ADMIN_PASSWORD
// 비밀번호가 맞으면 SHA-256(ADMIN_PASSWORD)를 토큰으로 반환 (stateless)

import { createHash } from 'crypto';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.' });
  }

  if (password !== adminPassword) {
    return res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
  }

  const token = createHash('sha256').update(adminPassword).digest('hex');
  res.json({ token });
}
