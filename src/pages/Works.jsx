import { useState, useEffect } from 'react';
import { useLang, t } from '../i18n.js';
import ProjectCard from '../components/ProjectCard.jsx';
import { flattenWorks, worksInGroup, sortByPeriodDesc } from '../lib/works.js';
import '../components/Projects.css';
import './Pages.css';

export default function Works() {
  const { lang } = useLang();
  const [group, setGroup] = useState('all');
  const filters = [
    { key: 'all', label: t(lang, '전체', 'All') },
    { key: 'project', label: t(lang, '프로젝트', 'Projects') },
    { key: 'robot', label: t(lang, '로봇 개발', 'Robotics') },
    { key: 'video', label: t(lang, '영상 제작', 'Video') },
  ];
  const items = sortByPeriodDesc(worksInGroup(flattenWorks(), group));

  // 필터 전환 시 카드가 remount 되므로(App 전역 옵저버는 라우트 변경에만 반응)
  // 새로 붙은 .reveal 카드를 다시 관찰해 stagger 등장을 재생한다.
  useEffect(() => {
    const els = document.querySelectorAll('.projects__grid .reveal:not(.is-visible)');
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
  }, [group]);

  return (
    <section className="section page">
      <div className="container">
        <h1 className="section__title">{t(lang, '작업', 'Works')}</h1>
        <div className="projects__tabs">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`projects__tab ${group === f.key ? 'is-active' : ''}`}
              onClick={() => setGroup(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="projects__grid">
          {items.map((p, i) => (
            <ProjectCard key={`${group}-${i}`} work={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
