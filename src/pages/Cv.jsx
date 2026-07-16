import { Link } from 'react-router-dom';
import { useLang, pick, t } from '../i18n.js';
import profile from '../data/profile.json';
import skills from '../data/skills.json';
import cv from '../data/cv.json';
import { flattenWorks, sortByPeriodDesc } from '../lib/works.js';
import { usePageMeta } from '../lib/meta.js';
import './Cv.css';

const { education: EDUCATION, experience: EXPERIENCE, awards: AWARDS } = cv;

export default function Cv() {
  const { lang } = useLang();
  usePageMeta({
    title: 'CV',
    description: t(
      lang,
      '안연수의 이력서 — 학력, 경험, 주요 프로젝트, 수상 내역.',
      "Yeonsu An's CV — education, experience, selected projects, and awards."
    ),
  });
  // 주요 프로젝트: 소프트웨어 그룹 전체 + 대표작(featured) — 시작일 역순
  const projects = sortByPeriodDesc(
    flattenWorks().filter((w) => w.group === 'project' || w.featured)
  );

  return (
    <section className="section page">
      <div className="container">
        <div className="cv__actions">
          <Link to="/" className="cv__home">← {t(lang, '홈으로', 'Home')}</Link>
          <button className="btn btn--primary" onClick={() => window.print()}>
            {t(lang, '인쇄 / PDF 저장', 'Print / Save as PDF')}
          </button>
        </div>

        <article className="cv">
          <header className="cv__header">
            <h1>{pick(profile, 'name', lang)}</h1>
            <p className="cv__role">{t(lang, '로봇 · 소프트웨어 개발자', 'Robotics & Software Engineer')}</p>
            <p className="cv__contact">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>·</span>
              <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <span>·</span>
              <a href="https://mosw626.github.io" target="_blank" rel="noopener noreferrer">mosw626.github.io</a>
            </p>
          </header>

          <section className="cv__block">
            <h2>{t(lang, '소개', 'Summary')}</h2>
            <p>{pick(profile, 'aboutBio1', lang)}</p>
            <p>{pick(profile, 'aboutBio2', lang)}</p>
          </section>

          <section className="cv__block">
            <h2>{t(lang, '학력', 'Education')}</h2>
            {EDUCATION.map((e, i) => (
              <div key={i} className="cv__row">
                <span className="cv__period">{e.period}</span>
                <span className="cv__detail">{pick(e, 'detail', lang)}</span>
              </div>
            ))}
          </section>

          <section className="cv__block">
            <h2>{t(lang, '활동 · 경험', 'Experience')}</h2>
            {EXPERIENCE.map((e, i) => (
              <div key={i} className="cv__item">
                <div className="cv__item-head">
                  <span className="cv__detail">
                    <strong>{pick(e, 'role', lang)}</strong> · {pick(e, 'org', lang)}
                  </span>
                  <span className="cv__period">{e.period}</span>
                </div>
                <p className="cv__desc">{pick(e, 'desc', lang)}</p>
              </div>
            ))}
          </section>

          <section className="cv__block">
            <h2>{t(lang, '주요 프로젝트', 'Selected Projects')}</h2>
            {projects.map((w, i) => (
              <div key={i} className="cv__item">
                <div className="cv__item-head">
                  <span className="cv__detail"><strong>{pick(w, 'title', lang)}</strong></span>
                  <span className="cv__period">{w.period}</span>
                </div>
                <p className="cv__desc">{pick(w, 'description', lang)}</p>
                {w.technologies?.length > 0 && (
                  <p className="cv__tech">{w.technologies.join(' · ')}</p>
                )}
              </div>
            ))}
          </section>

          <section className="cv__block">
            <h2>{t(lang, '수상 · 선정', 'Awards')}</h2>
            {AWARDS.map((a, i) => (
              <div key={i} className="cv__row">
                <span className="cv__period">{a.year}</span>
                <span className="cv__detail">{pick(a, 'detail', lang)}</span>
              </div>
            ))}
          </section>

          <section className="cv__block">
            <h2>{t(lang, '기술 스택', 'Skills')}</h2>
            {skills.map((g) => (
              <div key={g.category} className="cv__row">
                <span className="cv__period">{g.category}</span>
                <span className="cv__detail">{g.items.map((it) => it.name).join(' · ')}</span>
              </div>
            ))}
          </section>
        </article>
      </div>
    </section>
  );
}
