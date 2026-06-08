import { useState } from 'react';
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
    { key: 'robot', label: t(lang, '로봇 개발', 'Robotics') },
    { key: 'video', label: t(lang, '영상 제작', 'Video') },
  ];
  const items = sortByPeriodDesc(worksInGroup(flattenWorks(), group));

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
            <ProjectCard key={`${group}-${i}`} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
