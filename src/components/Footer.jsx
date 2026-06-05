import { useLang, t } from '../i18n.js';
import './Footer.css';

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="footer">
      <div className="container">
        <span>© 2024 안연수 · Yeonsu An</span>
        <span>{t(lang, 'Vite + React로 제작', 'Built with Vite + React')}</span>
      </div>
    </footer>
  );
}
