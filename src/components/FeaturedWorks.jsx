import { Link } from 'react-router-dom';
import { useLang, t } from '../i18n.js';
import ProjectCard from './ProjectCard.jsx';
import { featuredWorks } from '../lib/works.js';
import './Projects.css';

export default function FeaturedWorks() {
  const { lang } = useLang();
  const items = featuredWorks();
  return (
    <section id="works" className="section">
      <div className="container">
        <h2 className="section__title">{t(lang, '대표 작업', 'Featured Work')}</h2>
        <div className="projects__grid">
          {items.map((p, i) => (
            <ProjectCard key={i} work={p} index={i} />
          ))}
        </div>
        <p className="featured__more">
          <Link to="/works">{t(lang, '전체 작업 보기 →', 'View all work →')}</Link>
        </p>
      </div>
    </section>
  );
}
