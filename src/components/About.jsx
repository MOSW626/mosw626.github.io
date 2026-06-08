import { useLang, pick, t } from '../i18n.js';
import { iconFor } from '../lib/icons.js';
import profile from '../data/profile.json';
import skills from '../data/skills.json';
import './About.css';

const TIMELINE = [
  { year: '~2020', ko: '중학교 때부터 로봇 제작 시작', en: 'Started building robots in middle school' },
  { year: '2021–2024', ko: '충북과학고등학교 재학', en: 'Chungbuk Science High School' },
  { year: '2022', ko: '전국과학전람회 대통령상', en: 'Presidential Prize — National Science Exhibition' },
  { year: '2023', ko: 'YSC 발표대회 선정', en: 'Selected for YSC' },
  { year: '2025', ko: 'KAIST 기계공학과 입학', en: 'Entered KAIST, Mechanical Engineering' },
  { year: '2025–2026', ko: '기계공학과 학생회 플랫폼(MESC) 개발 총괄', en: 'Led the Mech. Eng. Student Council platform (MESC)' },
  { year: '2026', ko: 'Roboticus 공동창립 · 개인 프로젝트 다수', en: 'Co-founded Roboticus · multiple personal projects' },
];

export default function About() {
  const { lang } = useLang();
  return (
    <section id="about" className="section section--alt">
      <div className="container">
        <h2 className="section__title">{t(lang, '소개', 'About')}</h2>
        <div className="about__grid">
          <div className="about__bio reveal">
            <p>{pick(profile, 'aboutBio1', lang)}</p>
            <p>{pick(profile, 'aboutBio2', lang)}</p>
          </div>
          <ul className="about__timeline reveal">
            {TIMELINE.map((e, i) => (
              <li key={i}>
                <span className="about__year">{e.year}</span>
                <span className="about__event">{t(lang, e.ko, e.en)}</span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="about__skills-title">{t(lang, '기술 스택', 'Skills')}</h3>
        <div className="about__skills reveal">
          {skills.map((group) => (
            <div key={group.category} className="skill-group">
              <h4>{group.category}</h4>
              <div className="skill-items">
                {group.items.map((item) => {
                  const Icon = iconFor(item.icon);
                  return (
                    <span key={item.name} className="skill-item">
                      <Icon /> {item.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
