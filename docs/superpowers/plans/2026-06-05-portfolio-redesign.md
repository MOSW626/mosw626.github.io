# 포트폴리오 미니멀 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 안연수의 개인 포트폴리오를 다크 대시보드에서 라이트·미니멀 단일 스크롤 페이지로 완전히 재구축하고, CRA에서 Vite로 토대를 옮기며, 한/영 병행과 GitHub Pages 배포를 정리한다.

**Architecture:** Vite + React 18 단일 페이지 앱. React Router·react-bootstrap 제거. 섹션별 독립 컴포넌트(Nav/Hero/About/Skills/Projects/Contact/Footer)가 데이터 JSON과 언어 컨텍스트로만 통신. 순수 CSS + 커스텀 프로퍼티(디자인 토큰)로 스타일링. 순수 함수(i18n pick, 프로젝트 링크 필터)는 Vitest로 검증.

**Tech Stack:** Vite, React 18, react-icons, Vitest, CSS custom properties, GitHub Actions → GitHub Pages.

---

## File Structure

```
index.html                         # Vite 진입 HTML (CRA public/index.html 대체)
vite.config.js                     # Vite 설정 (base: '/')
package.json                       # 의존성 정리
src/
  main.jsx                         # React 진입점
  App.jsx                          # 언어 컨텍스트 + 섹션 조립
  i18n.js                          # lang 컨텍스트 + pick() 헬퍼  (테스트 대상)
  styles/
    tokens.css                     # 디자인 토큰 (색/간격/폰트 변수)
    global.css                     # 전역 리셋 + 베이스 타이포
  lib/
    icons.js                       # 스킬 아이콘 문자열→컴포넌트 매핑
    projects.js                    # 프로젝트 링크 필터 등 순수 함수  (테스트 대상)
  components/
    Nav.jsx / Nav.css
    Hero.jsx / Hero.css
    About.jsx / About.css          # 바이오 + 타임라인 + 스킬 통합
    Projects.jsx / Projects.css    # 탭 + 카드 그리드
    ProjectCard.jsx
    Contact.jsx / Contact.css
    Footer.jsx / Footer.css
  data/
    profile.json  projects.json  skills.json   # 기존 재사용 (organizations.json은 About로 흡수)
  test/
    i18n.test.js
    projects.test.js
.github/workflows/deploy.yml       # Pages 배포
```

**제거 대상 (Task 12):** `src/App.css`, `src/index.js`, `src/index.css`, `src/components/*`(구), `src/pages/`, `src/utils/`, `src/data/githubProjects.js`·`notionProjects.js`·`githubDescriptions.json`·`organizations.json`, `admin/`, `api/`, `.vercel/`, `vercel.json`, 루트 배포 문서 8종.

---

## Task 1: Vite 토대 구성

**Files:**
- Create: `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`
- Modify: `package.json`

- [ ] **Step 1: package.json 교체**

`package.json`을 아래로 교체한다 (기존 CRA/백엔드 의존성 제거):

```json
{
  "name": "ys-an-portfolio",
  "version": "2.0.0",
  "description": "Personal portfolio website for robotics engineer Yeonsu An",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.12.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^5.4.11",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: vite.config.js 생성**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // 사용자 Pages 레포(mosw626.github.io)라 루트 서빙
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 3: index.html 생성 (루트)**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>안연수 · Yeonsu An — Robotics Engineer</title>
    <meta name="description" content="ROS 기반 로봇 개발자 안연수의 포트폴리오. 전국과학전람회 대통령상, 긱블 출연, YSC 선정." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: src/main.jsx 생성**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 5: src/App.jsx 임시 플레이스홀더 생성**

```jsx
export default function App() {
  return <div style={{ padding: 40 }}>Portfolio rebuild — scaffold OK</div>;
}
```

- [ ] **Step 6: 의존성 설치 + dev 서버 검증**

Run: `npm install && npm run dev`
Expected: Vite dev 서버가 `http://localhost:5173`에서 뜨고 "scaffold OK" 표시. (styles 파일은 다음 태스크에서 생성하므로, 이 단계에서는 main.jsx의 styles import 두 줄을 임시 주석 처리했다가 Task 2 후 해제한다.)

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.js index.html src/main.jsx src/App.jsx
git commit -m "feat: scaffold Vite + React foundation"
```

---

## Task 2: 디자인 토큰 + 전역 스타일

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`

- [ ] **Step 1: tokens.css 생성**

```css
:root {
  /* color */
  --bg: #ffffff;
  --bg-alt: #fafafa;
  --text: #171717;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --accent: #2563eb;
  --accent-soft: rgba(37, 99, 235, 0.08);

  /* spacing scale (4px base) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
  --space-24: 96px;

  /* layout */
  --container: 1080px;
  --radius: 12px;

  /* type */
  --font-sans: 'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --shadow-hover: 0 8px 24px rgba(23, 23, 23, 0.08);
}
```

- [ ] **Step 2: global.css 생성**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; scroll-padding-top: 72px; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }

h1, h2, h3 { line-height: 1.25; font-weight: 700; letter-spacing: -0.02em; }

.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section { padding: var(--space-24) 0; }
.section--alt { background: var(--bg-alt); }

.section__title {
  font-size: 1.75rem;
  margin-bottom: var(--space-8);
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* scroll reveal */
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
.reveal.is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
}

@media (max-width: 600px) {
  .section { padding: var(--space-16) 0; }
}
```

- [ ] **Step 3: main.jsx의 styles import 주석 해제 후 검증**

Run: `npm run dev`
Expected: 흰 배경 + Pretendard 폰트로 "scaffold OK" 렌더. 콘솔 에러 없음.

- [ ] **Step 4: Commit**

```bash
git add src/styles/ src/main.jsx
git commit -m "feat: add design tokens and global styles"
```

---

## Task 3: i18n 헬퍼 (테스트 포함)

**Files:**
- Create: `src/i18n.js`, `src/test/i18n.test.js`

- [ ] **Step 1: 실패하는 테스트 작성 — src/test/i18n.test.js**

```js
import { describe, it, expect } from 'vitest';
import { pick } from '../i18n.js';

describe('pick', () => {
  it('returns the base value in ko', () => {
    expect(pick({ name: '안연수', nameEn: 'Yeonsu' }, 'name', 'ko')).toBe('안연수');
  });
  it('returns the En field in en when present', () => {
    expect(pick({ name: '안연수', nameEn: 'Yeonsu' }, 'name', 'en')).toBe('Yeonsu');
  });
  it('falls back to base value in en when En field missing', () => {
    expect(pick({ title: '학생' }, 'title', 'en')).toBe('학생');
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test`
Expected: FAIL — `pick` not exported / module not found.

- [ ] **Step 3: src/i18n.js 구현**

```js
import { createContext, useContext } from 'react';

export const LanguageContext = createContext({ lang: 'ko', setLang: () => {} });
export const useLang = () => useContext(LanguageContext);

/**
 * 객체에서 언어에 맞는 필드를 고른다.
 * en이고 `${key}En` 필드가 있으면 그것을, 없으면 base(key) 값을 반환.
 */
export function pick(obj, key, lang) {
  if (lang === 'en') {
    const en = obj[`${key}En`];
    if (en !== undefined && en !== null && en !== '') return en;
  }
  return obj[key];
}

/** 짧은 ko/en 리터럴 선택용 헬퍼 */
export const t = (lang, ko, en) => (lang === 'en' ? en : ko);
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS (3 passing).

- [ ] **Step 5: Commit**

```bash
git add src/i18n.js src/test/i18n.test.js
git commit -m "feat: add i18n pick helper with tests"
```

---

## Task 4: 데이터 정리 + 아이콘 매핑 + 프로젝트 링크 필터 (테스트 포함)

**Files:**
- Create: `src/lib/icons.js`, `src/lib/projects.js`, `src/test/projects.test.js`
- Reuse (이동/정리): `src/data/profile.json`, `src/data/projects.json`, `src/data/skills.json`

> 참고: 기존 `src/data/*.json`은 그대로 둔다(스키마 유지). About 흡수를 위해 `profile.json`에 학교 정보가 이미 bio로 들어있으므로 추가 변경 불필요.

- [ ] **Step 1: 실패하는 테스트 작성 — src/test/projects.test.js**

```js
import { describe, it, expect } from 'vitest';
import { projectLinks } from '../lib/projects.js';

describe('projectLinks', () => {
  it('omits links with empty urls', () => {
    const links = projectLinks({ link: '', github: 'https://gh/x', youtube: '' });
    expect(links).toEqual([{ kind: 'github', url: 'https://gh/x' }]);
  });
  it('includes notion, github, youtube when present in order', () => {
    const links = projectLinks({ link: 'https://n', github: 'https://g', youtube: 'https://y' });
    expect(links.map((l) => l.kind)).toEqual(['notion', 'github', 'youtube']);
  });
  it('returns empty array when no links', () => {
    expect(projectLinks({})).toEqual([]);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test`
Expected: FAIL — `projectLinks` not found.

- [ ] **Step 3: src/lib/projects.js 구현**

```js
/**
 * 프로젝트 객체에서 비어있지 않은 링크만 순서대로 추출.
 * link(notion) → github → youtube
 */
export function projectLinks(project) {
  const out = [];
  if (project.link) out.push({ kind: 'notion', url: project.link });
  if (project.github) out.push({ kind: 'github', url: project.github });
  if (project.youtube) out.push({ kind: 'youtube', url: project.youtube });
  return out;
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test`
Expected: PASS (i18n 3 + projects 3 = 6 passing).

- [ ] **Step 5: src/lib/icons.js 구현 (스킬 아이콘 매핑)**

```js
import { FaRobot } from 'react-icons/fa';
import {
  SiPython, SiCplusplus, SiJavascript, SiOpencv,
  SiTensorflow, SiPytorch, SiGit, SiLinux, SiArduino,
} from 'react-icons/si';

const map = {
  SiPython, SiCplusplus, SiJavascript, SiOpencv,
  SiTensorflow, SiPytorch, SiGit, SiLinux, SiArduino,
  FaRobot,
};

/** 문자열 아이콘 이름을 컴포넌트로. 없으면 FaRobot 폴백. */
export function iconFor(name) {
  return map[name] || FaRobot;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/ src/test/projects.test.js
git commit -m "feat: add icon map and project link filter with tests"
```

---

## Task 5: Nav 컴포넌트 (sticky + 앵커 + 한/영 토글)

**Files:**
- Create: `src/components/Nav.jsx`, `src/components/Nav.css`

- [ ] **Step 1: Nav.jsx 작성**

```jsx
import { FaGithub } from 'react-icons/fa';
import { useLang, t } from '../i18n.js';
import profile from '../data/profile.json';
import './Nav.css';

export default function Nav() {
  const { lang, setLang } = useLang();
  const links = [
    { href: '#about', label: t(lang, '소개', 'About') },
    { href: '#projects', label: t(lang, '프로젝트', 'Projects') },
    { href: '#contact', label: t(lang, '연락처', 'Contact') },
  ];
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a className="nav__brand" href="#home">YS AN</a>
        <nav className="nav__links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
          <button
            className="nav__lang"
            onClick={() => setLang(lang === 'en' ? 'ko' : 'en')}
            aria-label="Toggle language"
          >
            {lang === 'en' ? '한국어' : 'EN'}
          </button>
          <a
            className="nav__gh"
            href={profile.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Nav.css 작성**

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.nav__brand { font-weight: 700; letter-spacing: 0.05em; }
.nav__links { display: flex; align-items: center; gap: var(--space-6); }
.nav__links a { color: var(--text-muted); font-size: 0.92rem; transition: color 0.2s; }
.nav__links a:hover { color: var(--text); }
.nav__lang {
  background: transparent; border: 1px solid var(--border);
  border-radius: 999px; padding: 4px 12px; font-size: 0.8rem;
  cursor: pointer; color: var(--text-muted); font-family: inherit;
}
.nav__lang:hover { border-color: var(--accent); color: var(--accent); }
.nav__gh { font-size: 1.2rem; color: var(--text); display: flex; }
.nav__gh:hover { color: var(--accent); }

@media (max-width: 600px) {
  .nav__links { gap: var(--space-3); }
  .nav__links a { font-size: 0.85rem; }
}
```

- [ ] **Step 3: 커밋 (App 통합은 Task 11에서 일괄)**

```bash
git add src/components/Nav.jsx src/components/Nav.css
git commit -m "feat: add sticky Nav with language toggle"
```

---

## Task 6: Hero 섹션

**Files:**
- Create: `src/components/Hero.jsx`, `src/components/Hero.css`

- [ ] **Step 1: Hero.jsx 작성**

```jsx
import { FaGithub, FaArrowDown } from 'react-icons/fa';
import { useLang, pick, t } from '../i18n.js';
import profile from '../data/profile.json';
import './Hero.css';

export default function Hero() {
  const { lang } = useLang();
  const name = pick(profile, 'name', lang);
  const greeting = lang === 'en'
    ? <>Hi, I'm <span className="hero__name">{name}</span>.</>
    : <>안녕하세요, <span className="hero__name">{name}</span>입니다.</>;
  const title = lang === 'en' ? 'Robotics Engineer' : '로봇 공학자';
  const desc = pick(profile, 'heroDescription', lang);

  return (
    <section id="home" className="hero">
      <div className="container hero__inner reveal">
        <p className="hero__title">{title}</p>
        <h1 className="hero__greeting">{greeting}</h1>
        <p className="hero__desc" dangerouslySetInnerHTML={{ __html: desc }} />
        <div className="hero__badges">
          {(profile.achievements || []).map((a, i) => (
            <span key={i} className="pill">{a.emoji} {a.label}</span>
          ))}
        </div>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#projects">
            {t(lang, '프로젝트 보기', 'View Projects')}
          </a>
          <a className="btn btn--ghost" href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
            <FaGithub /> GitHub
          </a>
        </div>
        <a className="hero__scroll" href="#about" aria-label="Scroll to about"><FaArrowDown /></a>
      </div>
    </section>
  );
}
```

> 주의: `profile.achievements[].label`은 한/영 공통(현재 한글). 영어 라벨이 필요하면 후속 콘텐츠 작업에서 `labelEn` 추가. 이번 범위에선 공통 사용.

- [ ] **Step 2: Hero.css 작성**

```css
.hero { padding: var(--space-24) 0 var(--space-16); position: relative; }
.hero__inner { max-width: 760px; }
.hero__title { color: var(--accent); font-weight: 600; letter-spacing: 0.04em; margin-bottom: var(--space-3); }
.hero__greeting { font-size: clamp(2rem, 6vw, 3.25rem); margin-bottom: var(--space-6); }
.hero__name { color: var(--accent); }
.hero__desc { font-size: 1.1rem; color: var(--text-muted); margin-bottom: var(--space-8); }
.hero__desc strong { color: var(--text); font-weight: 600; }
.hero__badges { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-8); }
.hero__cta { display: flex; flex-wrap: wrap; gap: var(--space-3); }

.btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: 12px 22px; border-radius: var(--radius); font-weight: 600;
  font-size: 0.95rem; transition: all 0.2s; cursor: pointer; border: 1px solid transparent;
}
.btn--primary { background: var(--accent); color: #fff; }
.btn--primary:hover { background: #1d4ed8; }
.btn--ghost { background: transparent; border-color: var(--border); color: var(--text); }
.btn--ghost:hover { border-color: var(--accent); color: var(--accent); }

.hero__scroll {
  display: inline-flex; margin-top: var(--space-16); color: var(--text-muted);
  font-size: 1.1rem; animation: bob 1.8s ease-in-out infinite;
}
@keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
@media (prefers-reduced-motion: reduce) { .hero__scroll { animation: none; } }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx src/components/Hero.css
git commit -m "feat: add Hero section"
```

---

## Task 7: About 섹션 (바이오 + 타임라인 + 스킬)

**Files:**
- Create: `src/components/About.jsx`, `src/components/About.css`

- [ ] **Step 1: About.jsx 작성**

```jsx
import { useLang, pick, t } from '../i18n.js';
import { iconFor } from '../lib/icons.js';
import profile from '../data/profile.json';
import skills from '../data/skills.json';
import './About.css';

const TIMELINE = [
  { year: '~2020', ko: '중학교 때부터 로봇 제작 시작', en: 'Started building robots in middle school' },
  { year: '2021–2024', ko: '충북과학고등학교 재학', en: 'Chungbuk Science High School' },
  { year: '2022', ko: '전국과학전람회 대통령상 · 긱블 출연', en: 'Presidential Prize (National Science Exhibition) · Featured on Geekble' },
  { year: '2023', ko: 'YSC 발표대회 선정 · 학교 공식 영상 제작', en: 'Selected for YSC · Produced official school videos' },
];

export default function About() {
  const { lang } = useLang();
  return (
    <section id="about" className="section section--alt">
      <div className="container">
        <h2 className="section__title">{t(lang, '소개', 'About')}</h2>
        <div className="about__grid">
          <div className="about__bio reveal">
            <p>{pick(profile, 'aboutBio1', lang)}</p>
            <p>{pick(profile, 'aboutBio2', lang)}</p>
          </div>
          <ul className="about__timeline reveal">
            {TIMELINE.map((e, i) => (
              <li key={i}>
                <span className="about__year">{e.year}</span>
                <span className="about__event">{t(lang, e.ko, e.en)}</span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="about__skills-title">{t(lang, '기술 스택', 'Skills')}</h3>
        <div className="about__skills reveal">
          {skills.map((group) => (
            <div key={group.category} className="skill-group">
              <h4>{group.category}</h4>
              <div className="skill-items">
                {group.items.map((item) => {
                  const Icon = iconFor(item.icon);
                  return (
                    <span key={item.name} className="skill-item">
                      <Icon /> {item.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: About.css 작성**

```css
.about__grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-12); align-items: start; }
.about__bio p { color: var(--text-muted); margin-bottom: var(--space-4); }
.about__timeline { list-style: none; display: flex; flex-direction: column; gap: var(--space-4); border-left: 2px solid var(--border); padding-left: var(--space-6); }
.about__timeline li { display: flex; flex-direction: column; position: relative; }
.about__timeline li::before { content: ''; position: absolute; left: calc(-1 * var(--space-6) - 5px); top: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
.about__year { font-size: 0.8rem; color: var(--accent); font-weight: 600; }
.about__event { color: var(--text); }

.about__skills-title { margin: var(--space-16) 0 var(--space-6); font-size: 1.25rem; }
.about__skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-6); }
.skill-group h4 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: var(--space-3); }
.skill-items { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.skill-item { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 0.85rem; background: var(--bg); }
.skill-item svg { color: var(--accent); }

@media (max-width: 760px) {
  .about__grid { grid-template-columns: 1fr; gap: var(--space-8); }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/About.jsx src/components/About.css
git commit -m "feat: add About section with timeline and skills"
```

---

## Task 8: ProjectCard 컴포넌트

**Files:**
- Create: `src/components/ProjectCard.jsx`

- [ ] **Step 1: ProjectCard.jsx 작성**

```jsx
import { FaGithub, FaYoutube, FaExternalLinkAlt } from 'react-icons/fa';
import { useLang, pick, t } from '../i18n.js';
import { projectLinks } from '../lib/projects.js';

const LINK_META = {
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
```

> `title`/`description`의 영어 필드(`titleEn`/`descriptionEn`)는 현재 데이터에 없어 한글로 폴백된다(pick의 폴백 동작). 영어 프로젝트 문구는 후속 콘텐츠 작업 대상이며 이번 범위 밖.

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectCard.jsx
git commit -m "feat: add ProjectCard component"
```

---

## Task 9: Projects 섹션 (탭 + 그리드)

**Files:**
- Create: `src/components/Projects.jsx`, `src/components/Projects.css`

- [ ] **Step 1: Projects.jsx 작성**

```jsx
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
```

- [ ] **Step 2: Projects.css 작성**

```css
.projects__tabs { display: flex; gap: var(--space-2); margin-bottom: var(--space-8); }
.projects__tab {
  padding: 8px 18px; border-radius: 999px; border: 1px solid var(--border);
  background: var(--bg); color: var(--text-muted); cursor: pointer;
  font-family: inherit; font-size: 0.9rem; font-weight: 500; transition: all 0.2s;
}
.projects__tab:hover { color: var(--text); }
.projects__tab.is-active { background: var(--accent); color: #fff; border-color: var(--accent); }

.projects__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-6); }

.project-card {
  border: 1px solid var(--border); border-radius: var(--radius);
  padding: var(--space-6); background: var(--bg);
  transition: box-shadow 0.2s, transform 0.2s; display: flex; flex-direction: column;
}
.project-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }
.project-card__head { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-3); margin-bottom: var(--space-2); }
.project-card__head h3 { font-size: 1.05rem; }
.project-card__period { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; }
.project-card__desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: var(--space-4); flex: 1; }
.project-card__tags { display: flex; flex-wrap: wrap; gap: var(--space-1); margin-bottom: var(--space-4); }
.project-card__links { display: flex; gap: var(--space-4); }
.project-card__links a { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--accent); font-weight: 500; }
.project-card__links a:hover { text-decoration: underline; }

@media (max-width: 600px) {
  .projects__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Projects.jsx src/components/Projects.css
git commit -m "feat: add Projects section with tabs and grid"
```

---

## Task 10: Contact + Footer

**Files:**
- Create: `src/components/Contact.jsx`, `src/components/Contact.css`, `src/components/Footer.jsx`, `src/components/Footer.css`

- [ ] **Step 1: Contact.jsx 작성**

```jsx
import { FaEnvelope, FaGithub, FaStickyNote, FaBlog } from 'react-icons/fa';
import { useLang, t } from '../i18n.js';
import profile from '../data/profile.json';
import './Contact.css';

export default function Contact() {
  const { lang } = useLang();
  const items = [
    { icon: FaEnvelope, label: profile.email, url: `mailto:${profile.email}` },
    { icon: FaGithub, label: 'GitHub', url: profile.socialLinks.github },
    { icon: FaStickyNote, label: 'Notion', url: profile.socialLinks.notion },
    { icon: FaBlog, label: 'Blog', url: profile.socialLinks.blog },
  ].filter((i) => i.url);

  return (
    <section id="contact" className="section section--alt">
      <div className="container contact reveal">
        <h2 className="section__title">{t(lang, '연락처', 'Contact')}</h2>
        <p className="contact__lead">
          {t(lang, '협업이나 문의는 아래로 연락 주세요.', 'Reach out for collaboration or questions.')}
        </p>
        <div className="contact__links">
          {items.map(({ icon: Icon, label, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="contact__link">
              <Icon /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Contact.css 작성**

```css
.contact__lead { color: var(--text-muted); margin-bottom: var(--space-8); }
.contact__links { display: flex; flex-wrap: wrap; gap: var(--space-4); }
.contact__link {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: 12px 20px; border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--bg); font-size: 0.92rem; transition: all 0.2s;
}
.contact__link svg { color: var(--accent); }
.contact__link:hover { border-color: var(--accent); transform: translateY(-2px); }
```

- [ ] **Step 3: Footer.jsx 작성**

```jsx
import { useLang, t } from '../i18n.js';
import './Footer.css';

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="footer">
      <div className="container">
        <span>© 2024 안연수 · Yeonsu An</span>
        <span>{t(lang, 'Vite + React로 제작', 'Built with Vite + React')}</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Footer.css 작성**

```css
.footer { border-top: 1px solid var(--border); padding: var(--space-8) 0; }
.footer .container { display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--space-2); color: var(--text-muted); font-size: 0.85rem; }
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.jsx src/components/Contact.css src/components/Footer.jsx src/components/Footer.css
git commit -m "feat: add Contact and Footer sections"
```

---

## Task 11: App 조립 + 스크롤 리빌

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: App.jsx 완성 (플레이스홀더 교체)**

```jsx
import { useState, useEffect } from 'react';
import { LanguageContext } from './i18n.js';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [lang, setLang] = useState('ko');

  // 스크롤 진입 시 .reveal 요소를 노출
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
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
  }, []);

  // 언어 변경 시 <html lang> 동기화
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </LanguageContext.Provider>
  );
}
```

- [ ] **Step 2: 전체 dev 확인**

Run: `npm run dev`
Expected: 단일 페이지에 Nav/Hero/About/Projects/Contact/Footer가 순서대로 렌더. 앵커 클릭 시 스무스 스크롤, EN 토글 시 라벨/문구 전환, 프로젝트 탭 전환 동작, 스크롤 시 섹션 fade-in. 콘솔 에러 없음.

- [ ] **Step 3: 테스트 + 빌드 확인**

Run: `npm test && npm run build`
Expected: 6 tests PASS, 빌드 성공(`dist/` 생성).

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: assemble single-page app with scroll reveal"
```

---

## Task 12: 구식 파일·문서·설정 제거

**Files:**
- Delete: 아래 목록

- [ ] **Step 1: 구식 소스/백엔드/문서 제거**

```bash
git rm -r src/components/About.js src/components/About.css \
  src/components/Home.js src/components/Home.css \
  src/components/Projects.js src/components/Projects.css \
  src/components/Overview.js src/components/Overview.css \
  src/components/Organizations.js src/components/Organizations.css \
  src/components/Contact.js src/components/Contact.css \
  src/components/Footer.js src/components/Footer.css \
  src/components/ProjectModal.js src/components/ProjectModal.css \
  src/pages src/utils src/index.js src/index.css src/App.css \
  src/data/githubProjects.js src/data/notionProjects.js \
  src/data/githubDescriptions.json src/data/organizations.json \
  admin api vercel.json 2>/dev/null; \
git rm DEPLOYMENT.md DEPLOYMENT_FAILURE_CHECK.md FINAL_DEPLOYMENT_FIX.md \
  FIX_PAGES_BUILD.md GITHUB_ACTIONS_ONLY_SETUP.md MANUS_GUIDELINES.md \
  PROJECT_FILES_GUIDE.md PROJECTS_CUSTOMIZATION.md SETUP_GUIDE.md 2>/dev/null; \
rm -rf .vercel; \
echo "cleanup done"
```

> 위 경로 중 일부가 이미 없을 수 있으므로 `2>/dev/null`로 무시. 실제 존재 파일만 정리된다.

- [ ] **Step 2: .gitignore에 빌드 산출물 정리 확인**

`.gitignore`에 다음이 포함되어 있는지 확인하고 없으면 추가: `dist`, `node_modules`, `.DS_Store`. (CRA의 `build` 항목은 남겨둬도 무방.)

- [ ] **Step 3: 빌드 재확인 (제거 후 깨짐 없는지)**

Run: `npm run build`
Expected: 성공. 남은 파일이 삭제된 모듈을 import 하지 않음(에러 없음).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove legacy CRA, backend, and deployment docs"
```

---

## Task 13: README 갱신 + GitHub Actions 배포

**Files:**
- Modify: `README.md`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: deploy.yml 작성**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: README.md 교체 (간결화)**

```markdown
# 안연수 · Yeonsu An — Portfolio

ROS 기반 로봇 개발자 안연수의 개인 포트폴리오. Vite + React 단일 페이지.

## 개발
\`\`\`bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
npm test         # 단위 테스트
\`\`\`

## 콘텐츠 수정
- 프로필/소개: \`src/data/profile.json\`
- 프로젝트: \`src/data/projects.json\`
- 스킬: \`src/data/skills.json\`

## 배포
main 브랜치 push 시 GitHub Actions가 자동으로 GitHub Pages(\`https://mosw626.github.io/\`)에 배포.

## 링크
- GitHub: https://github.com/MOSW626
- Notion: https://mosw.notion.site/
- Blog: https://mosw.tistory.com/
```

- [ ] **Step 3: 커밋**

```bash
git add README.md .github/workflows/deploy.yml
git commit -m "ci: add GitHub Pages deploy workflow and update README"
```

- [ ] **Step 4: 배포 사전 안내 (사용자 액션)**

GitHub 레포 Settings → Pages → Build and deployment → Source를 **"GitHub Actions"**로 설정해야 워크플로 배포가 활성화됨. (사용자가 직접 1회 설정) merge 후 안내한다.

---

## Task 14: 최종 검증

- [ ] **Step 1: 전체 테스트 + 빌드 + 프리뷰**

Run: `npm test && npm run build && npm run preview`
Expected: 6 tests PASS, 빌드 성공, `http://localhost:4173`에서 프로덕션 빌드 정상 렌더.

- [ ] **Step 2: 수동 체크리스트 (프리뷰에서)**
  - [ ] 데스크톱 폭: 컨테이너 중앙 정렬, 섹션 간격 일관.
  - [ ] 모바일 폭(<600px): 단일 컬럼, 카드 1열, Nav 깨짐 없음.
  - [ ] 한/영 토글: 모든 섹션 라벨/문구 전환, `<html lang>` 변경.
  - [ ] 프로젝트 탭: 로봇 개발 / 영상 제작 전환, 영상 카드의 YouTube 링크는 있는 항목만 노출.
  - [ ] 죽은 링크(빈 url) 버튼 미노출 확인.
  - [ ] 스크롤 리빌 동작, reduced-motion에서 즉시 표시.

- [ ] **Step 3: 마무리**

superpowers:finishing-a-development-branch 스킬로 main 병합/PR 여부 결정.

---

## Self-Review 결과

- **스펙 커버리지**: 구조(단일 페이지, Task 5–11) / 비주얼 토큰(Task 2) / 콘텐츠 정리·폼 제거·영상 탭 통합·소속 흡수(Task 7,9,10) / 토대·레포 정리(Task 1,12) / 배포(Task 13) / 검증(Task 14) — 모두 매핑됨.
- **플레이스홀더**: 없음. 모든 코드 단계에 실제 코드 포함.
- **타입/이름 일관성**: `pick`/`t`/`useLang`(i18n.js), `projectLinks`(lib/projects.js), `iconFor`(lib/icons.js) 정의와 사용처 일치. 데이터 키(`robotDevelopment`/`videoProduction`, `socialLinks`, `achievements`)는 기존 JSON 스키마와 일치.
- **알려진 한계(범위 밖)**: 프로젝트/실적 라벨의 영어 문구 미비(한글 폴백), CV 링크 비어있음 — 후속 콘텐츠 작업.
```
