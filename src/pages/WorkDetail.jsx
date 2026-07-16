import { useRef, useState, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  FaGithub, FaYoutube, FaGlobe, FaExternalLinkAlt,
  FaFilePdf, FaArrowLeft, FaArrowRight, FaTrophy,
} from 'react-icons/fa';
import { findWorkBySlug, adjacentWorks } from '../lib/works.js';
import { useLang, pick, t } from '../i18n.js';
import { usePageMeta } from '../lib/meta.js';
import './WorkDetail.css';

const LINK_META = {
  demo: { icon: FaGlobe, label: 'Live' },
  notion: { icon: FaExternalLinkAlt, label: 'Notion' },
  github: { icon: FaGithub, label: 'GitHub' },
  youtube: { icon: FaYoutube, label: 'YouTube' },
};

export default function WorkDetail() {
  const { slug } = useParams();
  const { lang } = useLang();
  const work = findWorkBySlug(slug);

  // 훅은 조건부 return 이전에 호출 — work가 null이어도 안전하게 처리
  usePageMeta({
    title: work ? pick(work, 'title', lang) : undefined,
    description: work ? pick(work, 'description', lang) : undefined,
    image: work ? work.image : undefined,
  });

  // 알 수 없는 slug → 목록으로
  if (!work) return <Navigate to="/works" replace />;

  const { prev, next } = adjacentWorks(slug);
  const backLabel = t(lang, '← Works', '← Works');

  return (
    <article className="wd">
      <div className="container wd__inner">
        <Link className="wd__back" to="/works">{backLabel}</Link>

        <Hero work={work} lang={lang} />
        <Meta work={work} lang={lang} />
        <Timeline work={work} lang={lang} />
        <Videos work={work} lang={lang} />
        <Gallery work={work} lang={lang} />
        <AwardPress work={work} lang={lang} />
        <Links work={work} lang={lang} />
        <PrevNext prev={prev} next={next} lang={lang} />
      </div>
    </article>
  );
}

/* ── hero ─────────────────────────────────────────────── */
function Hero({ work, lang }) {
  return (
    <header className="wd-hero reveal">
      {work.image && (
        <div className="wd-hero__media">
          <img
            className="wd-hero__img"
            src={work.image}
            alt=""
            width="1600"
            height="1000"
            loading="eager"
          />
        </div>
      )}
      <h1 className="wd-hero__title">{pick(work, 'title', lang)}</h1>
      <p className="wd-hero__desc">{pick(work, 'description', lang)}</p>
    </header>
  );
}

/* ── meta 바 ──────────────────────────────────────────── */
function Meta({ work, lang }) {
  const team = pick(work, 'team', lang);
  const techs = work.technologies || [];
  const hasAward = !!work.award;
  if (!work.period && !team && techs.length === 0 && !hasAward) return null;

  return (
    <section className="wd-meta reveal">
      <div className="wd-meta__facts">
        {work.period && <span className="wd-meta__fact">{work.period}</span>}
        {team && <span className="wd-meta__fact">{team}</span>}
        {hasAward && (
          <span className="wd-meta__award">
            <FaTrophy aria-hidden="true" />
            {pick(work.award, 'title', lang)}
          </span>
        )}
      </div>
      {techs.length > 0 && (
        <div className="wd-meta__tags">
          {techs.map((tech) => (
            <span key={tech} className="pill">{tech}</span>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── timeline (Task 6이 데이터 채우면 렌더) ───────────── */
function Timeline({ work, lang }) {
  const items = work.timeline;
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section className="wd-section reveal">
      <h2 className="wd-section__title">{t(lang, '타임라인', 'Timeline')}</h2>
      <ol className="wd-timeline">
        {items.map((it, i) => (
          <li key={i} className="wd-timeline__item">
            <div className="wd-timeline__marker" aria-hidden="true" />
            <div className="wd-timeline__body">
              <div className="wd-timeline__head">
                {pick(it, 'version', lang) && (
                  <span className="wd-timeline__version">{pick(it, 'version', lang)}</span>
                )}
                {it.period && <span className="wd-timeline__period">{it.period}</span>}
              </div>
              {pick(it, 'desc', lang) && (
                <p className="wd-timeline__desc">{pick(it, 'desc', lang)}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── videos ───────────────────────────────────────────── */
function Videos({ work, lang }) {
  const videos = work.videos;
  if (!Array.isArray(videos) || videos.length === 0) return null;

  return (
    <section className="wd-section reveal">
      <h2 className="wd-section__title">{t(lang, '영상', 'Videos')}</h2>
      <div className="wd-videos">
        {videos.map((v, i) => (
          <figure key={v.src || i} className="wd-video">
            <video
              className="wd-video__el"
              controls
              preload="metadata"
              {...(v.poster ? { poster: v.poster } : {})}
              src={v.src}
            />
            {pick(v, 'label', lang) && (
              <figcaption className="wd-video__cap">{pick(v, 'label', lang)}</figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ── gallery (+ <dialog> 라이트박스) ──────────────────── */
function Gallery({ work, lang }) {
  const images = work.gallery;
  const dialogRef = useRef(null);
  const [active, setActive] = useState(null);

  const open = useCallback((img) => {
    setActive(img);
    dialogRef.current?.showModal();
  }, []);
  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);
  // 배경(backdrop) 클릭 시 닫기 — dialog 자체가 클릭 타깃일 때만
  const onDialogClick = useCallback((e) => {
    if (e.target === dialogRef.current) close();
  }, [close]);

  if (!Array.isArray(images) || images.length === 0) return null;

  return (
    <section className="wd-section reveal">
      <h2 className="wd-section__title">{t(lang, '갤러리', 'Gallery')}</h2>
      <div className="wd-gallery">
        {images.map((img, i) => (
          <button
            key={img.src || i}
            type="button"
            className="wd-gallery__item"
            onClick={() => open(img)}
            aria-label={t(lang, '이미지 확대', 'Enlarge image')}
          >
            <img
              src={img.src}
              alt={pick(img, 'alt', lang) || ''}
              loading="lazy"
              width="800"
              height="1000"
            />
          </button>
        ))}
      </div>

      <dialog ref={dialogRef} className="wd-lightbox" onClick={onDialogClick} onClose={() => setActive(null)}>
        {active && (
          <div className="wd-lightbox__inner">
            <button
              type="button"
              className="wd-lightbox__close"
              onClick={close}
              aria-label={t(lang, '닫기', 'Close')}
            >
              ×
            </button>
            <img
              className="wd-lightbox__img"
              src={active.src}
              alt={pick(active, 'alt', lang) || ''}
            />
            {pick(active, 'alt', lang) && (
              <p className="wd-lightbox__cap">{pick(active, 'alt', lang)}</p>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}

/* ── award / press ────────────────────────────────────── */
function AwardPress({ work, lang }) {
  const award = work.award;
  const press = Array.isArray(work.press) ? work.press : [];
  const hasScan = !!(award && award.scan);
  // award가 있어도 scan이 없으면 이 섹션엔 그릴 게 없다 (뱃지는 Meta에서 별도 렌더) —
  // press도 없다면 빈 제목 섹션을 렌더하지 않는다.
  if (!hasScan && press.length === 0) return null;

  return (
    <section className="wd-section reveal">
      <h2 className="wd-section__title">{t(lang, '수상 · 보도', 'Awards & Press')}</h2>
      <div className="wd-award">
        {hasScan && (
          <figure className="wd-award__scan">
            <img
              src={award.scan}
              alt={pick(award, 'title', lang) || ''}
              loading="lazy"
              width="800"
              height="1131"
            />
            <figcaption className="wd-award__cap">
              <strong>{pick(award, 'title', lang)}</strong>
              {pick(award, 'event', lang) && <span> · {pick(award, 'event', lang)}</span>}
              {award.year && <span> · {award.year}</span>}
            </figcaption>
          </figure>
        )}
        {press.length > 0 && (
          <ul className="wd-press">
            {press.map((p, i) => {
              const title = pick(p, 'title', lang);
              const inner = (
                <>
                  <span className="wd-press__outlet">{p.outlet}</span>
                  {title && <span className="wd-press__title">{title}</span>}
                </>
              );
              return (
                <li key={i} className="wd-press__item">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" className="wd-press__link">
                      {inner}
                      <FaExternalLinkAlt aria-hidden="true" className="wd-press__ext" />
                    </a>
                  ) : (
                    <span className="wd-press__link wd-press__link--plain">{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ── links ────────────────────────────────────────────── */
function Links({ work, lang }) {
  const links = [];
  if (work.demo) links.push({ kind: 'demo', url: work.demo });
  if (work.link) links.push({ kind: 'notion', url: work.link });
  if (work.github) links.push({ kind: 'github', url: work.github });
  if (work.youtube) links.push({ kind: 'youtube', url: work.youtube });

  const pdfs = [];
  if (work.slug === 'juljuri') {
    pdfs.push({ href: '/docs/juljuri-report.pdf', label: t(lang, '연구 리포트 PDF', 'Research Report PDF') });
  }
  // '개발 일대기' PDF는 로봇 개발 상세 페이지에서만 노출 (스펙 정합성)
  if (work.group === 'robot') {
    pdfs.push({ href: '/docs/robot-history.pdf', label: t(lang, '개발 일대기 PDF', 'Development Story PDF') });
  }

  if (links.length === 0 && pdfs.length === 0) return null;

  return (
    <section className="wd-section reveal">
      <h2 className="wd-section__title">{t(lang, '링크', 'Links')}</h2>
      <div className="wd-links">
        {links.map(({ kind, url }) => {
          const M = LINK_META[kind];
          const Icon = M.icon;
          return (
            <a key={kind} className="wd-btn" href={url} target="_blank" rel="noopener noreferrer">
              <Icon aria-hidden="true" /> {M.label}
            </a>
          );
        })}
        {pdfs.map((p) => (
          <a key={p.href} className="wd-btn" href={p.href} target="_blank" rel="noopener noreferrer">
            <FaFilePdf aria-hidden="true" /> {p.label}
          </a>
        ))}
      </div>
    </section>
  );
}

/* ── prev / next ──────────────────────────────────────── */
function PrevNext({ prev, next, lang }) {
  if (!prev && !next) return null;
  return (
    <nav className="wd-nav reveal" aria-label={t(lang, '다른 작업', 'Other works')}>
      {prev ? (
        <Link className="wd-nav__card wd-nav__card--prev" to={`/works/${prev.slug}`}>
          <span className="wd-nav__dir"><FaArrowLeft aria-hidden="true" /> {t(lang, '이전', 'Previous')}</span>
          <span className="wd-nav__title">{pick(prev, 'title', lang)}</span>
        </Link>
      ) : <span className="wd-nav__spacer" />}
      {next ? (
        <Link className="wd-nav__card wd-nav__card--next" to={`/works/${next.slug}`}>
          <span className="wd-nav__dir">{t(lang, '다음', 'Next')} <FaArrowRight aria-hidden="true" /></span>
          <span className="wd-nav__title">{pick(next, 'title', lang)}</span>
        </Link>
      ) : <span className="wd-nav__spacer" />}
    </nav>
  );
}
