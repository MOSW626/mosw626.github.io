# GitHub Actions 권한 설정 - 단계별 가이드

## 🔴 현재 문제
```
remote: Permission to MOSW626/ys-an.github.io.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/MOSW626/ys-an.github.io.git/': The requested URL returned error: 403
```

이 오류는 GitHub Actions가 저장소에 푸시할 권한이 없어서 발생합니다.

## ✅ 해결 방법 (반드시 GitHub에서 설정 필요)

### 📸 스크린샷으로 따라하기

1. **GitHub 저장소 열기**
   - https://github.com/MOSW626/ys-an.github.io 로 이동

2. **Settings 탭 클릭**
   - 저장소 페이지 상단의 탭 메뉴에서 **Settings** 클릭

3. **왼쪽 사이드바에서 Actions 클릭**
   - Settings 페이지 왼쪽 메뉴에서 **Actions** 섹션 찾기
   - **Actions** → **General** 클릭

4. **Workflow permissions 섹션 찾기**
   - 페이지를 아래로 스크롤하여 **Workflow permissions** 섹션 찾기

5. **권한 변경**
   - 현재 **Read repository contents and packages permissions** (읽기 전용)로 설정되어 있을 것입니다
   - **Read and write permissions** (읽기/쓰기)로 변경
   - ✅ **Allow GitHub Actions to create and approve pull requests** 체크박스도 체크

6. **Save 버튼 클릭**
   - 페이지 하단의 **Save** 버튼 클릭

7. **배포 재실행**
   - 저장소의 **Actions** 탭으로 이동
   - 실패한 워크플로우 실행 클릭
   - **Re-run all jobs** 버튼 클릭
   - 또는 `main` 브랜치에 새 커밋을 푸시하면 자동으로 재실행됩니다

## 📝 설정 위치 정확히

```
GitHub 저장소
  └─ Settings (상단 탭)
      └─ Actions (왼쪽 사이드바)
          └─ General
              └─ Workflow permissions (페이지 중간)
                  └─ Read and write permissions (라디오 버튼 선택)
```

## ⚠️ 중요 사항

- 이 설정은 **반드시 GitHub 웹사이트에서 직접** 해야 합니다
- 코드만 수정해서는 해결되지 않습니다
- 저장소 소유자(MOSW626)만 이 설정을 변경할 수 있습니다

## 🔄 설정 후 확인

1. **Actions 탭 확인**
   - https://github.com/MOSW626/ys-an.github.io/actions
   - 최신 워크플로우가 성공적으로 실행되는지 확인

2. **gh-pages 브랜치 확인**
   - 저장소의 **Code** 탭에서 브랜치 목록 확인
   - `gh-pages` 브랜치가 생성되었는지 확인

3. **사이트 접속**
   - 배포 완료 후: https://mosw626.github.io/ys-an.github.io

## 🆘 여전히 안 되면

1. **저장소 소유자 확인**
   - 저장소가 `MOSW626` 계정 소유인지 확인

2. **Organization 저장소인 경우**
   - Organization 설정에서도 권한을 확인해야 할 수 있습니다

3. **캐시 문제**
   - 브라우저 캐시를 지우고 다시 시도

4. **다른 방법: Personal Access Token 사용**
   - Settings → Developer settings → Personal access tokens
   - 토큰 생성 후 Secrets에 추가
   - 워크플로우에서 `GITHUB_TOKEN` 대신 사용

## ✨ 완료 후

권한 설정이 완료되면:
- ✅ GitHub Actions가 자동으로 배포합니다
- ✅ `gh-pages` 브랜치에 자동으로 푸시됩니다
- ✅ 사이트가 자동으로 업데이트됩니다

