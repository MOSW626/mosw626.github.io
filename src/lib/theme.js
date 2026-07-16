const KEY = 'theme';
// tokens.css의 --bg 값과 동일하게 유지 — 한쪽만 고치지 말 것.
const THEME_COLOR = { light: '#ffffff', dark: '#0f1115' };

/** 저장값 우선, 없거나 이상하면 OS 선호 */
export function resolveTheme(stored, prefersDark) {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

export function getInitialTheme() {
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch { /* SSR/프라이버시 모드 */ }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return resolveTheme(stored, prefersDark);
}

/** 명시적 사용자 선택만 저장한다 (OS 추종 상태를 고정하지 않기 위해) */
export function setTheme(theme, { persist = true } = {}) {
  document.documentElement.dataset.theme = theme;
  const meta = document.head.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLOR[theme] || THEME_COLOR.light);
  if (persist) { try { localStorage.setItem(KEY, theme); } catch { /* noop */ } }
}
