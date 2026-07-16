import { Link } from 'react-router-dom';
import {
  FaGithub, FaYoutube, FaExternalLinkAlt, FaGlobe,
  FaRobot, FaCode, FaVideo,
} from 'react-icons/fa';
import { useLang, pick } from '../i18n.js';
import { projectLinks } from '../lib/projects.js';

const LINK_META = {
  demo: { icon: FaGlobe, label: 'Live' },
  notion: { icon: FaExternalLinkAlt, label: 'Notion' },
  github: { icon: FaGithub, label: 'GitHub' },
  youtube: { icon: FaYoutube, label: 'YouTube' },
};

/** 이미지 없는 카드의 그룹별 플레이스홀더 아이콘 */
const GROUP_ICON = { robot: FaRobot, project: FaCode, video: FaVideo };

export default function ProjectCard({ work, index = 0 }) {
  const { lang } = useLang();
  const links = projectLinks(work);
  const PlaceholderIcon = GROUP_ICON[work.group] || FaCode;

  // 썸네일: 배경 제거 로봇 PNG는 contain(잘림 방지), 없으면 그룹 아이콘 플레이스홀더.
  // 이미지 유무와 무관하게 media 영역을 항상 렌더해 카드 높이를 일관되게 유지한다.
  const media = work.image ? (
    <div className="project-card__media">
      <img
        className="project-card__img"
        src={work.image}
        alt=""
        loading="lazy"
        width="1600"
        height="1000"
      />
    </div>
  ) : (
    <div className="project-card__media project-card__media--placeholder" aria-hidden="true">
      <PlaceholderIcon />
    </div>
  );

  const head = (
    <div className="project-card__head">
      <h3>{pick(work, 'title', lang)}</h3>
      {work.period && <span className="project-card__period">{work.period}</span>}
    </div>
  );

  // slug이 있으면 media+제목만 상세 링크로 감싼다. 하단 외부 링크 행은
  // 항상 이 링크 바깥에 두어 중첩 <a>를 만들지 않는다.
  const lead = work.slug ? (
    <Link className="project-card__lead" to={`/works/${work.slug}`}>
      {media}
      {head}
    </Link>
  ) : (
    <>
      {media}
      {head}
    </>
  );

  return (
    <article className="project-card reveal" style={{ '--i': Math.min(index, 6) }}>
      {lead}
      <div className="project-card__body">
        <p className="project-card__desc">{pick(work, 'description', lang)}</p>
        {work.technologies?.length > 0 && (
          <div className="project-card__tags">
            {work.technologies.map((tech) => (
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
      </div>
    </article>
  );
}
