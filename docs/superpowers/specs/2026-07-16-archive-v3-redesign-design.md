# ys-an.github.io v3 — 로봇 개발 일대기 아카이브 리디자인

날짜: 2026-07-16
상태: 설계 승인됨 (사용자 확정: 풀 리디자인 / 미니멀+다크모드+폴리시 / 영상 레포 직접 포함 / Notes 로봇 개발기 시리즈)

## 목적

현재 사이트는 구조(Works/Notes/CV 라우팅, 테스트 20개)는 탄탄하지만 콘텐츠 파이프가 끊겨 있다:
프로젝트 15개에 이미지 0장, Notes 글 1개, 대통령상·국무총리상 수상작 GitHub 링크 미연결, SEO/OG 전무.
입시 특기입증자료(45GB 중 웹용 핵심 ~200MB)와 GitHub 21개 레포를 사이트에 연결해
"로봇 개발 일대기"를 실제로 보여주는 아카이브로 격상한다.

## 소스 자료 (읽기 전용 — 절대 편집 금지, 복사만 허용)

기준 경로: `/Volumes/adolescence/학교/3. 충북과학고(2021-2023)/3. 3학년/[ 입시관련 ]/33_안연수 입시자료/2. 특기입증자료`

| 자료 | 경로 (기준 경로 하위) | 용도 |
|---|---|---|
| 로봇 완성샷 7종 (배경 제거 PNG) | `특기 입증/로봇들_이미지/` (58MB) | 카드·상세 히어로 이미지 |
| 로봇 개발 일대기 PDF | `[ 최종 제출 ]/KAIST 특기입증자료1_안연수_로봇개발일대기.pdf` | 타임라인 콘텐츠 원전 |
| 대통령상 연구보고서 97p | `[ 최종 제출 ]/gist 제출/로봇(줄줄이) 개발을 통한 줄다리기 핵심 메커니즘 탐구_안연수.pdf` | 줄줄이 상세·언론보도 |
| 상장 스캔 + 수상실적증명서 | `특기 입증/상장/` (6.8MB) | 수상 증빙 |
| 손글씨 연구노트 22장 | `특기 입증/고생이 탐구일지/` (15MB) | 고생이 상세 갤러리 |
| 시연 영상 (대통령상 6편) | `특기 입증/2022 전람회 - 줄다리기 로봇/영상/` (~85MB) | 상세 페이지 video |
| 시연 영상 (국무총리상 1편) | `특기 입증/2021 전람회 - 그네 로봇/2021 전람회 안연수 그네타기.mp4` | 상세 페이지 video |
| 작업 현장 사진 | `사진/IMG_7473.JPG` 외 선별 | About/Notes 삽화 |
| 언론보도자료 | `특기 입증/언론보도자료.pdf` | 보도 섹션 |

외부 자산: robotic-us.com (본인이 회장), mesc-website.vercel.app (개발 총괄), GitHub MOSW626 (21 레포).

## 사이트 구조

```
/                홈: 히어로 + 하이라이트 뱃지 + 이미지형 Featured Works + 최신 기록 + Contact
/works           이미지 카드 갤러리 (robotDevelopment / videoProduction / softwareProjects 3그룹 유지)
/works/:slug     ★신설 프로젝트 상세 페이지
/notes           기록 목록 (+로봇 개발기 시리즈)
/notes/:slug     기록 상세 (기존 마크다운 파이프라인 재사용)
/cv              CV — 데이터 JSON 분리, PDF 다운로드 추가
```

### 프로젝트 상세 페이지 (핵심 신기능)

데이터 주도 렌더링: `projects.json` 확장 필드 + 프로젝트별 상세 콘텐츠(마크다운 또는 JSON 섹션).

구성 요소 (필드가 있을 때만 렌더):
1. 히어로: 배경 제거 완성샷 + 이름/한줄 소개 + 메타(기간·팀·역할·수상·기술)
2. 개발 타임라인: 시제품 1호→최종호 시행착오 (일대기 PDF 발췌, 한/영)
3. 시연 영상: `<video controls preload="metadata" poster=...>` 임베드
4. 갤러리: 사진·연구노트 스캔 (라이트박스는 선택 — 기본은 그리드+클릭 확대)
5. 수상·언론: 상장 이미지 + 보도 링크/발췌 (세계일보 "오징어게임 줄다리기" 포함)
6. 링크: GitHub 소스, 유튜브, 관련 Notes
7. 이전/다음 프로젝트 내비게이션

상세 페이지 제공 대상 (1차): 줄줄이(대통령상), 근근이(국무총리상), 고생이(연구노트 보유),
택택이, 탐탐이, 평탄이, ISP, 자동 중화 적정 기기 — 로봇 8종.
소프트웨어 프로젝트는 카드에서 외부 링크(GitHub/사이트)로 직행 (상세 페이지 없음, YAGNI).

## 데이터 모델 변경

`projects.json` 항목 확장 (모든 필드 optional, 기존 필드 유지):

```jsonc
{
  "slug": "juljuri",            // 상세 페이지 라우팅 키 (로봇 8종 필수)
  "image": "/works/juljuri/hero.webp",
  "github": "https://github.com/MOSW626/Tug_of_War_Robot_Project_-2022-",
  "videos": [{ "src": "/works/juljuri/demo1.mp4", "poster": "...", "label": { "ko": "...", "en": "..." } }],
  "gallery": [{ "src": "...", "alt": { "ko": "...", "en": "..." } }],
  "award": { "title": { "ko": "대통령상", "en": "Presidential Award" }, "event": {...}, "year": 2022, "scan": "/works/juljuri/award.webp" },
  "press": [{ "outlet": "세계일보", "title": "...", "url": "..." }],
  "timeline": [{ "version": {...}, "period": "...", "desc": { "ko": "...", "en": "..." } }],
  "team": { "ko": "3인 팀 (줄줄연수원)", "en": "..." },
  "period": "2022.03 – 2022.11"
}
```

신규 항목 추가: `algorithmic-self`, `mr24_Quadrupedal`(4족보행), `mecha_ws`(ME203 자율주행) → softwareProjects/robotDevelopment 적절 배치.
정리: 영상 프로젝트 빈 youtube 링크·무의미한 Notion 홈 링크 제거 또는 실링크 교체(확인 불가 시 필드 삭제).

## 디자인 시스템

- 토큰 확장: `tokens.css`에 다크 팔레트 추가. `[data-theme="dark"]` + `prefers-color-scheme` 기본값 + Nav 토글 + localStorage 저장. FOUC 방지 인라인 스크립트 in index.html.
- 화이트+블루(#2563eb) 미니멀 유지. 다크에서는 채도/명도 조정된 액센트.
- 카드 격상: 이미지 썸네일(aspect-ratio 고정, object-fit cover), hover 시 subtle lift + 이미지 줌.
- 마이크로 인터랙션: 스태거 reveal, focus-visible 링, reduced-motion 존중. `make-interfaces-feel-better` 스킬 기준.
- 이미지: WebP 변환(원본 PNG 대비 축소), `loading="lazy"`, width/height 명시로 CLS 방지.

## 에셋 파이프라인

- 대상 디렉토리: `public/works/<slug>/` (이미지·영상·PDF), `public/press/` 등.
- 이미지: PNG/JPG → WebP (품질 ~82), 히어로는 1200px, 썸네일 640px 변형.
- 영상: 100MB/파일 초과 없음 확인, 필요시 ffmpeg H.264 재인코딩(1080p, CRF 23)으로 총량 ~100MB 이내.
- 연구노트 22장: 장변 1400px WebP.
- PDF(일대기·연구보고서·수상증명): 원본 그대로 복사, 상세 페이지에서 다운로드 링크.
- 원본 볼륨은 어떤 경우에도 수정·이동·삭제 금지. cp로 읽기만.

## 콘텐츠 (Notes 시리즈)

로봇 개발기 3~5편, 한/영 각 1파일 (`src/content/log/`):
1. 줄줄이 — 대통령상까지: 반동 메커니즘과 PID, "누울수록 유리하다" 증명, 오징어게임 보도 에피소드
2. 근근이 — 국무총리상: 시행착오법→IMU→IR 타이밍 인식 진화기
3. 고생이 — IEEE 논문에서 시작한 고양이 착지 연구 (손글씨 노트 삽화)
4. (여유 시) 로봇 3년 연대기 총론 / algorithmic-self 소개

문체: 1인칭 회고, 입시자료 사실 기반, 과장 금지. 한국어 초안은 AI 티 제거 윤문(humanize) 적용 후 커밋.
사실 검증: 수상 연도·팀원·기관명은 입시자료 원문과 대조.

## SEO / 메타

- 라우트별 `<title>`/`<meta description>` 동적 갱신 (경량 자체 훅 — react-helmet 의존성 추가 없이 useEffect 기반 유틸).
- OG/Twitter 카드: 기본 OG 이미지 1장 제작(로봇 완성샷 콜라주) + 상세 페이지는 프로젝트 이미지.
  (SPA 한계상 크롤러별 동적 OG는 불완전 — 정적 기본값 우선, 상세는 best-effort로 수용)
- `public/robots.txt`, `sitemap.xml`(정적 생성 — 빌드 스크립트로 slug 목록에서 생성), `manifest.json`(아이콘 포함).

## 자잘한 수리

- Footer 연도 동적화 (`new Date().getFullYear()`)
- CV 데이터(`EDUCATION`/`EXPERIENCE`/`AWARDS`) → `src/data/cv.json` 분리, Roboticus "공동창립자·회장" 반영
- `cvUrl` 정리: CV PDF를 만들어 `public/`에 두고 다운로드 버튼 연결 (또는 필드 제거)
- `dangerouslySetInnerHTML` 제거 — heroDescription을 구조화 데이터(strong 분리)로
- Hero CTA 앵커/라우트 혼선 정리

## 테스트 / 검증

- 기존 Vitest 20개 유지 + 신규 순수 함수(slug 조회, sitemap 생성, 테마 유틸) 테스트 추가
- `npm run build` 성공 + dist 산출물 확인
- 로컬 프리뷰로 전 라우트·다크모드·영상 재생 육안 검증 (스크린샷)
- 최종 code-review 후 커밋·배포

## 실행 체계

Fable = 계획·감독·리뷰. 구현은 Opus/Sonnet 서브에이전트:
1. 에셋 큐레이션·변환 (Sonnet)
2. 디자인 시스템 + 다크모드 (Opus)
3. 상세 페이지 + 라우팅 + 데이터 모델 (Opus)
4. Notes 콘텐츠 작성 + 윤문 (Opus)
5. SEO/메타 + 자잘한 수리 (Sonnet)
6. 통합 검증 + 코드리뷰

## 범위 제외 (YAGNI)

- 프레임워크 교체(Next.js 등), SSR/프리렌더링 도입
- 소프트웨어 프로젝트 상세 페이지
- 원본 36GB 영상 아카이빙, 유튜브 업로드(본인 계정 필요)
- 댓글·검색 등 동적 기능
