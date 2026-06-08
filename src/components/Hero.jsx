import { Link } from 'react-router-dom';
import { FaGithub, FaArrowDown } from 'react-icons/fa';
import { useLang, pick, t } from '../i18n.js';
import profile from '../data/profile.json';
import './Hero.css';

export default function Hero() {
  const { lang } = useLang();
  const name = pick(profile, 'name', lang);
  const greeting = lang === 'en'
    ? <>Hi, I'm <span className="hero__name">{name}</span>.</>
    : <>안녕하세요, <span className="hero__name">{name}</span>입니다.</>;
  const title = lang === 'en' ? 'Robotics Engineer' : '로봇 공학자';
  const desc = pick(profile, 'heroDescription', lang);

  return (
    <section id="home" className="hero">
      <div className="container hero__inner reveal">
        <p className="hero__title">{title}</p>
        <h1 className="hero__greeting">{greeting}</h1>
        <p className="hero__desc" dangerouslySetInnerHTML={{ __html: desc }} />
        <div className="hero__badges">
          {(profile.achievements || []).map((a, i) => (
            <span key={i} className="pill">{a.emoji} {a.label}</span>
          ))}
        </div>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#works">
            {t(lang, '작업 보기', 'View Work')}
          </a>
          <Link className="btn btn--ghost" to="/cv">
            {t(lang, '이력서', 'CV')}
          </Link>
          <a className="btn btn--ghost" href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
            <FaGithub /> GitHub
          </a>
        </div>
        <a className="hero__scroll" href="#about" aria-label="Scroll to about"><FaArrowDown /></a>
      </div>
    </section>
  );
}
