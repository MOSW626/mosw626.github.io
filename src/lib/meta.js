import { useEffect } from 'react';

const SITE = 'YS AN';
const DEFAULT_TITLE = 'YS AN — Robotics Archive';
const ORIGIN = 'https://mosw626.github.io';

export function buildTitle(page) {
  return page ? `${page} · ${SITE}` : DEFAULT_TITLE;
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
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', buildTitle(title));
    setMeta('property', 'og:image', ORIGIN + (image || '/og-default.png'));
  }, [title, description, image]);
}
