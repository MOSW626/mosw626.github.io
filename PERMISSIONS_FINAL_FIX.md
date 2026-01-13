# 권한 오류 최종 해결 가이드

## 🔴 문제
```
remote: Permission to MOSW626/mosw626.github.io.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/MOSW626/mosw626.github.io.git/': The requested URL returned error: 403
```

## ✅ 해결 방법

### 1. 워크플로우 권한 수정 (완료)
- `contents: read` → `contents: write`로 변경
- `gh-pages` 브랜치에 푸시하려면 `write` 권한이 필요합니다

### 2. GitHub 저장소에서 권한 재확인 (필수!)

**반드시 GitHub 웹사이트에서 직접 확인해야 합니다:**

1. **GitHub 저장소로 이동**
   - https://github.com/MOSW626/mosw626.github.io

2. **Settings** → **Actions** → **General** 이동

3. **Workflow permissions** 섹션:
   - ✅ **Read and write permissions** 선택 (중요!)
   - ✅ **Allow GitHub Actions to create and approve pull requests** 체크

4. **Save** 클릭

5. **페이지 새로고침 후 다시 확인**
   - 설정이 제대로 저장되었는지 확인

### 3. GitHub Pages 설정 확인

1. **Settings** → **Pages** 이동
2. **Source**: **Deploy from a branch** 선택
3. **Branch**: `gh-pages` 선택
4. **Folder**: `/ (root)` 선택

## 🔧 워크플로우 변경사항

```yaml
permissions:
  contents: write  # read → write로 변경
  pages: write
  id-token: write
```

이제 `gh-pages` 브랜치에 푸시할 수 있습니다.

## 🚀 배포 재시도

워크플로우를 수정했으므로:
1. 새 커밋 푸시 (이미 완료됨)
2. Actions 탭에서 새 워크플로우 확인
3. 권한 설정이 올바르면 성공할 것입니다

## ⚠️ 여전히 실패하는 경우

### 대안 1: Personal Access Token 사용

1. **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)** 클릭
3. **repo** 권한 체크
4. 토큰 생성 후 복사
5. 저장소 → **Settings** → **Secrets and variables** → **Actions**
6. **New repository secret** 클릭
7. Name: `GH_PAGES_TOKEN`, Value: 생성한 토큰
8. 워크플로우에서 `GITHUB_TOKEN` 대신 `GH_PAGES_TOKEN` 사용

### 대안 2: 수동 배포

```bash
npm run build
npm run deploy
```

## 📝 체크리스트

- [ ] 워크플로우에 `contents: write` 권한 추가 (완료)
- [ ] GitHub 저장소에서 **Read and write permissions** 선택 확인
- [ ] GitHub Pages에서 `gh-pages` 브랜치 선택 확인
- [ ] 새 워크플로우 실행 확인

## 🔍 디버깅

권한이 여전히 작동하지 않으면:
1. Actions 탭에서 실패한 워크플로우의 로그 확인
2. 에러 메시지의 정확한 내용 확인
3. GitHub 저장소 설정 스크린샷 확인

