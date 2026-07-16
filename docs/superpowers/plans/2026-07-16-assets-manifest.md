# 에셋 큐레이션 매니페스트 (Task 1)

작업일: 2026-07-16
브랜치: feat/archive-v3
소스 기준 경로 (`$SRC`): `/Volumes/adolescence/학교/3. 충북과학고(2021-2023)/3. 3학년/[ 입시관련 ]/33_안연수 입시자료/2. 특기입증자료`

모든 항목은 `cp` 또는 읽기 전용 도구(sips 읽기, ffmpeg/cwebp 디코드)로만 처리했다. 소스 볼륨에는 어떤 쓰기 작업도 하지 않았다(검증은 "원본 무변경 확인" 절 참고).

## 도구 확인 (Step 1)

- `ffmpeg`: `/opt/homebrew/bin/ffmpeg` (8.1) — 있음. 단 **이 빌드는 libwebp 인코더가 빠져 있어 `-c:v webp` 사용 불가** (`Automatic encoder selection failed ... probably disabled`).
- `sips`: `/usr/bin/sips` — 있음. 픽셀 크기 조회·EXIF 회전 보정에 사용.
- `qlmanage`: `/usr/bin/qlmanage` — 있음. (상장 이미지는 이미 개별 JPG로 존재해 PDF 렌더링 불필요, 사용 안 함)
- `cwebp`: `/opt/homebrew/bin/cwebp` (libwebp 1.6.0) — **추가로 발견해 사용**. WebP 인코딩(품질·리사이즈·알파 보존)은 전부 이 도구로 수행.

**우회 내역**: 브리프의 예시 명령(`ffmpeg -i in.png -vf scale ... out.webp`)은 이 환경에서 동작하지 않아, 대신 `sips`로 원본 픽셀 크기를 읽고 장변 기준(가로/세로 중 긴 쪽)으로 `cwebp -resize <w|0> <0|h> -resize_mode down_only -q <quality>`를 사용하는 방식으로 대체했다. 결과물 포맷(webp)·경로·품질(82)·장변 규칙은 브리프와 동일하게 유지했으므로 산출 경로에 영향 없음.

## 소스 확인 및 매핑 (Step 2)

### 로봇들_이미지 (히어로 이미지 소스)
`$SRC/특기 입증/로봇들_이미지/`에서 실제 파일명 확인:
`줄줄이.png`, `근근이.png`, `고생이.png`, `택택이.png`, `탐탐이.png`, `평탄이.png`, `중화.png` — 브리프 표기와 실제 한글 파일명 일치.

### 상장 페이지 식별
`$SRC/특기 입증/상장/상장_1.jpg` ~ `상장_8.jpg` 8장을 육안 확인한 결과:
- `상장_6.jpg` = **대통령상** (제6976호, 2022.11.30, 제68회 전국과학전람회, "노수빈, 안연수, 이원호 팀" — 줄다리기 로봇 팀) → juljuri
- `상장_3.jpg` = **국무총리상** (제7827호, 2021.12.1, 제67회 전국과학전람회, "노수빈, 안연수, 이승환 팀" — 그네 로봇 팀) → geungeuni

이미 개별 JPG로 존재하므로 `상장.pdf`(전체 8장 합본) 렌더링 없이 해당 JPG를 직접 WebP 변환.

### ISP 관련 이미지
`$SRC` 전체(로봇들_이미지 포함)에서 "isp"/"ISP" 이름의 이미지·사진을 검색했으나 Arduino 라이브러리 내부 코드 파일(`conf_isp.h` 등)만 검출되고, 실제 사진/이미지 자산은 발견하지 못했다. **`public/works/isp/hero.webp`는 생략함** — 브리프 Step 규칙("없으면 생략 후 manifest에 기록")에 따른 처리.

## 변환 규칙 (Step 3~5)

- 히어로 이미지: 장변 1600px, WebP quality 82, 알파 유지 (`cwebp -resize <w> <h> -resize_mode down_only`로 업스케일 방지 — 원본이 1600px보다 작으면 원본 크기 유지)
- 연구노트(고생이): 장변 1400px, WebP quality 82
- 상장 이미지: 장변 1600px, WebP quality 82 (히어로와 동일 규칙 적용)
- 작업 현장 사진(workbench): 장변 1600px, WebP quality 82. **iPhone 8 촬영본이라 EXIF Orientation=6(90도 회전 필요) 태그가 있었음** — `sips -r 90`으로 회전 보정 후 WebP 변환 (미보정 시 옆으로 누운 이미지가 저장됨을 Read 도구로 확인 후 수정).
- 영상: 재인코딩 없이 원본 그대로 복사 (모두 100MB 미만, 3.1MB~38MB)
- 포스터 프레임: `ffmpeg -ss 1 -frames:v 1`로 각 mp4의 1초 지점 프레임을 PNG로 추출한 뒤 cwebp로 WebP 변환(장변 1600px, q82)

## 목표 파일 배치 대조표

| 목표 경로 | 소스 경로 (`$SRC` 이하) | 실제 크기 | 비고 |
|---|---|---|---|
| `public/works/juljuri/hero.webp` | 특기 입증/로봇들_이미지/줄줄이.png | 14K | 원본 698×296 → 698×296(원본이 1600 미만이라 무변경) |
| `public/works/geungeuni/hero.webp` | 특기 입증/로봇들_이미지/근근이.png | 26K | 원본 720×405 → 720×405 |
| `public/works/gosaengi/hero.webp` | 특기 입증/로봇들_이미지/고생이.png | 68K | 3024×4032 → 1200×1600 |
| `public/works/taektaeki/hero.webp` | 특기 입증/로봇들_이미지/택택이.png | 33K | 3024×4032 → 1200×1600 |
| `public/works/tamtami/hero.webp` | 특기 입증/로봇들_이미지/탐탐이.png | 28K | 476×403 → 476×403 |
| `public/works/pyeongtani/hero.webp` | 특기 입증/로봇들_이미지/평탄이.png | 84K | 3024×4032 → 1200×1600 |
| `public/works/titration/hero.webp` | 특기 입증/로봇들_이미지/중화.png | 6.6K | 338×332 → 338×332 |
| `public/works/isp/hero.webp` | — (미발견) | **생략** | 위 "ISP 관련 이미지" 절 참고 |
| `public/works/juljuri/demo-1.mp4` | 특기 입증/2022 전람회 - 줄다리기 로봇/영상/`1. 오징어 게임(발표용) .mp4` | 6.4M | 순서는 원본 파일명 번호(1, 1-1, 2, 3, 4, 5) 순으로 매핑 |
| `public/works/juljuri/demo-2.mp4` | 〃/`1-1.개성넘치는(발표용).mp4` | 3.1M | |
| `public/works/juljuri/demo-3.mp4` | 〃/`2. 선수 줄다리기(발표용).mp4` | 19M | |
| `public/works/juljuri/demo-4.mp4` | 〃/`3. 원호 장력 실험(발표용).mp4` | 9.5M | |
| `public/works/juljuri/demo-5.mp4` | 〃/`4. 박스 시연(발표용).mp4` | 9.1M | |
| `public/works/juljuri/demo-6.mp4` | 〃/`5. 도르래 시연(발표용).mp4` | 38M | |
| `public/works/juljuri/demo-{1..6}-poster.webp` | (각 mp4의 1초 지점 프레임) | 56K~224K | ffmpeg+cwebp로 추출 |
| `public/works/geungeuni/demo-1.mp4` | 특기 입증/2021 전람회 - 그네 로봇/2021 전람회 안연수 그네타기.mp4 | 20M | |
| `public/works/geungeuni/demo-1-poster.webp` | (1초 지점 프레임) | 316K | |
| `public/works/gosaengi/note-01.webp` … `note-22.webp` | 특기 입증/고생이 탐구일지/고생이 탐구일지_1.jpg … _22.jpg | 32K~88K/장 | 순번 그대로 zero-pad 매핑 (`_N.jpg` → `note-{N:02d}.webp`), 2480×3506 → 991×1400 |
| `public/works/juljuri/award.webp` | 특기 입증/상장/상장_6.jpg (대통령상) | 148K | 801×1122, 무변경(이미 1600 미만) |
| `public/works/geungeuni/award.webp` | 특기 입증/상장/상장_3.jpg (국무총리상) | 156K | 802×1144, 무변경 |
| `public/docs/robot-history.pdf` | [ 최종 제출 ]/KAIST 특기입증자료1_안연수_로봇개발일대기.pdf | 1.5M | 그대로 복사 |
| `public/docs/juljuri-report.pdf` | [ 최종 제출 ]/gist 제출/로봇(줄줄이) 개발을 통한 줄다리기 핵심 메커니즘 탐구_안연수.pdf | 5.8M | 그대로 복사 |
| `public/docs/awards-certificate.pdf` | 특기 입증/상장/수상실적증명서_안연수.pdf | 332K | 그대로 복사 |
| `public/about/workbench.webp` | 사진/IMG_7473.JPG | 252K | EXIF 90도 회전 보정 후 4032×3024(raw) → 1600×2134 |

## 검증 (Step 6)

### find 출력 (public/works public/docs public/about, 41개 파일)

```
public/about/workbench.webp
public/docs/awards-certificate.pdf
public/docs/juljuri-report.pdf
public/docs/robot-history.pdf
public/works/geungeuni/award.webp
public/works/geungeuni/demo-1-poster.webp
public/works/geungeuni/demo-1.mp4
public/works/geungeuni/hero.webp
public/works/gosaengi/hero.webp
public/works/gosaengi/note-01.webp ... note-22.webp (22개)
public/works/juljuri/award.webp
public/works/juljuri/demo-1-poster.webp .. demo-6-poster.webp (6개)
public/works/juljuri/demo-1.mp4 .. demo-6.mp4 (6개)
public/works/juljuri/hero.webp
public/works/pyeongtani/hero.webp
public/works/taektaeki/hero.webp
public/works/tamtami/hero.webp
public/works/titration/hero.webp
```

### 총량 (du -sh)

```
108M  public/works
7.6M  public/docs
252K  public/about
```

합계 약 116MB. **100MB를 넘는 개별 파일 없음** (최대 파일: `public/works/juljuri/demo-6.mp4` 38MB).

### 원본 볼륨 무변경 확인

작업 전후 `ls -la`로 아래 디렉터리의 파일 크기·수정일시를 대조 — 전부 작업 시작 시점 값과 동일:
- `특기 입증/로봇들_이미지/` (7개 png 대상 파일 포함 16개 항목)
- `특기 입증/상장/` (11개 항목, `상장_3.jpg`=289892B, `상장_6.jpg`=280524B 등)
- `특기 입증/2022 전람회 - 줄다리기 로봇/영상/` (6개 mp4)
- `사진/IMG_7473.JPG` (2104509B, 2023-09-11)
- `특기 입증/고생이 탐구일지/` (22개 jpg)

모든 소스 조작은 `cp`(복사) 또는 `Read`/`sips -g`(읽기 전용 메타데이터 조회)로만 수행했으며, 소스 경로에 `--out`/`-o`/`>` 등 쓰기 대상으로 지정한 적 없음. 상기 대조 결과 원본은 무변경.

## Step 8 커밋

`git add public docs/superpowers/plans/2026-07-16-assets-manifest.md && git commit -m "assets: curate robot archive media from admissions portfolio (images/videos/pdfs)"`

## 후속 Task(2/5/6)를 위한 참고

- `public/works/isp/` 디렉터리 자체가 존재하지 않음 (히어로 이미지 없음). projects.json에 isp 항목을 넣을 경우 hero 이미지 경로는 비워두거나 플레이스홀더 처리 필요.
- juljuri의 demo-N 순서는 원본 파일명 번호(1, 1-1, 2, 3, 4, 5)를 그대로 따른 것이며, 내용 상 의미있는 순서(오징어 게임 → 개성넘치는 → 선수 줄다리기 → 원호 장력 실험 → 박스 시연 → 도르래 시연)와 일치한다.
- 모든 webp는 알파 채널(투명 배경) 보존됨 — 로봇 히어로 이미지(줄줄이/근근이/고생이/택택이/탐탐이/평탄이/중화)는 배경 제거된 PNG 원본을 그대로 반영.
