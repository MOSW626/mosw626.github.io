import { useState } from 'react';
import { useLang, t } from '../i18n.js';
import ProjectCard from './ProjectCard.jsx';
import data from '../data/projects.json';
import './Projects.css';

export default function Projects() {
  const { lang } = useLang();
  const tabs = [
    { key: 'robotDevelopment', label: t(lang, '로봇 개발', 'Robotics') },
    { key: 'videoProduction', label: t(lang, '영상 제작', 'Video') },
  ];
  const [active, setActive] = useState('robotDevelopment');
  const items = data[active] || [];

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section__title">{t(lang, '프로젝트', 'Projects')}</h2>
        <div className="projects__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`projects__tab ${active === tab.key ? 'is-active' : ''}`}
              onClick={() => setActive(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="projects__grid reveal">
          {items.map((p, i) => (
            <ProjectCard key={`${active}-${i}`} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
