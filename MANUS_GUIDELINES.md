# Manus 작업 가이드라인 (필독)

이 레포(`MOSW626/mosw626.github.io`)의 디자인/UI 작업을 진행하기 전에 **반드시** 이 문서를 끝까지 읽어주세요.
지난 작업에서 같은 종류의 실수가 반복적으로 발생해 사이트가 빌드 실패 + 사실상 사용 불가 상태가 된 적이 있습니다. 이 문서는 그 실수들을 코드 상에서 영구적으로 차단하기 위한 체크리스트입니다.

---

## 0. 작업 완료의 정의

> **"build가 통과하고, 로컬에서 SPA 네비/모바일/언어 토글이 모두 정상 작동해야"** 작업 완료입니다.
> 시각적으로만 그럴듯해 보이는 상태는 미완료입니다.

작업을 종료하기 전 반드시 아래 두 명령을 통과시켜주세요:

```bash
CI=true npm run build      # warning 0개, error 0개여야 함
npm start                  # 로컬에서 직접 클릭 테스트
```

`CI=true` 환경에서는 **eslint warning이 error로 처리**됩니다. Vercel도 동일하게 동작하므로, 로컬 빌드가 실패하면 배포도 실패합니다.

---

## 1. 절대 하지 말 것 (Hard Rules)

### 1-1. 사용하지 않는 import 남기기 금지
```js
import Header from './components/Header';   // ❌ 사용 안 하면 CI 빌드 실패
```
컴포넌트를 사이드바/다른 구조로 대체했다면 **import 라인도 함께 삭제**해야 합니다. 데드 컴포넌트 파일도 함께 삭제하세요.

### 1-2. SPA 라우팅을 깨는 `<a href>` 금지 (내부 링크 한정)
```jsx
// ❌ 풀 페이지 리로드 → React 상태(LanguageContext 등) 전부 초기화됨
<a href="/about">About</a>

// ✅ 반드시 react-router-dom의 Link 사용
import { Link } from 'react-router-dom';
<Link to="/about">About</Link>
```
외부 링크(`https://...`, `mailto:`)는 `<a href>`가 맞습니다. 내부 라우트(`/about`, `/projects` 등)는 무조건 `<Link to>`.

### 1-3. CSS 미디어쿼리를 인라인 스타일로 덮어쓰지 말 것
```jsx
// ❌ 인라인 스타일은 항상 CSS를 이김 → 미디어쿼리가 무효화됨
<button className="header-toggle" style={{ display: 'none' }}>☰</button>
```
모바일에서 `.header-toggle { display: flex }`로 보이게 하려는 의도였지만, 위 인라인 스타일이 영구적으로 우선해서 모바일 사용자가 사이드바를 열 방법이 없어졌었습니다.

데스크탑 기본 숨김이 필요하면 **CSS에서**:
```css
.header-toggle { display: none; }                /* 데스크탑 기본 */
@media (max-width: 768px) {
  .header-toggle { display: flex; }              /* 모바일에서만 표시 */
}
```

### 1-4. React가 관리하는 DOM을 직접 조작하지 말 것
```jsx
// ❌ React reconciler가 다음 렌더에서 깨짐
<img onError={(e) => {
  e.target.parentElement.innerHTML = '<div>👤</div>';
}} />

// ✅ 상태 기반 fallback
const [photoError, setPhotoError] = useState(false);
{!photoError ? (
  <img src="..." onError={() => setPhotoError(true)} />
) : (
  <div className="avatar-fallback">👤</div>
)}
```

### 1-5. Flex/Grid 컨테이너의 자식 위치에 주의
`.App`은 `display: flex`로 사이드바 + 메인을 가로로 배치합니다. **푸터를 `.App`의 직접 자식으로 두면** 사이드바·메인과 가로로 정렬되어 레이아웃이 깨집니다. `margin-left: 280px` 같은 hack은 사용 금지 — 푸터는 `.main-content > .content-wrapper` **다음**에 위치해야 합니다.

```jsx
<div className="App">
  <aside className="sidebar">...</aside>
  <div className="main-content">
    <header className="header">...</header>
    <div className="content-wrapper"><Routes>...</Routes></div>
    <Footer />   {/* ← 여기 */}
  </div>
</div>
```

### 1-6. 단일 의미를 가진 CSS 클래스명을 두 파일에서 다르게 정의하지 말 것
예: `.footer` 룰을 `App.css`와 `Footer.css` 양쪽에 다르게 적으면 import 순서 + 카스케이드로 예측 불가능한 결과가 나옵니다. 컴포넌트별 CSS에만 둡니다.

---

## 2. 이 프로젝트 구조 (꼭 알아야 할 것)

```
src/
  App.js                  ← 사이드바 + 라우팅 + LanguageContext provider
  App.css                 ← 사이드바/메인/푸터 레이아웃
  data/
    profile.json          ← 인물 정보 (KO/EN 양쪽 필드 모두 있음: name/nameEn 등)
    skills.json           ← About 페이지 스킬 그리드
    projects.json
    organizations.json
    githubDescriptions.json
  pages/
    HomePage.js, AboutPage.js, ProjectsPage.js,
    OrganizationsPage.js, ContactPage.js
    AdminPage.js          ← /admin 라우트, 비밀번호 로그인 후 데이터 편집
  components/
    Home.js / About.js / Projects.js / Organizations.js /
    Contact.js / Footer.js / Overview.js / ProjectModal.js
    (각 컴포넌트는 자기 이름의 .css 파일을 import)
api/
  admin/login.js          ← Vercel Serverless Function
  admin/data/[name].js
vercel.json               ← /api 제외 SPA 라우팅
```

### 2-1. 다국어 (LanguageContext)
`src/App.js`에서 `LanguageContext`를 export하며 `lang` ('ko' | 'en')과 `setLang`을 제공합니다.
사용자에게 보이는 텍스트를 추가/변경할 때는 KO/EN 양쪽을 모두 처리하세요.

```jsx
import { LanguageContext } from '../App';
const { lang } = useContext(LanguageContext);
const subtitle = lang === 'en' ? 'About me' : '소개';
```

`profile.json`은 `bio1` / `bio1En`, `name` / `nameEn` 같은 페어 형태입니다. 새 텍스트 필드를 추가할 땐 같은 컨벤션을 따르세요.

### 2-2. 어드민 (`/admin`)
사이트 자체에 어드민 페이지가 있고 비밀번호로 로그인합니다. 어드민에서 `src/data/*.json`을 GitHub API로 직접 수정 → 자동 커밋 → Vercel 자동 배포.
**`AdminPage.js`, `api/admin/*` 파일을 건드릴 일이 있다면 미리 알려주세요.** 잘못 건드리면 사이트 운영이 끊깁니다.

### 2-3. 디자인 톤 (현재 베이스라인)
- 배경: `#0f1419` (dark)
- 카드/사이드바: `#1a1f2e`
- 보더: `#2a2f3e`
- 액센트(블루): `#4a9eff` / hover `#3a8eef`
- 텍스트: `#e8e8e8` (강조) / `#a0a0a0` (보조)
- 폰트: Inter
- 사이드바 폭: 데스크탑 280px / 태블릿 240px / 모바일은 슬라이드인

이 팔레트를 일관되게 유지해주세요. 컴포넌트마다 색을 새로 만들지 말고 위 값을 재사용합니다.

---

## 3. 권장 워크플로우

1. **읽기 먼저**: 변경하려는 컴포넌트와 관련 CSS를 모두 읽고 시작합니다. 비슷한 이름의 다른 컴포넌트가 있는지(예: `Header` vs 사이드바) 먼저 확인하세요.
2. **레이아웃 변경 시**: 데스크탑 → 태블릿(1024px) → 모바일(768px) 세 가지 폭에서 모두 작동하는지 머릿속에서 검증한 다음 실제로도 확인.
3. **이름이 같은 CSS 클래스가 두 곳에 있는지** grep으로 확인. 있다면 한쪽으로 통합.
4. **Hard Rule 위반 여부 셀프 체크** (1-1 ~ 1-6 항목).
5. **빌드 + 로컬 클릭 테스트** (섹션 0).
6. 통과 후 commit & push.

---

## 4. 변경 후 셀프 체크리스트

- [ ] `CI=true npm run build`가 0 warning, 0 error로 통과한다
- [ ] 새로 import한 모듈은 모두 실제로 사용된다
- [ ] 삭제/대체된 컴포넌트의 import 라인과 파일도 함께 정리되었다
- [ ] 내부 라우트는 `<Link to>`, 외부만 `<a href>` 사용
- [ ] CSS 미디어쿼리와 충돌하는 인라인 `display`/`visibility` 스타일이 없다
- [ ] React 컴포넌트 내부에서 `innerHTML`, `parentElement.innerHTML`, 직접적인 DOM 조작 없음 (`dangerouslySetInnerHTML`은 정적 콘텐츠에만)
- [ ] 새 텍스트는 KO/EN 양쪽 모두 제공된다
- [ ] 새 색/폰트를 추가하지 않고 섹션 2-3의 팔레트를 따랐다
- [ ] 푸터는 여전히 `.main-content` 내부에 있다
- [ ] 768px 이하 폭에서 사이드바가 슬라이드인 되고, 햄버거 토글이 보인다
- [ ] `/admin` 라우트가 여전히 정상 동작한다 (건드리지 않았다면 그대로)

---

## 5. 사이트 운영 정보

- **레포**: `MOSW626/mosw626.github.io`
- **배포**: Vercel (GitHub `main` 브랜치에 push되면 자동 빌드 + 배포)
- **로컬 주소**: `npm start` → `http://localhost:3000`
- **빌드 환경**: React 18 + react-router-dom 6 + react-bootstrap + react-icons

문의/충돌 사항이 있으면 작업을 시작하기 전에 먼저 알려주세요. 일단 PR 생성 전 commit 단위로 위 체크리스트를 한 번 더 점검해주시면 운영 사고가 크게 줄어듭니다. 감사합니다.
