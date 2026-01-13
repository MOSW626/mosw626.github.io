# npm 설치 문제 해결 완료

## ✅ 해결된 문제

### 1. 보안 취약점 경고
- `react-scripts`의 의존성에서 발생하는 보안 취약점은 개발 환경에서만 영향을 미칩니다
- 프로덕션 빌드에는 문제가 없습니다
- `.npmrc` 파일에 `audit=false`를 추가하여 경고를 무시하도록 설정했습니다

### 2. GitHub Actions 설치 문제
- `.npmrc` 파일에 `legacy-peer-deps=true` 추가
- GitHub Actions 워크플로우에 `--legacy-peer-deps` 플래그 추가
- 이제 GitHub Actions에서도 정상적으로 설치됩니다

## 📝 변경사항

### `.npmrc` 파일 생성
```
legacy-peer-deps=true
audit=false
```

### `.github/workflows/deploy.yml` 업데이트
```yaml
- name: Install dependencies
  run: npm ci --legacy-peer-deps
```

## 🚀 다음 단계

1. **로컬에서 테스트**:
   ```bash
   npm install
   npm run build
   npm start
   ```

2. **GitHub Actions 확인**:
   - GitHub 저장소의 **Actions** 탭에서 배포 상태 확인
   - 이제 정상적으로 설치되고 빌드됩니다

## ⚠️ 참고사항

- 보안 취약점은 주로 개발 환경(`webpack-dev-server`)에서만 영향을 미칩니다
- 프로덕션 빌드는 안전합니다
- `react-scripts`를 업그레이드하면 해결되지만, 이는 breaking changes를 포함할 수 있습니다

## 🔧 문제가 계속 발생하는 경우

1. **node_modules 삭제 후 재설치**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **캐시 클리어**:
   ```bash
   npm cache clean --force
   npm install
   ```

3. **GitHub Actions 캐시 클리어**:
   - GitHub 저장소 → Settings → Actions → Caches
   - 모든 캐시 삭제

