import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LanguageContext } from './i18n.js';
import { getInitialTheme, setTheme } from './lib/theme.js';
import ScrollToTop from './components/ScrollToTop.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Works from './pages/Works.jsx';
import LogList from './pages/LogList.jsx';
import LogPost from './pages/LogPost.jsx';
import Cv from './pages/Cv.jsx';

export default function App() {
  const [lang, setLang] = useState('ko');
  const [theme, setThemeState] = useState(getInitialTheme);
  const location = useLocation();

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  };

  // 라우트가 바뀔 때마다 현재 화면의 .reveal 요소를 다시 관찰
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-visible)');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [location.pathname]);

  // 언어 변경 시 <html lang> 동기화
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <ScrollToTop />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/notes" element={<LogList />} />
          <Route path="/notes/:slug" element={<LogPost />} />
          <Route path="/cv" element={<Cv />} />
        </Routes>
      </main>
      <Footer />
    </LanguageContext.Provider>
  );
}
