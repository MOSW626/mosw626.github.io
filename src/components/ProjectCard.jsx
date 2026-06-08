import { FaGithub, FaYoutube, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa';
import { useLang, pick, t } from '../i18n.js';
import { projectLinks } from '../lib/projects.js';

const LINK_META = {
  demo: { icon: FaGlobe, label: 'Live' },
  notion: { icon: FaExternalLinkAlt, label: 'Notion' },
  github: { icon: FaGithub, label: 'GitHub' },
  youtube: { icon: FaYoutube, label: 'YouTube' },
};

export default function ProjectCard({ project }) {
  const { lang } = useLang();
  const links = projectLinks(project);
  return (
    <article className="project-card">
      <div className="project-card__head">
        <h3>{pick(project, 'title', lang)}</h3>
        {project.period && <span className="project-card__period">{project.period}</span>}
      </div>
      <p className="project-card__desc">{pick(project, 'description', lang)}</p>
      {project.technologies?.length > 0 && (
        <div className="project-card__tags">
          {project.technologies.map((tech) => (
            <span key={tech} className="pill">{tech}</span>
          ))}
        </div>
      )}
      {links.length > 0 && (
        <div className="project-card__links">
          {links.map(({ kind, url }) => {
            const M = LINK_META[kind];
            const Icon = M.icon;
            return (
              <a key={kind} href={url} target="_blank" rel="noopener noreferrer">
                <Icon /> {M.label}
              </a>
            );
          })}
        </div>
      )}
    </article>
  );
}
