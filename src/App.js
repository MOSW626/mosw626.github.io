import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import OrganizationsPage from './pages/OrganizationsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import profile from './data/profile.json';
import { FaHome, FaUser, FaProjectDiagram, FaBuilding, FaEnvelope, FaGithub, FaEnvelopeOpen, FaFileDownload, FaBars } from 'react-icons/fa';

export const LanguageContext = React.createContext('ko');

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { lang, setLang } = useContext(LanguageContext);
  const location = useLocation();

  const navItems = [
    { path: '/', label: lang === 'en' ? 'Home' : '홈', icon: <FaHome /> },
    { path: '/about', label: lang === 'en' ? 'About' : '소개', icon: <FaUser /> },
    { path: '/projects', label: lang === 'en' ? 'Projects' : '프로젝트', icon: <FaProjectDiagram /> },
    { path: '/organizations', label: lang === 'en' ? 'Organizations' : '소속', icon: <FaBuilding /> },
    { path: '/contact', label: lang === 'en' ? 'Contact' : '연락처', icon: <FaEnvelope /> },
  ];

  const isActive = (path) => location.pathname === path;

  const handleDownloadCV = () => {
    if (profile.cvUrl) {
      window.open(profile.cvUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return lang === 'en' ? 'Home' : '홈';
      case '/about':
        return lang === 'en' ? 'About' : '소개';
      case '/projects':
        return lang === 'en' ? 'Projects' : '프로젝트';
      case '/organizations':
        return lang === 'en' ? 'Organizations' : '소속';
      case '/contact':
        return lang === 'en' ? 'Contact' : '연락처';
      default:
        return '';
    }
  };

  return (
    <div className="App">
      {/* 사이드바 오버레이 (모바일) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={handleCloseSidebar}
          role="presentation"
        />
      )}

      {/* 사이드바 */}
      <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        {/* 프로필 섹션 */}
        <div className="sidebar-profile">
          <div className="sidebar-avatar">
            <img
              src="/assets/profile.jpg"
              alt={profile.name}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* 이미지 로드 실패 시 폴백은 CSS background-image 또는 별도 상태로 처리 */}
          </div>
          <div className="sidebar-name">{lang === 'en' ? profile.nameEn || profile.name : profile.name}</div>
          <div className="sidebar-title">{lang === 'en' ? profile.titleEn || profile.title : profile.title}</div>
        </div>

        {/* 네비게이션 */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-title">{lang === 'en' ? 'Navigation' : '메뉴'}</div>
          <ul className="sidebar-nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="sidebar-nav-item">
                <Link
                  to={item.path}
                  className={`sidebar-nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={handleCloseSidebar}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 연락처 정보 */}
        <div className="sidebar-contact">
          <div className="sidebar-contact-title">{lang === 'en' ? 'Contact' : '연락처'}</div>
          <div className="sidebar-contact-item">
            <span className="sidebar-contact-icon">
              <FaEnvelopeOpen />
            </span>
            <span className="sidebar-contact-value">{profile.email}</span>
          </div>
          {profile.phone && (
            <div className="sidebar-contact-item">
              <span className="sidebar-contact-icon">📱</span>
              <span className="sidebar-contact-value">{profile.phone}</span>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="sidebar-actions">
          <button className="sidebar-btn" onClick={handleDownloadCV}>
            <FaFileDownload />
            {lang === 'en' ? 'Download CV' : 'CV 다운로드'}
          </button>
          <a
            href={profile.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-btn"
          >
            <FaGithub />
            GitHub
          </a>
          <button
            className="sidebar-btn"
            onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
          >
            {lang === 'en' ? '한국어' : 'English'}
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        {/* 헤더 */}
        <header className="header">
          <button
            className="header-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            <FaBars />
          </button>
          <div className="header-title">{getPageTitle()}</div>
          <div className="header-spacer" />
        </header>

        {/* 콘텐츠 영역 */}
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>

        {/* 푸터 (main-content 내부) */}
        <Footer />
      </div>
    </div>
  );
}

function App() {
  const [lang, setLang] = useState('ko');

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <BrowserRouter basename={process.env.PUBLIC_URL || ''}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </BrowserRouter>
    </LanguageContext.Provider>
  );
}

export default App;
