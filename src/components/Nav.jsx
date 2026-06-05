import { FaGithub } from 'react-icons/fa';
import { useLang, t } from '../i18n.js';
import profile from '../data/profile.json';
import './Nav.css';

export default function Nav() {
  const { lang, setLang } = useLang();
  const links = [
    { href: '#about', label: t(lang, '소개', 'About') },
    { href: '#projects', label: t(lang, '프로젝트', 'Projects') },
    { href: '#contact', label: t(lang, '연락처', 'Contact') },
  ];
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__brand" href="#home">YS AN</a>
        <nav className="nav__links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
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
