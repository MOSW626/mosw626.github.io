import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Nav, Tab } from 'react-bootstrap';
import './AdminPage.css';

// Vercel 환경에서는 /api/admin/*, 로컬 개발 시 admin/server.js (port 3001) 사용
const isLocal = window.location.hostname === 'localhost' && window.location.port === '3000';
const API_BASE = isLocal ? 'http://localhost:3001/api' : '/api/admin';

function getToken() {
  return localStorage.getItem('admin_token');
}
function setToken(t) {
  localStorage.setItem('admin_token', t);
}
function clearToken() {
  localStorage.removeItem('admin_token');
}

// ── 로그인 화면 ─────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '로그인 실패');
      setToken(data.token);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h2 className="admin-login-title">🔐 어드민 패널</h2>
        <p className="admin-login-subtitle">안연수 포트폴리오 관리</p>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="어드민 비밀번호 입력"
              autoFocus
            />
          </Form.Group>
          <Button type="submit" className="w-100 admin-btn-primary" disabled={loading}>
            {loading ? <Spinner size="sm" /> : '로그인'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

// ── JSON 에디터 탭 (설명 패널 포함) ─────────────────────────
const JSON_DESCRIPTIONS = {
  projects: {
    title: '프로젝트 데이터',
    desc: '각 프로젝트는 아래 구조를 가집니다:',
    example: `[
  {
    "id": 1,
    "title": "프로젝트 이름",
    "description": "설명",
    "tags": ["ROS", "Python"],
    "github": "https://github.com/...",
    "demo": "",
    "featured": true
  }
]`,
  },
  organizations: {
    title: '경력/활동 데이터',
    desc: '각 경력/활동 항목의 구조:',
    example: `[
  {
    "id": 1,
    "name": "소속 이름",
    "role": "역할",
    "period": "2023.03 ~ 현재",
    "description": "활동 내용",
    "tags": ["ROS", "팀 프로젝트"]
  }
]`,
  },
  skills: {
    title: '기술 스택 데이터',
    desc: '카테고리별 기술 스택 구조 (icon은 react-icons 이름):',
    example: `[
  {
    "category": "Programming",
    "items": [
      { "name": "Python", "icon": "SiPython" },
      { "name": "C++", "icon": "SiCplusplus" }
    ]
  }
]`,
  },
  githubDescriptions: {
    title: 'GitHub 저장소 설명',
    desc: '저장소 이름을 키로, 한국어 설명을 값으로 입력합니다:',
    example: `{
  "repo-name": "이 저장소에 대한 한국어 설명",
  "another-repo": "또 다른 저장소 설명"
}`,
  },
};

function DataEditor({ name, label, token }) {
  const [sha, setSha] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };
  const info = JSON_DESCRIPTIONS[name];

  const load = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/data/${name}`, { headers: authHeaders });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '로드 실패');
      setSha(json.sha || '');
      setText(JSON.stringify(json.data, null, 2));
    } catch (err) {
      setStatus({ type: 'danger', message: err.message });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, token]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const parsed = JSON.parse(text);
      const res = await fetch(`${API_BASE}/data/${name}`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsed, sha }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '저장 실패');
      setStatus({ type: 'success', message: json.message || '저장 완료!' });
      setSha('');
    } catch (err) {
      setStatus({ type: 'danger', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" />
      <p className="mt-2 text-muted">{label} 데이터 불러오는 중...</p>
    </div>
  );

  return (
    <div className="data-editor">
      {info && (
        <div className="json-info-panel mb-4">
          <div className="json-info-title">{info.title}</div>
          <p className="json-info-desc">{info.desc}</p>
          <pre className="json-info-example">{info.example}</pre>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{label} 편집</h5>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={load}>새로고침</Button>
          <Button className="admin-btn-primary" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" /> : '저장 & 배포'}
          </Button>
        </div>
      </div>
      {status && <Alert variant={status.type} dismissible onClose={() => setStatus(null)}>{status.message}</Alert>}
      <Form.Control
        as="textarea"
        className="json-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={24}
        spellCheck={false}
      />
      <p className="text-muted small mt-2">
        JSON을 직접 수정한 뒤 "저장 & 배포"를 누르면 GitHub에 커밋되고 Vercel이 자동으로 사이트를 업데이트합니다.
      </p>
    </div>
  );
}

// ── 프로필 폼 에디터 ─────────────────────────────────────────
function ProfileEditor({ token }) {
  const [sha, setSha] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    nameEn: '',
    email: '',
    cvUrl: '',
    heroDescription: '',
    heroDescriptionEn: '',
    typingStrings: '',
    typingStringsEn: '',
    githubUrl: '',
    notionUrl: '',
    blogUrl: '',
    githubUsername: '',
    overviewBio1: '',
    overviewBio1En: '',
    overviewBio2: '',
    overviewBio2En: '',
    aboutBio1: '',
    aboutBio1En: '',
    aboutBio2: '',
    aboutBio2En: '',
  });
  const [achievements, setAchievements] = useState([]);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/data/profile`, { headers: authHeaders });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '로드 실패');
      setSha(json.sha || '');
      const d = json.data;
      setForm({
        name: d.name || '',
        nameEn: d.nameEn || '',
        email: d.email || '',
        cvUrl: d.cvUrl || '',
        heroDescription: d.heroDescription || '',
        heroDescriptionEn: d.heroDescriptionEn || '',
        typingStrings: Array.isArray(d.typingStrings) ? d.typingStrings.join(', ') : '',
        typingStringsEn: Array.isArray(d.typingStringsEn) ? d.typingStringsEn.join(', ') : '',
        githubUrl: d.socialLinks?.github || '',
        notionUrl: d.socialLinks?.notion || '',
        blogUrl: d.socialLinks?.blog || '',
        githubUsername: d.githubUsername || '',
        overviewBio1: d.overviewBio1 || '',
        overviewBio1En: d.overviewBio1En || '',
        overviewBio2: d.overviewBio2 || '',
        overviewBio2En: d.overviewBio2En || '',
        aboutBio1: d.aboutBio1 || '',
        aboutBio1En: d.aboutBio1En || '',
        aboutBio2: d.aboutBio2 || '',
        aboutBio2En: d.aboutBio2En || '',
      });
      setAchievements(d.achievements || []);
    } catch (err) {
      setStatus({ type: 'danger', message: err.message });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAchievementChange = (idx, key, value) => {
    setAchievements((prev) => prev.map((a, i) => i === idx ? { ...a, [key]: value } : a));
  };

  const addAchievement = () => {
    setAchievements((prev) => [...prev, { emoji: '', label: '' }]);
  };

  const removeAchievement = (idx) => {
    setAchievements((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const splitStrings = (str) => str.split(',').map((s) => s.trim()).filter(Boolean);
      const data = {
        name: form.name,
        nameEn: form.nameEn,
        githubUsername: form.githubUsername,
        email: form.email,
        cvUrl: form.cvUrl,
        typingStrings: splitStrings(form.typingStrings),
        typingStringsEn: splitStrings(form.typingStringsEn),
        heroDescription: form.heroDescription,
        heroDescriptionEn: form.heroDescriptionEn,
        achievements,
        overviewBio1: form.overviewBio1,
        overviewBio1En: form.overviewBio1En,
        overviewBio2: form.overviewBio2,
        overviewBio2En: form.overviewBio2En,
        aboutBio1: form.aboutBio1,
        aboutBio1En: form.aboutBio1En,
        aboutBio2: form.aboutBio2,
        aboutBio2En: form.aboutBio2En,
        socialLinks: {
          github: form.githubUrl,
          notion: form.notionUrl,
          blog: form.blogUrl,
        },
      };

      const res = await fetch(`${API_BASE}/data/profile`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, sha }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '저장 실패');
      setStatus({ type: 'success', message: json.message || '저장 완료! Vercel이 자동 배포를 시작합니다.' });
      setSha('');
    } catch (err) {
      setStatus({ type: 'danger', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" />
      <p className="mt-2 text-muted">프로필 데이터 불러오는 중...</p>
    </div>
  );

  return (
    <div className="data-editor profile-form-editor">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">프로필 편집</h5>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={load}>새로고침</Button>
          <Button className="admin-btn-primary" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" /> : '저장 & 배포'}
          </Button>
        </div>
      </div>

      {status && <Alert variant={status.type} dismissible onClose={() => setStatus(null)}>{status.message}</Alert>}

      <div className="profile-form-section">
        <div className="profile-form-section-title">기본 정보</div>
        <Row>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">이름 (한국어)</label>
              <input className="pf-input" value={form.name} onChange={handleField('name')} placeholder="안연수" />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">영문 이름</label>
              <input className="pf-input" value={form.nameEn} onChange={handleField('nameEn')} placeholder="Yeonsu An" />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">이메일</label>
              <input className="pf-input" type="email" value={form.email} onChange={handleField('email')} placeholder="email@example.com" />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">GitHub 사용자명</label>
              <input className="pf-input" value={form.githubUsername} onChange={handleField('githubUsername')} placeholder="MOSW626" />
            </div>
          </Col>
          <Col md={12}>
            <div className="pf-group">
              <label className="pf-label">CV URL <span className="pf-hint">Google Drive 링크 또는 PDF URL — 비워두면 "곧 업로드" 토스트 표시</span></label>
              <input className="pf-input" value={form.cvUrl} onChange={handleField('cvUrl')} placeholder="Google Drive 링크 또는 PDF URL" />
            </div>
          </Col>
        </Row>
      </div>

      <div className="profile-form-section">
        <div className="profile-form-section-title">소셜 링크</div>
        <Row>
          <Col md={4}>
            <div className="pf-group">
              <label className="pf-label">GitHub URL</label>
              <input className="pf-input" value={form.githubUrl} onChange={handleField('githubUrl')} placeholder="https://github.com/..." />
            </div>
          </Col>
          <Col md={4}>
            <div className="pf-group">
              <label className="pf-label">Notion URL</label>
              <input className="pf-input" value={form.notionUrl} onChange={handleField('notionUrl')} placeholder="https://notion.so/..." />
            </div>
          </Col>
          <Col md={4}>
            <div className="pf-group">
              <label className="pf-label">Blog URL</label>
              <input className="pf-input" value={form.blogUrl} onChange={handleField('blogUrl')} placeholder="https://..." />
            </div>
          </Col>
        </Row>
      </div>

      <div className="profile-form-section">
        <div className="profile-form-section-title">메인 소개문 (Hero)</div>
        <Row>
          <Col md={12}>
            <div className="pf-group">
              <label className="pf-label">한국어 한줄 소개 <span className="pf-hint">HTML 태그 허용 (예: &lt;strong&gt;강조&lt;/strong&gt;)</span></label>
              <textarea className="pf-textarea" rows={3} value={form.heroDescription} onChange={handleField('heroDescription')} />
            </div>
          </Col>
          <Col md={12}>
            <div className="pf-group">
              <label className="pf-label">영문 한줄 소개</label>
              <textarea className="pf-textarea" rows={3} value={form.heroDescriptionEn} onChange={handleField('heroDescriptionEn')} />
            </div>
          </Col>
        </Row>
      </div>

      <div className="profile-form-section">
        <div className="profile-form-section-title">타이핑 문구</div>
        <Row>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">한국어 타이핑 문구 <span className="pf-hint">쉼표로 구분 (예: 로봇 공학자, ROS 개발자)</span></label>
              <input className="pf-input" value={form.typingStrings} onChange={handleField('typingStrings')} placeholder="로봇 공학자, ROS 개발자, Robot Developer" />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">영문 타이핑 문구 <span className="pf-hint">쉼표로 구분</span></label>
              <input className="pf-input" value={form.typingStringsEn} onChange={handleField('typingStringsEn')} placeholder="Robotics Engineer, ROS Developer" />
            </div>
          </Col>
        </Row>
      </div>

      <div className="profile-form-section">
        <div className="profile-form-section-title">Overview 소개 (홈 하단)</div>
        <Row>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">한국어 Bio 1</label>
              <textarea className="pf-textarea" rows={3} value={form.overviewBio1} onChange={handleField('overviewBio1')} />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">영문 Bio 1</label>
              <textarea className="pf-textarea" rows={3} value={form.overviewBio1En} onChange={handleField('overviewBio1En')} />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">한국어 Bio 2</label>
              <textarea className="pf-textarea" rows={3} value={form.overviewBio2} onChange={handleField('overviewBio2')} />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">영문 Bio 2</label>
              <textarea className="pf-textarea" rows={3} value={form.overviewBio2En} onChange={handleField('overviewBio2En')} />
            </div>
          </Col>
        </Row>
      </div>

      <div className="profile-form-section">
        <div className="profile-form-section-title">About 소개 (About 페이지)</div>
        <Row>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">한국어 Bio 1</label>
              <textarea className="pf-textarea" rows={3} value={form.aboutBio1} onChange={handleField('aboutBio1')} />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">영문 Bio 1</label>
              <textarea className="pf-textarea" rows={3} value={form.aboutBio1En} onChange={handleField('aboutBio1En')} />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">한국어 Bio 2</label>
              <textarea className="pf-textarea" rows={3} value={form.aboutBio2} onChange={handleField('aboutBio2')} />
            </div>
          </Col>
          <Col md={6}>
            <div className="pf-group">
              <label className="pf-label">영문 Bio 2</label>
              <textarea className="pf-textarea" rows={3} value={form.aboutBio2En} onChange={handleField('aboutBio2En')} />
            </div>
          </Col>
        </Row>
      </div>

      <div className="profile-form-section">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="profile-form-section-title mb-0">수상/성취 배지</div>
          <button className="pf-add-btn" onClick={addAchievement}>+ 항목 추가</button>
        </div>
        {achievements.length === 0 && (
          <p className="text-muted small">아직 배지가 없습니다. "항목 추가"를 눌러 추가하세요.</p>
        )}
        {achievements.map((ach, idx) => (
          <div key={idx} className="achievement-row">
            <input
              className="pf-input achievement-emoji-input"
              value={ach.emoji}
              onChange={(e) => handleAchievementChange(idx, 'emoji', e.target.value)}
              placeholder="🏆"
              maxLength={4}
            />
            <input
              className="pf-input achievement-label-input"
              value={ach.label}
              onChange={(e) => handleAchievementChange(idx, 'label', e.target.value)}
              placeholder="수상명 또는 경력"
            />
            <button className="pf-remove-btn" onClick={() => removeAchievement(idx)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 메인 어드민 패널 ────────────────────────────────────────
const TABS = [
  { key: 'profile', label: '프로필' },
  { key: 'projects', label: '프로젝트' },
  { key: 'organizations', label: '경력' },
  { key: 'skills', label: '기술 스택' },
  { key: 'githubDescriptions', label: 'GitHub 설명' },
];

function AdminPanel({ token, onLogout }) {
  return (
    <div className="admin-panel">
      <div className="admin-topbar">
        <span className="admin-topbar-title">🛠️ 어드민 패널</span>
        <Button variant="outline-danger" size="sm" onClick={onLogout}>로그아웃</Button>
      </div>
      <Container fluid className="py-4">
        <Tab.Container defaultActiveKey="profile">
          <Row>
            <Col md={2}>
              <Nav variant="pills" className="flex-column admin-nav">
                {TABS.map((t) => (
                  <Nav.Item key={t.key}>
                    <Nav.Link eventKey={t.key}>{t.label}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
            <Col md={10}>
              <Tab.Content>
                <Tab.Pane eventKey="profile">
                  <ProfileEditor token={token} />
                </Tab.Pane>
                {TABS.filter((t) => t.key !== 'profile').map((t) => (
                  <Tab.Pane key={t.key} eventKey={t.key}>
                    <DataEditor name={t.key} label={t.label} token={token} />
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
}

// ── 최상위 컴포넌트 ─────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState(getToken);

  const handleLogin = (t) => setToken(t);
  const handleLogout = () => {
    clearToken();
    setToken(null);
  };

  if (!token) return <LoginForm onLogin={handleLogin} />;
  return <AdminPanel token={token} onLogout={handleLogout} />;
}
