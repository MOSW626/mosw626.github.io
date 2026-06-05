# 포트폴리오 리디자인 설계 문서

- **작성일**: 2026-06-05
- **대상**: 안연수(Yeonsu An) 개인 포트폴리오 / 자기소개 사이트
- **레포**: `MOSW626/mosw626.github.io` (GitHub 사용자 Pages, 루트 경로 서빙)

## 1. 목표와 배경

### 결정된 방향 (사용자 확정)
- **1순위 독자**: 범용 자기소개 명함 — 누가 봐도 "이 사람이 누구고 뭘 했는지"를 빠르게 파악.
- **범위**: 완전 리디자인 (구조·토대까지 새로).
- **분위기**: 미니멀·라이트(밝고 깔끔).
- **언어**: 한국어/영어 병행 유지.
- **기반**: Vite + React로 재구축 (기존 CRA 폐기).

### 현재 사이트의 문제 (리디자인 근거)
1. **장르 불일치**: 사이드바 + 다크 대시보드 레이아웃. 포트폴리오는 위→아래로 읽는 내러티브 랜딩이어야 함. AI 에이전트가 레이아웃을 반복적으로 갈아엎은 흔적(커밋 로그)으로 일관성 붕괴.
2. **기술 과잉**: 정적 사이트인데 CRA + react-bootstrap + `admin/server.js` + `api/` 백엔드까지 포함.
3. **레포 노이즈**: 루트에 배포 삽질 문서 8종(`DEPLOYMENT_FAILURE_CHECK`, `FINAL_DEPLOYMENT_FIX`, `FIX_PAGES_BUILD`, `GITHUB_ACTIONS_ONLY_SETUP`, `MANUS_GUIDELINES`, `SETUP_GUIDE`, `PROJECT_FILES_GUIDE`, `PROJECTS_CUSTOMIZATION`).
4. **디테일 불일치**: README는 보라 그라데이션 / 실제 CSS는 파랑, 프로필 사진 없음, CV 링크 비어있음, 프로젝트 링크 다수가 노션 루트로만 연결.

### 보존할 자산
- 콘텐츠 데이터: `profile.json`, `projects.json`, `skills.json`, `organizations.json`.
- 매력적인 실적: 전국과학전람회 대통령상, 긱블 출연, YSC 선정, 로봇 9종 + 영상 3종.

## 2. 정보 구조 (단일 스크롤 페이지)

상단에 얇은 sticky 네비게이션(섹션 앵커 점프 + 한/영 토글 + GitHub 링크). 페이지는 하나의 세로 스크롤로 구성:

1. **Hero** — 이름, 직함(Robotics Engineer), 한 줄 소개, 실적 배지(🏆 대통령상 / 📺 긱블 / 🔬 YSC), CTA 버튼(프로젝트 보기 · GitHub · CV는 준비되면).
2. **About / 소개** — 짧은 내러티브 바이오 + 간단한 타임라인(중학교 로봇 시작 → 충북과학고 → 대통령상 → 긱블·YSC) + 스킬 그리드(아이콘 포함).
3. **Projects / 프로젝트** — 탭(로봇 개발 / 영상 제작) + 카드 그리드. 대표 프로젝트 상단. 카드: 제목·기간·짧은 설명·기술 태그·링크(notion/github/youtube).
4. **Contact / 연락처** — 이메일(mailto), GitHub, 노션, 블로그 직접 링크. (메시지 폼 제거)
5. **Footer** — 최소 정보 + 저작권.

### 제거/통합 결정
- **연락처 메시지 폼 제거**: 백엔드 필요 → 정적 사이트에서 미작동. 직접 링크로 대체.
- **영상 제작**은 별도 페이지가 아닌 Projects 내 탭으로 통합.
- **Organizations(소속) 페이지**는 단독 섹션을 없애고 About 섹션의 타임라인/한 줄로 흡수 (콘텐츠가 학교 1곳뿐이라 단독 섹션은 과함).

## 3. 비주얼 시스템

### 컬러 (라이트·미니멀)
- 배경: `#ffffff` (섹션 교차 시 `#fafafa`)
- 본문 텍스트: `#171717`, 보조 텍스트: `#6b7280`
- 테두리/구분선: `#e5e7eb`
- 포인트 컬러(액센트): `#2563eb` (차분한 블루) — 단일 액센트. 그라데이션·네온 금지.
- CSS 커스텀 프로퍼티(`--color-*`, `--space-*`)로 토큰화하여 한 곳에서 테마 제어.

### 타이포그래피
- 한글: Pretendard / 영문: Inter (웹폰트 또는 시스템 폴백).
- 큰 제목, 넉넉한 줄간격(1.6~1.7), 본문 measure 제한(가독성).
- 일관된 spacing scale (4px 배수).

### 컴포넌트·모션
- 카드: 1px 옅은 테두리, 기본 그림자 없음, hover 시에만 부드러운 그림자 + 살짝 상승.
- 태그: 알약형(pill), 보조 회색 배경.
- 모션: 스크롤 진입 시 절제된 fade/slide-in (IntersectionObserver, `prefers-reduced-motion` 존중).

## 4. 기술 설계

### 스택
- **Vite + React 18** (CRA → Vite 이전).
- 라우팅: 단일 페이지라 React Router 불필요 → 제거 (앵커 스크롤). `/admin` 경로도 제거.
- 스타일: 순수 CSS + CSS 커스텀 프로퍼티 (또는 CSS Modules). **react-bootstrap·bootstrap 제거.**
- 아이콘: `react-icons` 유지.
- 타이핑 애니메이션: `typed.js` 유지 가능하나, 의존성 축소를 위해 간단한 CSS/JS로 대체 검토(구현 시 결정, 기본은 제거하고 정적 직함 + 한 줄 회전 정도).

### 컴포넌트 경계 (각각 단일 책임)
- `App` — 언어 컨텍스트 + 섹션 조립.
- `Nav` — sticky 네비, 앵커, 한/영 토글.
- `Hero`, `About`, `Skills`, `Projects`(+`ProjectCard`, 탭), `Contact`, `Footer` — 각 섹션 독립 컴포넌트, props/데이터로만 통신.
- `i18n` — `lang` 컨텍스트 + ko/en 문자열 헬퍼. 데이터 JSON의 `*En` 필드 패턴 유지.

### 데이터
- `src/data/*.json` 재사용·정리. 스키마는 현행 유지하되 사용 안 하는 필드 정리.
- 죽은 노션 루트 링크는 실제 링크가 없으면 카드에서 해당 버튼 숨김 처리(빈 문자열이면 렌더 안 함).

### 정리 대상 (삭제)
- `admin/`, `api/`, `.vercel/` 관련 빌드 산출물(레포에 커밋된 것), 루트 배포 문서 8종.
- `src/pages/`(라우팅 폐기), 사이드바 관련 CSS.
- `react-router-dom`, `react-bootstrap`, `bootstrap`, `express`, `cors`, `gh-pages` 의존성 정리.

### 배포
- **GitHub Actions → GitHub Pages** 단일 워크플로(`.github/workflows/deploy.yml`): main push 시 `npm ci && npm run build` → Pages 배포.
- 사용자 Pages 레포이므로 Vite `base: '/'`.
- `vercel.json`/`.vercel`는 GitHub Pages로 일원화하며 제거(또는 Vercel을 계속 쓸지는 구현 착수 시 1회 확인).

## 5. 반응형
- 데스크톱: 콘텐츠 최대 폭 컨테이너(~1080px) 중앙 정렬.
- 태블릿/모바일: 단일 컬럼, 네비는 간단한 토글 또는 가로 스크롤 앵커. 카드 그리드 1열로.

## 6. 테스트·검증
- 정적 사이트라 로직 테스트는 최소. 핵심 검증:
  - `npm run build` 성공 + 로컬 `preview`에서 전 섹션 렌더.
  - 한/영 토글 시 모든 섹션 문자열 전환.
  - 데스크톱/모바일 폭에서 레이아웃 깨짐 없음.
  - 죽은 링크(빈 url) 미노출 확인.
  - Lighthouse 접근성/성능 기본 점검.

## 7. 범위 밖 (YAGNI)
- 백엔드, 연락처 폼, 관리자 페이지, CMS.
- 블로그 본문 통합(외부 Tistory 링크로 충분).
- 다국어 3개 이상.

## 8. 마이그레이션 순서 (개략 — 상세는 구현 계획에서)
1. Vite 프로젝트 토대 구성 + 데이터/에셋 이전.
2. 디자인 토큰(CSS 변수) + 전역 스타일.
3. Nav → Hero → About/Skills → Projects → Contact → Footer 순 컴포넌트 구현.
4. 한/영 i18n 연결.
5. 구식 파일·의존성·문서 제거.
6. GitHub Actions 배포 워크플로 구성 및 검증.
