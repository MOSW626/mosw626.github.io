import { Link } from 'react-router-dom';
import { useLang, pick, t } from '../i18n.js';
import profile from '../data/profile.json';
import skills from '../data/skills.json';
import { flattenWorks, sortByPeriodDesc } from '../lib/works.js';
import { usePageMeta } from '../lib/meta.js';
import './Cv.css';

const EDUCATION = [
  { period: '2025 – Present', ko: 'KAIST 기계공학과', en: 'KAIST — Mechanical Engineering' },
  { period: '2021 – 2024', ko: '충북과학고등학교', en: 'Chungbuk Science High School' },
];

const EXPERIENCE = [
  {
    period: '2026.06 – Present',
    roleKo: '공동창립자', roleEn: 'Co-founder',
    orgKo: 'Roboticus — 대학생 로봇 빌더 커뮤니티',
    orgEn: 'Roboticus — University Robot-Builder Community',
    ko: 'KAIST·SNU 로봇 동아리를 기반으로 커뮤니티를 공동창립하고 해커톤·교육·네트워킹을 운영.',
    en: 'Co-founded a community based on the KAIST and SNU robotics clubs; run hackathons, education, and networking.',
  },
  {
    period: '2025 – 2026',
    roleKo: '개발 총괄', roleEn: 'Lead Developer',
    orgKo: 'KAIST 기계공학과 학생회 플랫폼 (MESC)',
    orgEn: 'KAIST Mech. Eng. Student Council Platform (MESC)',
    ko: '공지·학생회비 조회·예산 투명성·자료실을 통합한 웹서비스를 기획부터 개발·운영·보수까지 총괄.',
    en: 'Owned an integrated web service end to end — announcements, fee lookup, budget transparency, and resources.',
  },
];

const AWARDS = [
  { year: '2022', ko: '제68회 전국과학전람회 대통령상 — 줄다리기 로봇 ‘줄줄이’ (2,607팀 중 1점)', en: 'Presidential Prize, 68th National Science Exhibition — tug-of-war robot ‘Jul-jul-i’ (1 of 2,607 teams)' },
  { year: '2021', ko: '제67회 전국과학전람회 국무총리상 — 그네타기 로봇 ‘근근이’ (2,308팀 중 1점)', en: 'Prime Minister’s Award, 67th National Science Exhibition — swing robot ‘Geun-geun-i’ (1 of 2,308 teams)' },
  { year: '2021', ko: '과학기술정보통신부 장관상 (최우수상) — 자동 중화 적정 기기', en: 'Minister of Science & ICT Award (Top Prize) — automatic titration device' },
  { year: '2023', ko: 'YSC 발표대회 선정', en: 'Selected for YSC (Young Scientist Contest)' },
];

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
                <span className="cv__detail">{t(lang, e.ko, e.en)}</span>
              </div>
            ))}
          </section>

          <section className="cv__block">
            <h2>{t(lang, '활동 · 경험', 'Experience')}</h2>
            {EXPERIENCE.map((e, i) => (
              <div key={i} className="cv__item">
                <div className="cv__item-head">
                  <span className="cv__detail">
                    <strong>{t(lang, e.roleKo, e.roleEn)}</strong> · {t(lang, e.orgKo, e.orgEn)}
                  </span>
                  <span className="cv__period">{e.period}</span>
                </div>
                <p className="cv__desc">{t(lang, e.ko, e.en)}</p>
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
                <span className="cv__detail">{t(lang, a.ko, a.en)}</span>
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
