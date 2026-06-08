# 아카이브 도입 설계 (Archive Feature)

- 날짜: 2026-06-08
- 대상: ys-an.github.io (안연수 개인 사이트, Vite + React 18, GitHub Pages)
- 상태: 승인됨 — 구현 계획(writing-plans) 단계로 진행

## 1. 배경과 목표

현재 사이트는 단일 스크롤 페이지로 된 "자기소개 명함"이다. 사용자는 여기에 **아카이브 역할**을 더하고 싶어 한다. 친구 사이트(hyunseok.dev)의 프로젝트/연구/일지(Log) 구조를 참고했다.

브레인스토밍으로 확정된 방향:

- **둘 다 쌓는다** — 글(Log)과 작업물(Works) 양쪽.
- **자체 보관** — Tistory(현재 글 1개)는 더 이상 쓰지 않고, 글은 저장소에 Markdown으로 직접 작성·보관. 사실상 백지에서 시작.
- **홈 + 아카이브 분리** — 홈은 명함 그대로 두고, `Log`·`Works`를 별도 페이지로. 라우팅 도입.
- **Works 이전 + 홈 하이라이트** — 전체 작업물은 `/works`로 옮기고, 홈에는 대표작 2~3개만 Featured로.
- **글은 한·영 둘 다 보관** — 영어 번역은 작성 시점에 사람이 채운다(런타임 자동번역 기능 없음). 데이터 구조만 이중언어를 받는다.

핵심 비목표(Non-goal): 런타임 자동번역, 댓글, 검색, 태그 페이지, RSS, 조회수 — 이번 범위 밖.

## 2. 아키텍처 개요

단일 스크롤 앱에 `react-router-dom`을 도입해 멀티 페이지로 전환한다.

경로:

| 경로 | 페이지 | 내용 |
|------|--------|------|
| `/` | Home | 자기소개 명함 (Hero · About · Featured Works · Contact) |
| `/works` | Works | 전체 작업물 갤러리 + 카테고리 필터 |
| `/log` | LogList | 글 목록 (날짜 역순) |
| `/log/:slug` | LogPost | 글 상세 (Markdown 렌더, 언어별 본문) |

`App.jsx`는 라우터 셸이 된다: `LanguageContext.Provider` → `Nav` → `<Routes>` → `Footer`. 스크롤 리빌 IntersectionObserver는 라우트 전환마다 재초기화한다(현재 `.reveal` 요소를 다시 관찰).

### 라우팅과 GitHub Pages

깔끔한 URL(`/log/my-post`)을 위해 `BrowserRouter`를 쓴다. GitHub Pages(유저 페이지, `base: '/'`)는 클라이언트 경로를 몰라 딥링크·새로고침 시 404를 반환한다. 빌드 산출물의 `dist/index.html`을 `dist/404.html`로 복사해 해결한다 — GitHub Pages가 알 수 없는 경로에 404.html을 서빙하면 SPA가 부팅되고 react-router가 경로를 해석한다. `.nojekyll`은 이미 존재한다.

복사는 빌드 스크립트에 추가한다: `"build": "vite build && cp dist/index.html dist/404.html"`. (CI는 ubuntu에서 실행되므로 `cp` 사용 가능.)

라우트 전환 시 스크롤을 맨 위로 올리는 `ScrollToTop` 동작을 추가한다.

## 3. Log — 글 보관 방식

### 파일 구조

글은 한 글당 한·영 두 파일:

```
src/content/log/
  <slug>.ko.md
  <slug>.en.md
```

`slug`는 파일명에서 파생한다(예: `first-robot.ko.md` → slug `first-robot`). 한 글은 같은 slug의 `.ko`/`.en` 쌍으로 묶인다.

### Frontmatter

각 파일 상단에 YAML 형식 frontmatter:

```markdown
---
title: 첫 로봇을 만들며
date: 2026-06-08
summary: 중학교 때 처음 로봇을 만든 이야기.
tags: 로봇, 회고
thumbnail: /assets/log/first-robot.jpg
---

본문은 여기서부터 Markdown.
```

- `title` (필수) — 글 제목
- `date` (필수) — `YYYY-MM-DD`
- `summary` (필수) — 목록에 보일 한 줄 요약
- `tags` (선택) — 쉼표 구분 문자열
- `thumbnail` (선택) — 목록 카드용 이미지 경로

`date`·`tags`·`slug`는 `.ko`/`.en` 쌍에서 동일해야 한다(불일치 시 빌드 인덱스가 ko 기준을 채택하고 경고).

### 로딩과 인덱싱

Vite의 `import.meta.glob('../content/log/*.md', { query: '?raw', import: 'default', eager: true })`로 모든 글의 원문 문자열을 빌드 시점에 가져온다.

- **frontmatter 파서**: 외부 의존성 없이 직접 작성하는 순수 함수(`parseFrontmatter(raw)` → `{ data, body }`). 형식이 단순(키: 값 + 쉼표 리스트)하므로 의존성을 추가하지 않는다. 미니멀 기조 유지.
- **인덱스 빌더**: glob 결과를 slug별로 묶고 언어별 변형을 합쳐 `{ slug, date, tags, ko: {title, summary, body, thumbnail}, en: {...} }` 형태로 정규화. 날짜 역순 정렬.
- 파서·인덱스 빌더·정렬은 `src/lib/log.js`의 순수 함수로 두고 **Vitest 단위테스트**.

### 렌더링

- 목록(`LogList`): 정렬된 인덱스를 카드로. 현재 언어(`useLang`)에 맞춰 title/summary 표시, 언어 뱃지(KO/EN 보유 여부), 날짜, 태그, 썸네일(있으면).
- 상세(`LogPost`): slug로 글을 찾아 현재 언어 본문을 `react-markdown` + `remark-gfm`으로 렌더(표·코드블록 지원). 해당 언어 본문이 없으면 다른 언어로 폴백하고 안내 뱃지 표시.

### 새 글 작성 흐름

사용자가 "이런 글 올려줘"라고 하면 Claude Code가 `.ko.md`를 작성하고 영어로 번역해 `.en.md`까지 만들어 커밋한다. 빌드하면 목록에 자동 반영.

## 4. Works — 작업물 갤러리

### 데이터 모델

기존 `src/data/projects.json`을 확장한다. 현재 구조는 `robotDevelopment`/`videoProduction` 두 배열이고 각 항목에 `category`("로봇 개발"/"영상 제작")·`period`·`link`/`github`/`youtube`·`images` 등이 있다.

추가 필드:

- `featured` (bool) — 홈에 노출할 대표작 표시. 2~3개에만 `true`.

기존 필드(title/description/category/period/link/github/youtube/images/tags)는 유지한다. 정렬은 `period` 시작일 기준 역순으로 파생한다.

### 표시

- **홈 Featured**: `featured === true`인 항목만(전 카테고리 합쳐 2~3개) 추려 홈에 노출. 기존 홈 `Projects` 섹션을 이 Featured 뷰로 교체.
- **`/works`**: 전체를 그리드로. 카테고리 필터(로봇 개발 / 영상 제작 / 전체). 기존 `ProjectCard` 컴포넌트 재사용.
- featured 필터·카테고리 필터·정렬은 `src/lib/works.js`(또는 기존 `lib/projects.js` 확장)의 순수 함수로 두고 **Vitest 단위테스트**.

## 5. 컴포넌트·파일 구조 변화

신설:

- `src/pages/Home.jsx` — 현재 App 본문(Hero · About · Featured Works · Contact)
- `src/pages/Works.jsx` — 전체 갤러리 + 필터
- `src/pages/LogList.jsx` — 글 목록
- `src/pages/LogPost.jsx` — 글 상세
- `src/lib/log.js` — frontmatter 파서 · 인덱스 빌더 · 정렬(순수 함수)
- `src/content/log/` — Markdown 글 (초기엔 샘플 1개 한·영 쌍)
- `src/components/ScrollToTop.jsx` — 라우트 전환 시 스크롤 상단 이동

수정:

- `src/App.jsx` — 라우터 셸로 전환
- `src/components/Nav.jsx` — `Home / Works / Log` 라우터 링크 + 언어 토글
- `src/data/projects.json` — `featured` 필드 추가
- `src/lib/projects.js` — featured/카테고리/정렬 헬퍼 추가(또는 `works.js` 신설)
- `package.json` — 의존성 추가, build 스크립트에 404.html 복사

유지: 미니멀 라이트 디자인, 디자인 토큰, Pretendard/Inter, i18n `pick()`/`t()` 패턴, 스크롤 리빌, 기존 Hero/About/Contact/Footer/ProjectCard 컴포넌트.

## 6. i18n

- UI(메뉴·날짜 라벨·필터·뱃지)는 기존 `t()`/`pick()` 패턴으로 한·영 토글.
- Log 본문은 언어별 파일에서 직접 가져오므로 현재 언어에 맞는 파일을 렌더. 누락 언어는 폴백 + 안내.
- Works 텍스트는 기존 `pick()` 폴백 패턴 유지(영어 필드 없으면 한국어).

## 7. 테스트

순수 함수 중심 Vitest 단위테스트:

- `parseFrontmatter` — 정상 파싱, 누락 필드, 태그 분리, 본문 분리.
- log 인덱스 빌더 — slug별 ko/en 병합, 날짜 역순 정렬, 한쪽 언어만 있는 글 처리.
- works 헬퍼 — featured 필터, 카테고리 필터, 정렬.

기존 i18n/projects 테스트는 유지. 컴포넌트 렌더 테스트는 범위 밖(현 기조 따름).

## 8. 의존성

추가(3개):

- `react-router-dom` — 클라이언트 라우팅
- `react-markdown` — 본문 렌더
- `remark-gfm` — 표·체크박스·취소선 등 GFM 지원

frontmatter는 의존성 없이 자체 파서로 처리.

## 9. 배포

- build 스크립트에서 `dist/index.html` → `dist/404.html` 복사로 SPA 딥링크 지원.
- 기존 GitHub Actions 워크플로(deploy.yml, Node 22) 그대로 사용. `dist` 업로드 경로 변동 없음.
- 검증: 빌드 후 `/log/<slug>` 딥링크 새로고침이 404 없이 글을 띄우는지 확인.

## 10. 범위 밖 (이번 작업 제외)

- 런타임 자동번역
- 댓글 · 검색 · 태그별 페이지 · RSS · 조회수
- 프로필 사진 · CV 링크 · 대학 이후 경력 콘텐츠(별도 후속 작업으로 대기 중)
