# Archive v3 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ys-an.github.io를 이미지·영상·수상 증빙·개발 타임라인을 갖춘 "로봇 개발 일대기 아카이브"로 격상 (프로젝트 상세 페이지 + 다크모드 + SEO + Notes 시리즈).

**Architecture:** 기존 Vite + React 18 + React Router SPA 유지. `projects.json`을 단일 소스로 확장하고, `/works/:slug` 상세 페이지를 데이터 주도로 렌더. 에셋은 외장 볼륨(읽기 전용)에서 `public/works/<slug>/`로 복사·최적화.

**Tech Stack:** Vite 5, React 18, react-router-dom 7, react-markdown, Vitest 2 (node env), 플레인 CSS + CSS Custom Properties.

## Global Constraints

- 소스 볼륨 `/Volumes/adolescence/학교/3. 충북과학고(2021-2023)/3. 3학년/[ 입시관련 ]/33_안연수 입시자료/2. 특기입증자료`는 **읽기 전용**. `cp`로 복사만. 수정·이동·삭제·이름변경 절대 금지.
- i18n 규약: 한국어가 base 필드, 영어는 `<field>En` 접미사 (`src/i18n.js`의 `pick(obj, key, lang)`이 이 규약을 소비). 신규 데이터 필드도 동일 규약.
- 스타일: CSS Custom Properties 토큰(`src/styles/tokens.css`)만 사용, 하드코딩 색상 금지. CSS 프레임워크·CSS-in-JS 도입 금지.
- 신규 런타임 의존성 추가 금지 (react-helmet 등 불필요 — 자체 훅으로 해결).
- 테스트: `npm test` (Vitest, node 환경). 기존 20개 테스트는 항상 통과 상태 유지.
- 커밋: 작업 단위마다. 메시지 끝에 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- GitHub 파일당 100MB 제한 — 초과 파일은 커밋 금지.
- 이미지에 `loading="lazy"` + 명시적 `width`/`height` 또는 `aspect-ratio`, `prefers-reduced-motion` 존중.
- 사실관계는 스펙(`docs/superpowers/specs/2026-07-16-archive-v3-redesign-design.md`)과 소스 PDF가 진실. 과장·창작 금지.

## 확정 slug 목록 (라우팅·에셋 디렉토리·sitemap 공용)

| slug | 프로젝트 | 수상 |
|---|---|---|
| `juljuri` | 줄줄이 — 줄다리기 로봇 | 대통령상 (제68회 전국과학전람회, 2022) |
| `geungeuni` | 근근이 — 그네타기 로봇 | 국무총리상 (제67회 전국과학전람회, 2021) |
| `gosaengi` | 고생이 — 고양이 생체모방 착지 로봇 | YSC 2023 선정 |
| `taektaeki` | 택택이 — 자율주행 택배 배달 로봇 | — |
| `tamtami` | 탐탐이 — 행성 탐사 로봇 | 청소년과학페어 동상 (2022) |
| `pyeongtani` | 평탄이 — 흔들림 방지 장치 | — |
| `isp` | ISP — PID 모터 제어 연구 | — |
| `titration` | 자동 중화 적정 기기 | 과기정통부 장관상 (2021) |

---

### Task 1: 에셋 큐레이션 (소스 볼륨 → public/) — Sonnet

**Files:**
- Create: `public/works/<slug>/` 하위 이미지·영상 (slug 표 참조)
- Create: `public/docs/` 하위 PDF 3종
- Create: `docs/superpowers/plans/2026-07-16-assets-manifest.md` (복사 결과 보고서)

**Interfaces:**
- Produces: 아래 "목표 파일 배치"의 경로들. Task 2/5/6이 이 경로를 `projects.json`에 기입한다. 실제 산출 경로가 다르면 manifest에 정확히 기록할 것.

**소스 기준 경로** (이하 `$SRC`):
`/Volumes/adolescence/학교/3. 충북과학고(2021-2023)/3. 3학년/[ 입시관련 ]/33_안연수 입시자료/2. 특기입증자료`

**목표 파일 배치:**

```
public/works/juljuri/hero.webp        ← $SRC/특기 입증/로봇들_이미지/줄줄이.png
public/works/geungeuni/hero.webp      ← 동 폴더 근근이 이미지
public/works/gosaengi/hero.webp       ← 동 폴더 고생이.png
public/works/taektaeki/hero.webp      ← 동 폴더 택택이 이미지
public/works/tamtami/hero.webp        ← 동 폴더 탐탐이 이미지
public/works/pyeongtani/hero.webp     ← 동 폴더 평탄이 이미지
public/works/titration/hero.webp      ← 동 폴더 중화(적정) 이미지
public/works/isp/hero.webp            ← 로봇들_이미지에 없으면 ISP 관련 사진 탐색, 그래도 없으면 생략 후 manifest에 기록
public/works/juljuri/demo-1.mp4 … demo-N.mp4 ← $SRC/특기 입증/2022 전람회 - 줄다리기 로봇/영상/*.mp4 (6편, 각 3~38MB)
public/works/geungeuni/demo-1.mp4     ← $SRC/특기 입증/2021 전람회 - 그네 로봇/2021 전람회 안연수 그네타기.mp4
public/works/gosaengi/note-01.webp … note-22.webp ← $SRC/특기 입증/고생이 탐구일지/*.jpg (22장)
public/works/juljuri/award.webp       ← $SRC/특기 입증/상장/ 대통령상 상장 페이지 (PDF면 해당 페이지 렌더, 불가하면 PDF 복사로 대체)
public/works/geungeuni/award.webp     ← 동일 방식, 국무총리상
public/docs/robot-history.pdf         ← $SRC/[ 최종 제출 ]/KAIST 특기입증자료1_안연수_로봇개발일대기.pdf
public/docs/juljuri-report.pdf        ← $SRC/[ 최종 제출 ]/gist 제출/로봇(줄줄이) 개발을 통한 줄다리기 핵심 메커니즘 탐구_안연수.pdf
public/docs/awards-certificate.pdf    ← $SRC/특기 입증/상장/수상실적증명서_안연수.pdf
public/about/workbench.webp           ← $SRC/사진/IMG_7473.JPG (작업 현장 사진)
```

- [ ] **Step 1: 도구 확인** — `which ffmpeg; which sips; which qlmanage` 실행. ffmpeg 있으면 WebP 변환·포스터 추출에 사용, 없으면 `sips`로 리사이즈된 PNG/JPG 사용 (그 경우 확장자는 `.png`/`.jpg`로 하고 manifest에 기록 — 이후 Task는 manifest의 실제 경로를 따름).
- [ ] **Step 2: 소스 확인** — `ls "$SRC/특기 입증/로봇들_이미지/"` 등으로 각 소스 파일 존재·정확한 파일명 확인 (파일명은 한글이라 위 표기와 다를 수 있음 — 실제 이름 기준으로 매핑).
- [ ] **Step 3: 이미지 변환** — 히어로: 장변 1600px, 품질 82 WebP (`ffmpeg -i in.png -vf "scale='min(1600,iw)':-2" -quality 82 out.webp`). 연구노트: 장변 1400px. 배경 제거 PNG의 투명도는 유지(WebP 알파 지원).
- [ ] **Step 4: 영상 복사** — 각 파일 100MB 미만 확인 후 그대로 복사 (재인코딩 불필요, 이미 3~38MB). `du -h`로 총량 기록. ffmpeg 있으면 각 영상 1초 지점 프레임을 `demo-N-poster.webp`로 추출.
- [ ] **Step 5: PDF 복사 + 상장 이미지화** — PDF 3종 복사. 상장 PDF에서 대통령상·국무총리상 페이지를 이미지로 추출 (`qlmanage -t` 또는 ffmpeg/sips 조합, 불가 시 PDF 원본만 두고 manifest에 기록).
- [ ] **Step 6: 검증** — `find public/works public/docs public/about -type f | sort`와 각 파일 크기 출력. 원본 볼륨 무변경 확인 (복사만 했는지 자기 점검).
- [ ] **Step 7: manifest 작성** — 실제 복사된 전체 경로·크기·원본 경로 표를 `docs/superpowers/plans/2026-07-16-assets-manifest.md`에 기록.
- [ ] **Step 8: 커밋** — `git add public docs/superpowers/plans/2026-07-16-assets-manifest.md && git commit -m "assets: curate robot archive media from admissions portfolio (images/videos/pdfs)"`

---

### Task 2: 데이터 모델 확장 + works.js 헬퍼 — Sonnet

**Files:**
- Modify: `src/data/projects.json`
- Modify: `src/lib/works.js`
- Test: `src/test/works.test.js` (기존 파일에 추가)

**Interfaces:**
- Consumes: Task 1 manifest의 에셋 경로 (없으면 표준 경로 규약 사용, 파일 부재 필드는 생략)
- Produces:
  - `projects.json` robotDevelopment 8항목에 `slug`, `image`, `github`, `team`/`teamEn`, `videos[]`, `gallery[]`, `award{}`, `press[]`, `timeline[]` (optional 필드)
  - `findWorkBySlug(slug, d?) → work | null`
  - `detailWorks(d?) → work[]` (slug 보유 항목만, flattenWorks 순서)
  - `adjacentWorks(slug, d?) → { prev, next }` (detailWorks 기준, 끝단은 null)

**신규 필드 스키마** (i18n은 En-접미사 규약):

```jsonc
{
  "slug": "juljuri",
  "image": "/works/juljuri/hero.webp",
  "github": "https://github.com/MOSW626/Tug_of_War_Robot_Project_-2022-",
  "team": "3인 팀 — 노수빈·안연수·이원호 (줄줄연수원)",
  "teamEn": "Team of 3 — Subin Noh, Yeonsu An, Wonho Lee",
  "videos": [{ "src": "/works/juljuri/demo-1.mp4", "poster": "/works/juljuri/demo-1-poster.webp", "label": "본선 시연", "labelEn": "Final demo" }],
  "gallery": [{ "src": "/works/gosaengi/note-01.webp", "alt": "고생이 탐구일지 1장", "altEn": "Research notebook p.1" }],
  "award": { "title": "대통령상", "titleEn": "Presidential Award", "event": "제68회 전국과학전람회", "eventEn": "68th National Science Exhibition", "year": 2022, "scan": "/works/juljuri/award.webp" },
  "press": [{ "outlet": "세계일보", "title": "'오징어게임'의 줄다리기 전술, 과학적 근거 있다", "url": "" }],
  "timeline": [{ "version": "시제품 1호", "versionEn": "Prototype 1", "period": "2022.03", "desc": "…", "descEn": "…" }]
}
```

**GitHub 링크 매핑 (전부 `https://github.com/MOSW626/` 하위):**
juljuri→`Tug_of_War_Robot_Project_-2022-`, geungeuni→`Swinging_on_a_swing_Robot_Project_-2021-`, taektaeki→`delivery_cbsh`, pyeongtani→`Increased-delivery-item-stability-using-gimbal`, gosaengi→`automobile-stability-control_ionic-Robotic-Cat`, isp→(기존 유지)

- [ ] **Step 1: 실패 테스트 작성** — `src/test/works.test.js`에 추가:

```js
import { describe, it, expect } from 'vitest';
import { findWorkBySlug, detailWorks, adjacentWorks, flattenWorks } from '../lib/works.js';

const FIX = {
  robotDevelopment: [
    { title: 'A', slug: 'a', period: '2022.01' },
    { title: 'B', period: '2021.01' },
    { title: 'C', slug: 'c', period: '2020.01' },
  ],
  videoProduction: [], softwareProjects: [],
};

describe('work detail helpers', () => {
  it('findWorkBySlug returns the matching work with group attached', () => {
    expect(findWorkBySlug('a', FIX).title).toBe('A');
    expect(findWorkBySlug('a', FIX).group).toBe('robot');
  });
  it('findWorkBySlug returns null for unknown slug', () => {
    expect(findWorkBySlug('nope', FIX)).toBeNull();
  });
  it('detailWorks returns only slugged works in flatten order', () => {
    expect(detailWorks(FIX).map((w) => w.slug)).toEqual(['a', 'c']);
  });
  it('adjacentWorks returns prev/next with nulls at edges', () => {
    expect(adjacentWorks('a', FIX).prev).toBeNull();
    expect(adjacentWorks('a', FIX).next.slug).toBe('c');
    expect(adjacentWorks('c', FIX).prev.slug).toBe('a');
    expect(adjacentWorks('c', FIX).next).toBeNull();
  });
  it('every real robotDevelopment entry has a unique slug', () => {
    const slugs = flattenWorks().filter((w) => w.group === 'robot').map((w) => w.slug);
    expect(slugs.every(Boolean)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
```

- [ ] **Step 2: 실패 확인** — `npm test` → 신규 테스트 FAIL (`findWorkBySlug is not a function`)
- [ ] **Step 3: works.js 구현** —

```js
/** slug로 단일 작업물 조회 (group 부착), 없으면 null */
export function findWorkBySlug(slug, d = data) {
  return flattenWorks(d).find((w) => w.slug === slug) || null;
}

/** 상세 페이지가 있는(slug 보유) 작업물만, flatten 순서 유지 */
export function detailWorks(d = data) {
  return flattenWorks(d).filter((w) => !!w.slug);
}

/** detailWorks 기준 이전/다음 (끝단은 null) */
export function adjacentWorks(slug, d = data) {
  const list = detailWorks(d);
  const i = list.findIndex((w) => w.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return { prev: list[i - 1] || null, next: list[i + 1] || null };
}
```

- [ ] **Step 4: projects.json 확장** — robotDevelopment 8항목에 slug/image/github/team 추가 (팀 정보: 줄줄이=노수빈·안연수·이원호, 근근이=노수빈·안연수·이승환, 중화적정=4인팀 — 스펙·상장 스캔 기준). juljuri에 videos 6개(manifest의 실제 파일 수), geungeuni에 1개, gosaengi에 gallery(연구노트 22장 중 대표 8장 — 전부 넣으면 과함), juljuri/geungeuni에 award(+scan), juljuri에 press 8건(중부매일·충북일보·MBC충북·동양일보·충청매일·충청타임즈·세계일보·경향신문 — url 미확보 시 `"url": ""`). timeline은 이 Task에서 비워둠(Task 6이 채움).
- [ ] **Step 5: 신규 프로젝트 3건 추가** — softwareProjects에 `algorithmic-self`(AI/디지털인문학 실험, github: `MOSW626/algorithmic-self`, 2026.06), robotDevelopment에 `mr24_Quadrupedal`(KAIST MR 4족보행, github 링크), `mecha_ws`(ME203 자율주행 로봇, 2025.12, github 링크). 설명 ko/en 각 2문장 이내, 기존 항목 문체를 따를 것.
- [ ] **Step 6: 링크 정리** — videoProduction의 `"youtube": ""` 2건 필드 삭제, `"link": "https://mosw.notion.site/"` 3건 필드 삭제(무의미한 홈 링크). Roboticus `demo`를 `https://robotic-us.com`으로 교체하고 설명에 "회장" 크레덴셜 반영 (`공동창립` → `공동창립·회장`).
- [ ] **Step 7: 통과 확인** — `npm test` → 전체 PASS (기존 20 + 신규 5)
- [ ] **Step 8: 커밋** — `git commit -m "feat: extend projects data model with slugs, media, awards, press + detail helpers"`

---

### Task 3: 다크모드 (토큰 + 토글 + FOUC 방지) — Opus

**Files:**
- Modify: `src/styles/tokens.css`, `index.html`, `src/components/Nav.jsx`, `src/components/Nav.css`(존재 시), `src/App.jsx`
- Create: `src/lib/theme.js`
- Test: `src/test/theme.test.js`

**Interfaces:**
- Produces: `resolveTheme(stored, prefersDark) → 'light'|'dark'` (순수), `getInitialTheme() → 'light'|'dark'`, `setTheme(theme)` (DOM `data-theme` 반영 + localStorage `theme` 키 저장). Nav에 토글 버튼(aria-label 포함).

- [ ] **Step 1: 실패 테스트** — `src/test/theme.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { resolveTheme } from '../lib/theme.js';

describe('resolveTheme', () => {
  it('honors stored value', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
  });
  it('falls back to OS preference when nothing stored', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });
  it('ignores garbage stored values', () => {
    expect(resolveTheme('banana', true)).toBe('dark');
  });
});
```

- [ ] **Step 2: 실패 확인** — `npm test` → FAIL
- [ ] **Step 3: theme.js 구현** —

```js
const KEY = 'theme';

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
  if (persist) { try { localStorage.setItem(KEY, theme); } catch { /* noop */ } }
}
```

- [ ] **Step 4: 다크 토큰** — `tokens.css`에 추가 (라이트 토큰은 불변):

```css
:root[data-theme='dark'] {
  --bg: #0f1115;
  --bg-alt: #161a21;
  --text: #e7e9ee;
  --text-muted: #9aa3b2;
  --border: #262c36;
  --accent: #6b96ff;
  --accent-soft: rgba(107, 150, 255, 0.14);
  --shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.45);
}
:root { color-scheme: light; }
:root[data-theme='dark'] { color-scheme: dark; }
```

- [ ] **Step 5: FOUC 방지 인라인 스크립트** — `index.html` `<head>` 최상단(스타일시트보다 앞)에:

```html
<script>
  (function () {
    try {
      var s = localStorage.getItem('theme');
      var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = (s === 'light' || s === 'dark') ? s : (d ? 'dark' : 'light');
    } catch (e) {}
  })();
</script>
```

- [ ] **Step 6: Nav 토글** — Nav에 해/달 토글 버튼 (react-icons `FaSun`/`FaMoon`), `aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}`. App.jsx에서 `useState(getInitialTheme)` + 토글 시 `setTheme` 호출, 상태는 Context 없이 App→Nav prop으로 전달. `background-color`/`color`에 `transition: 0.25s ease` (단, `@media (prefers-reduced-motion: reduce)`에서는 transition 제거).
- [ ] **Step 7: 전 컴포넌트 다크 점검** — `grep -rn "#\|rgba(" src/**/*.css`로 토큰 밖 하드코딩 색상 찾아 토큰으로 치환. `npm run dev`로 라이트/다크 각각 전 라우트 육안 확인.
- [ ] **Step 8: 테스트+빌드** — `npm test` 전체 PASS, `npm run build` 성공
- [ ] **Step 9: 커밋** — `git commit -m "feat: dark mode with OS preference, manual toggle, and FOUC guard"`

---

### Task 4: 카드 이미지화 + Works/Home 폴리시 — Opus

**Files:**
- Modify: `src/components/ProjectCard.jsx` + 해당 CSS, `src/pages/Works.jsx`, `src/components/FeaturedWorks.jsx`(홈 Featured 섹션 컴포넌트 — 실제 파일명은 grep으로 확인)
- Test: 기존 테스트 유지 (렌더 로직 순수 함수 변경 없음)

**Interfaces:**
- Consumes: Task 2의 `image` 필드, Task 3의 다크 토큰
- Produces: `<ProjectCard work={...} />`가 `work.image` 있으면 썸네일 렌더 + `work.slug` 있으면 카드 전체가 `/works/:slug` 링크, 없으면 기존 외부 링크 동작 유지

**구현 지침** (make-interfaces-feel-better 스킬을 읽고 적용할 것):
- 썸네일: `aspect-ratio: 16/10; object-fit: contain;` 배경 `var(--bg-alt)` (배경 제거 PNG라 contain이 맞음 — cover는 로봇이 잘림), `loading="lazy"`, hover 시 `transform: scale(1.03)` (이미지에만, 카드엔 lift+shadow), reduced-motion 존중
- 이미지 없는 카드: 그룹별 플레이스홀더 (react-icons 로봇/코드/영상 아이콘 + `--accent-soft` 배경) — 레이아웃 높이 일관 유지
- 스태거 reveal: 기존 `.reveal` 활용, 카드 목록에 `transition-delay: calc(var(--i) * 40ms)` 패턴 (inline style로 `--i` 인덱스 주입, 최대 6까지 캡)
- 카드가 slug 링크일 때 내부 외부 링크(GitHub 등)는 `event.stopPropagation()` 없이 중첩 `<a>` 금지 — 카드 상단 이미지+제목만 `<Link>`로 감싸고 하단 링크 행은 분리

- [ ] **Step 1: 현재 카드 구조 파악** — `ProjectCard.jsx`와 사용처(Works, FeaturedWorks) Read
- [ ] **Step 2: 카드 개편 구현** — 위 지침대로. 클래스명은 기존 BEM 스타일(`project-card__media` 등) 유지
- [ ] **Step 3: 검증** — `npm run dev` → `/works` 필터 3종 + 홈 Featured에서 이미지·플레이스홀더·hover·다크모드 확인, 스크린샷
- [ ] **Step 4: 테스트+빌드** — `npm test`, `npm run build` PASS
- [ ] **Step 5: 커밋** — `git commit -m "feat: image thumbnails and polish for work cards"`

---

### Task 5: 프로젝트 상세 페이지 (/works/:slug) — Opus

**Files:**
- Create: `src/pages/WorkDetail.jsx`, `src/pages/WorkDetail.css`
- Modify: `src/App.jsx` (라우트 추가)
- Test: Task 2의 헬퍼 테스트가 커버 (페이지 자체는 육안 검증)

**Interfaces:**
- Consumes: `findWorkBySlug`, `adjacentWorks` (src/lib/works.js), `pick`/`t`/`useLang` (src/i18n.js), Task 1 에셋
- Produces: `/works/:slug` 라우트. 알 수 없는 slug면 `/works`로 `<Navigate replace>`.

**페이지 구조** (필드 있는 섹션만 렌더 — 모든 섹션 optional):

```jsx
// App.jsx 라우트 추가 (works 목록 라우트 아래):
<Route path="/works/:slug" element={<WorkDetail />} />
```

```jsx
// WorkDetail.jsx 골격
import { useParams, Link, Navigate } from 'react-router-dom';
import { findWorkBySlug, adjacentWorks } from '../lib/works.js';
import { useLang, pick, t } from '../i18n.js';

export default function WorkDetail() {
  const { slug } = useParams();
  const { lang } = useLang();
  const work = findWorkBySlug(slug);
  if (!work) return <Navigate to="/works" replace />;
  const { prev, next } = adjacentWorks(slug);
  // 섹션 순서: hero → meta → timeline → videos → gallery → award/press → links → prev/next
}
```

- **hero**: `work.image` 큰 이미지 + `pick(work,'title',lang)` + `pick(work,'description',lang)` + `← Works` 백링크
- **meta 바**: period · `pick(work,'team',lang)` · technologies 뱃지 · award 뱃지(있으면 금색 계열 — 새 토큰 `--gold: #b8860b` 계열을 tokens.css에 추가, 다크 변형 포함)
- **timeline**: 세로 타임라인 리스트 (version/period/desc). timeline 비어있으면 섹션 미렌더 (Task 6 전까지는 안 보임 — 정상)
- **videos**: `<video controls preload="metadata" poster={v.poster} src={v.src}>` 그리드, 각 label 캡션
- **gallery**: 반응형 그리드 `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`, 클릭 시 `<dialog>` 요소로 확대 (라이브러리 금지, ESC/배경클릭 닫기, `dialog::backdrop` 스타일)
- **award/press**: 상장 스캔 이미지(있으면) + 보도 리스트 (url 없으면 outlet·title 텍스트만, url 있으면 외부 링크 `target="_blank" rel="noreferrer"`)
- **links**: github / youtube / demo / 관련 PDF(`/docs/juljuri-report.pdf` — juljuri만, `robot-history.pdf`는 공용) 버튼 행
- **prev/next**: 하단 좌우 내비게이션 카드

- [ ] **Step 1: 라우트+빈 페이지** — App.jsx 라우트 추가, WorkDetail이 title만 렌더하는 상태로 `/works/juljuri` 접속 확인
- [ ] **Step 2: 섹션 구현** — 위 구조 전체. 반응형(모바일 1열), 다크모드, reveal 애니메이션 적용
- [ ] **Step 3: 카드 연결 확인** — Task 4의 카드 → 상세 이동, 알 수 없는 slug(`/works/zzz`) → `/works` 리다이렉트 확인
- [ ] **Step 4: 육안 검증** — juljuri(영상 6편)·geungeuni(영상 1편)·gosaengi(갤러리)·pyeongtani(미디어 최소) 4종 스크린샷, 라이트/다크
- [ ] **Step 5: 테스트+빌드** — `npm test`, `npm run build` PASS
- [ ] **Step 6: 커밋** — `git commit -m "feat: project detail pages with timeline, video, gallery, awards"`

---

### Task 6: 콘텐츠 — 타임라인 데이터 + Notes 시리즈 3편 — Opus

**Files:**
- Modify: `src/data/projects.json` (timeline 채움)
- Create: `src/content/log/juljuri-devlog.ko.md` / `.en.md`, `geungeuni-devlog.ko.md` / `.en.md`, `gosaengi-devlog.ko.md` / `.en.md`

**Interfaces:**
- Consumes: `$SRC/[ 최종 제출 ]/KAIST 특기입증자료1_안연수_로봇개발일대기.pdf` (읽기 전용, Read 툴로 PDF 페이지 읽기), 대통령상 연구보고서 PDF, 기존 log 포스트의 frontmatter 형식 (`src/content/log/hello-archive.ko.md` 참조 — date/tags 등 형식 복제)
- Produces: juljuri·geungeuni·gosaengi의 `timeline[]` (각 4~8엔트리, ko+En), Notes 글 3편×2언어

**작성 원칙:**
- 일대기 PDF의 시제품 버전별 기록(근근이 1~8호: 시행착오법→거리센서→IMU→IR/게이트 센서 진화; 줄줄이 0~10호: PID 반동 메커니즘; 고생이 1~3호)을 발췌·요약. **PDF에 없는 사실 창작 금지.**
- Notes 글: 1인칭 회고, 700~1200자(ko), 이미지 삽입 가능 (`![...](/works/juljuri/hero.webp)` 등 public 경로). 줄줄이 글에는 세계일보 "오징어게임 줄다리기 전술" 보도 에피소드와 "누울수록 유리하다" FBD 증명 이야기 포함. 고생이 글에는 IEEE 논문("Research on Trajectory Planning of a Robot Inspired by Free-Falling Cat")에서 출발한 이야기와 연구노트 이미지 1~2장 포함.
- frontmatter의 date는 실제 작성일(2026-07-16), tags는 `["로봇", "개발기"]` / `["robots", "devlog"]`.
- 한국어 초안 완성 후 humanize-korean 스킬 기준으로 AI 티(기계적 병렬, 과도한 접속사, 번역투) 자체 점검·윤문 후 저장.

- [ ] **Step 1: PDF 정독** — 일대기 PDF 전체 + 연구보고서 요약부를 Read (pages 파라미터로 분할)
- [ ] **Step 2: timeline 데이터 작성** — 3개 프로젝트 projects.json에 기입, `npm test`로 JSON 문법·기존 테스트 확인
- [ ] **Step 3: Notes 3편 작성 (ko)** — 윤문 포함
- [ ] **Step 4: 영어판 3편** — 직역이 아닌 자연스러운 영어로
- [ ] **Step 5: 렌더 확인** — `/notes` 목록·상세에서 3편 정상 렌더, 이미지 로드 확인
- [ ] **Step 6: 커밋** — `git commit -m "content: robot devlog series (juljuri/geungeuni/gosaengi) + development timelines"`

---

### Task 7: SEO / 메타 / sitemap — Sonnet

**Files:**
- Create: `src/lib/meta.js`, `public/robots.txt`, `scripts/generate-sitemap.mjs`, `public/manifest.json`, `public/og-default.png`
- Modify: `index.html`, `package.json` (build 스크립트), 각 페이지 컴포넌트 (usePageMeta 호출), `src/pages/WorkDetail.jsx`
- Test: `src/test/meta.test.js`

**Interfaces:**
- Consumes: Task 2 slug 목록, `src/lib/logPosts.js`의 포스트 목록
- Produces: `usePageMeta({ title, description, image? })` 훅, 빌드 시 `public/sitemap.xml` 자동 생성

- [ ] **Step 1: 실패 테스트** — `src/test/meta.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { buildTitle } from '../lib/meta.js';

describe('buildTitle', () => {
  it('appends site name', () => {
    expect(buildTitle('Works')).toBe('Works · YS AN');
  });
  it('returns bare site name when no page title', () => {
    expect(buildTitle()).toBe('YS AN — Robotics Archive');
  });
});
```

- [ ] **Step 2: meta.js 구현** —

```js
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
```

- [ ] **Step 3: 페이지별 적용** — Home(`usePageMeta({})`), Works, WorkDetail(`title: pick(work,'title',lang), image: work.image`), LogList, LogPost(제목·요약), Cv
- [ ] **Step 4: index.html 정적 기본값** — `<meta name="description">`, OG/Twitter 카드 태그(og:type=website, twitter:card=summary_large_image), canonical
- [ ] **Step 5: og-default.png 제작** — juljuri hero 이미지를 1200×630 캔버스에 배치 (ffmpeg pad/scale 사용, 배경 `#0f1115`, 텍스트 없이 심플하게)
- [ ] **Step 6: robots.txt + sitemap 스크립트** —

```
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://mosw626.github.io/sitemap.xml
```

`scripts/generate-sitemap.mjs`: `src/data/projects.json`에서 slug, `src/content/log/`에서 `*.ko.md` 파일명(slug)을 수집해 `/`, `/works`, `/notes`, `/cv`, `/works/<slug>`, `/notes/<slug>` URL로 `public/sitemap.xml` 작성. `package.json` build를 `"build": "node scripts/generate-sitemap.mjs && vite build && cp dist/index.html dist/404.html"`로 변경.

- [ ] **Step 7: manifest.json** — name/short_name/theme_color(`#2563eb`)/background_color/icons(기존 favicon.svg 참조 + 512px PNG 생성), index.html에 `<link rel="manifest">`
- [ ] **Step 8: 검증** — `npm test` PASS, `npm run build` 후 `dist/sitemap.xml` 내용 확인, 프리뷰에서 라우트 이동 시 document.title 변경 확인
- [ ] **Step 9: 커밋** — `git commit -m "feat: per-route meta, OG tags, sitemap, robots, manifest"`

---

### Task 8: 자잘한 수리 (CV JSON화 · Footer · Hero) — Sonnet

**Files:**
- Create: `src/data/cv.json`
- Modify: `src/pages/Cv.jsx`, `src/components/Footer.jsx`, `src/components/Hero.jsx`, `src/data/profile.json`

**Interfaces:**
- Produces: `cv.json` — `{ "education": [...], "experience": [...], "awards": [...] }`, 각 항목 En-접미사 규약

- [ ] **Step 1: CV 데이터 추출** — `Cv.jsx`의 `EDUCATION`/`EXPERIENCE`/`AWARDS` 상수를 `src/data/cv.json`으로 이전, Cv.jsx는 import해 렌더. Roboticus 항목을 "공동창립자·회장 (President)"으로 갱신, 수상 목록에 장관상·YSC 포함 여부를 projects.json award와 대조해 일치시킴.
- [ ] **Step 2: Footer 연도** — `© {new Date().getFullYear()}`
- [ ] **Step 3: Hero 정리** — `dangerouslySetInnerHTML` 제거: `profile.json`의 `heroDescription`에서 `<strong>` 태그를 빼고 `heroHighlights: ["강조어1", ...]` 배열 분리 → 렌더 시 문자열 split으로 `<strong>` 감싸기. CTA 앵커는 홈 내 섹션(`#works`)을 가리키되 라벨을 "하이라이트 보기"류로 변경해 Nav의 Works와 혼선 제거. `cvUrl` 빈 필드 삭제.
- [ ] **Step 4: 검증** — `npm test`, `npm run dev`로 홈·CV 육안 확인 (인쇄 미리보기 포함)
- [ ] **Step 5: 커밋** — `git commit -m "fix: dynamic footer year, CV data extraction, hero cleanup"`

---

### Task 9: 통합 검증 + 배포 — Fable 감독 하에 Sonnet

- [ ] **Step 1: 전체 테스트** — `npm test` 전체 PASS 확인 (출력 첨부)
- [ ] **Step 2: 빌드** — `npm run build` 성공, `du -sh dist` (총량 확인), `find dist -size +50M` (100MB 근접 파일 없는지)
- [ ] **Step 3: 프리뷰 순회** — `npm run preview` 후 전 라우트(홈/works/상세 8종/notes 4편/cv) × 라이트·다크 확인, 대표 스크린샷 6장
- [ ] **Step 4: 코드리뷰** — /code-review 수준의 정합성 점검 (신규 코드 전반)
- [ ] **Step 5: push** — `git push origin main` → GitHub Actions 배포 확인 (`gh run watch` 또는 run list)
- [ ] **Step 6: 라이브 확인** — 배포된 https://mosw626.github.io 에서 상세 페이지·영상 재생·다크모드 동작 확인

## 실행 순서 및 병렬성

```
Task 1 (에셋) ─┬→ Task 2 (데이터) ─┬→ Task 4 (카드) ─┐
               │                    ├→ Task 5 (상세)  ├→ Task 7 (SEO) → Task 9 (검증·배포)
               │                    └→ Task 6 (콘텐츠)┘
Task 3 (다크모드) ──────────────────────────┘ (독립, 언제든)
Task 8 (수리) ──────────────────────────────┘ (독립, 언제든)
```

Task 1·3·8은 병렬 시작 가능. Task 4·5·6은 Task 2 완료 후 병렬. Task 7은 5·6 이후. Task 9는 마지막.
