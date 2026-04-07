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

// ── JSON 에디터 탭 ──────────────────────────────────────────
function DataEditor({ name, label, token }) {
  const [sha, setSha] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState(null); // { type, message }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

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
      setSha(''); // 다음 save 시 재조회
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{label}</h5>
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
                {TABS.map((t) => (
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
