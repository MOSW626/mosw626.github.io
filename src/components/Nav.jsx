import { Link, NavLink } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import { useLang, t } from '../i18n.js';
import profile from '../data/profile.json';
import './Nav.css';

export default function Nav() {
  const { lang, setLang } = useLang();
  const links = [
    { to: '/works', label: t(lang, '작업', 'Works') },
    { to: '/notes', label: t(lang, '기록', 'Notes') },
    { to: '/cv', label: t(lang, '이력서', 'CV') },
  ];
  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link className="nav__brand" to="/">YS AN</Link>
        <nav className="nav__links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              {l.label}
            </NavLink>
          ))}
          <button
            className="nav__lang"
            onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
            aria-label="Toggle language"
          >
            {lang === 'en' ? '한국어' : 'EN'}
          </button>
          <a
            className="nav__gh"
            href={profile.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </nav>
      </div>
    </header>
  );
}
