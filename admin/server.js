const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const PASSWORD_FILE = path.join(__dirname, '.password');
const ALLOWED_FILES = ['profile', 'projects', 'organizations', 'skills', 'githubDescriptions'];

// 비밀번호 파일이 없으면 기본값으로 생성
if (!fs.existsSync(PASSWORD_FILE)) {
  fs.writeFileSync(PASSWORD_FILE, 'admin1234', 'utf-8');
  console.log('\n⚠️  비밀번호 파일이 없어 기본값(admin1234)으로 생성했습니다.');
  console.log('   admin/.password 파일을 열어 비밀번호를 변경하세요.\n');
}

// 서버 시작마다 새 세션 토큰 생성
const SESSION_TOKEN = crypto.randomBytes(32).toString('hex');

function getPassword() {
  return fs.readFileSync(PASSWORD_FILE, 'utf-8').trim();
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── 인증 미들웨어 ───────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  if (auth === `Bearer ${SESSION_TOKEN}`) return next();
  res.status(401).json({ error: '인증 필요' });
}

// ─── 로그인 ──────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (password === getPassword()) {
    res.json({ token: SESSION_TOKEN });
  } else {
    res.status(401).json({ error: '비밀번호가 틀렸습니다.' });
  }
});

// ─── 데이터 읽기 ─────────────────────────────────────────
app.get('/api/data/:name', requireAuth, (req, res) => {
  const { name } = req.params;
  if (!ALLOWED_FILES.includes(name)) return res.status(403).json({ error: '접근 불가' });
  try {
    const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${name}.json`), 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: '파일 읽기 실패', detail: err.message });
  }
});

// ─── 데이터 저장 ─────────────────────────────────────────
app.post('/api/data/:name', requireAuth, (req, res) => {
  const { name } = req.params;
  if (!ALLOWED_FILES.includes(name)) return res.status(403).json({ error: '접근 불가' });
  try {
    fs.writeFileSync(path.join(DATA_DIR, `${name}.json`), JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: '파일 저장 실패', detail: err.message });
  }
});

// ─── Git 상태 확인 ───────────────────────────────────────
app.get('/api/git/status', requireAuth, (req, res) => {
  try {
    const status = execSync('git status --short', { cwd: path.join(__dirname, '..') }).toString();
    res.json({ status: status.trim() || '변경사항 없음' });
  } catch (err) {
    res.status(500).json({ error: 'git status 실패', detail: err.message });
  }
});

// ─── 커밋 & 푸쉬 ─────────────────────────────────────────
app.post('/api/git/sync', requireAuth, (req, res) => {
  const repoDir = path.join(__dirname, '..');
  const message = req.body.message || `어드민 패널 업데이트 (${new Date().toLocaleString('ko-KR')})`;

  exec(
    `git add src/data && git diff --cached --quiet && echo NOTHING || (git commit -m "${message.replace(/"/g, "'")}" && git push)`,
    { cwd: repoDir },
    (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({ error: 'git 동기화 실패', detail: stderr || err.message });
      }
      if (stdout.includes('NOTHING')) {
        return res.json({ ok: true, message: '변경사항이 없어 푸쉬를 건너뜁니다.' });
      }
      res.json({ ok: true, message: '배포 완료! GitHub Actions가 사이트를 업데이트합니다.', output: stdout });
    }
  );
});

app.listen(PORT, 'localhost', () => {
  console.log(`\n🛠️  어드민 서버 실행 중: http://localhost:${PORT}`);
  console.log(`🔑  비밀번호 파일: admin/.password\n`);
});
