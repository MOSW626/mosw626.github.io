# 완전한 해결 방법 - 권한 + 빌드 문제

## 🔴 현재 문제 2가지

### 문제 1: 권한 오류 (여전히 발생)
```
remote: Permission to MOSW626/ys-an.github.io.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/MOSW626/ys-an.github.io.git/': The requested URL returned error: 403
```

### 문제 2: 빌드 파일 문제
```
cp: no such file or directory: /home/runner/work/ys-an.github.io/ys-an.github.io/build/.*
```

## ✅ 해결 방법

### 1단계: GitHub 저장소에서 권한 설정 (필수!)

**이것은 반드시 GitHub 웹사이트에서 직접 해야 합니다!**

1. https://github.com/MOSW626/ys-an.github.io 로 이동
2. **Settings** 탭 클릭
3. **Actions** → **General** 이동
4. **Workflow permissions** 섹션:
   - ✅ **Read and write permissions** 선택
   - ✅ **Allow GitHub Actions to create and approve pull requests** 체크
5. **Save** 클릭

### 2단계: 로컬에서 빌드 테스트

```bash
# 의존성 설치
npm install

# 빌드 테스트
npm run build

# build 폴더 확인
ls -la build/
```

빌드가 성공하고 `build` 폴더에 파일이 있어야 합니다.

### 3단계: 변경사항 커밋 및 푸시

워크플로우 파일이 업데이트되었으므로:
```bash
git add .github/workflows/deploy.yml
git commit -m "Add build verification step to workflow"
git push origin main
```

### 4단계: GitHub Actions에서 재실행

1. GitHub 저장소의 **Actions** 탭으로 이동
2. 실패한 워크플로우 클릭
3. **Re-run all jobs** 클릭

## 🔍 문제 진단

### 빌드가 실패하는 경우

1. **의존성 문제 확인**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **에러 메시지 확인**
   - GitHub Actions의 **Build** 단계 로그 확인
   - 에러 메시지를 읽고 해결

### 권한이 여전히 안 되는 경우

1. **저장소 소유자 확인**
   - 저장소가 `MOSW626` 계정 소유인지 확인
   - Organization 저장소인 경우 Organization 설정도 확인

2. **캐시 문제**
   - 브라우저 캐시 삭제
   - 시크릿 모드에서 다시 시도

3. **다른 방법: Personal Access Token 사용**
   - GitHub → Settings → Developer settings → Personal access tokens
   - **Generate new token (classic)** 클릭
   - `repo` 권한 선택
   - 토큰 생성 후 복사
   - 저장소 → Settings → Secrets and variables → Actions
   - **New repository secret** 클릭
   - Name: `GH_PAGES_TOKEN`, Value: 생성한 토큰
   - 워크플로우에서 `GITHUB_TOKEN` 대신 `GH_PAGES_TOKEN` 사용

## 📝 워크플로우 개선사항

업데이트된 워크플로우에는 다음이 추가되었습니다:
- 빌드 출력 확인 단계
- `force_orphan: false` 설정 (첫 배포 시 문제 해결)

## ✨ 완료 후 확인

1. **Actions 탭**: 모든 단계가 ✅ (초록색)인지 확인
2. **gh-pages 브랜치**: Code 탭에서 브랜치 목록 확인
3. **사이트 접속**: https://mosw626.github.io/ys-an.github.io

## 🆘 여전히 안 되면

1. GitHub Actions의 **Build** 단계 로그를 자세히 확인
2. 에러 메시지를 복사해서 알려주세요
3. 로컬에서 `npm run build`가 성공하는지 확인

