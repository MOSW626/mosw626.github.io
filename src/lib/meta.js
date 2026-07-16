import { useEffect } from 'react';

const SITE = 'YS AN';
const DEFAULT_TITLE = 'YS AN — Robotics Archive';
const ORIGIN = 'https://mosw626.github.io';
// index.html의 정적 <meta name="description">와 동일한 문자열로 유지 — 한쪽만 고치지 말 것.
const DEFAULT_DESCRIPTION = 'ROS 기반 로봇 개발자 안연수의 포트폴리오. 전국과학전람회 대통령상, 긱블 출연, YSC 선정.';

export function buildTitle(page) {
  return page ? `${page} · ${SITE}` : DEFAULT_TITLE;
}

// description 없는 페이지(예: Home)로 이동해도 항상 유효한 문자열을 반환 — DOM 미의존, 단독 테스트 가능.
export function resolveDescription(description) {
  return description || DEFAULT_DESCRIPTION;
}

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageMeta({ title, description, image } = {}) {
  useEffect(() => {
    document.title = buildTitle(title);
    // description 없는 페이지로 이동해도 이전 페이지 값이 잔존하지 않도록 항상 설정
    const resolvedDescription = resolveDescription(description);
    setMeta('name', 'description', resolvedDescription);
    setMeta('property', 'og:description', resolvedDescription);
    setMeta('property', 'og:title', buildTitle(title));
    setMeta('property', 'og:image', ORIGIN + (image || '/og-default.png'));
  }, [title, description, image]);
}
