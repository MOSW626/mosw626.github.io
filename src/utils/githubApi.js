// GitHub API를 사용하여 프로젝트 정보 가져오기
import { githubProjectDescriptions } from '../data/githubProjects';
import profile from '../data/profile.json';

export const fetchGitHubRepos = async (username = profile.githubUsername) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20&type=all`);

    if (!response.ok) {
      // Rate limit이나 다른 오류 처리
      if (response.status === 403) {
        console.warn('GitHub API rate limit에 도달했습니다. 잠시 후 다시 시도해주세요.');
        // 빈 배열 반환하되, 사용자에게는 GitHub 프로필 링크 제공
        return [];
      }
      console.error('GitHub API 응답 오류:', response.status, response.statusText);
      return [];
    }

    const repos = await response.json();

    // 빈 배열이면 빈 배열 반환 (에러 아님)
    if (!repos || repos.length === 0) {
      console.log('GitHub 저장소가 없거나 비공개입니다.');
      return [];
    }

    console.log(`GitHub 저장소 ${repos.length}개를 찾았습니다.`);

    // 저장소 내용 분석하여 간단한 요약 생성
    const reposWithDetails = await Promise.all(
      repos.slice(0, 10).map(async (repo) => {
        // 수동으로 추가한 설명이 있으면 우선 사용
        let summary = githubProjectDescriptions[repo.name] || repo.description;

        // description이 없거나 너무 짧으면 저장소 내용 분석
        if (!summary || summary.length < 10) {
          try {
            // 저장소의 루트 디렉토리 파일 목록 가져오기
            const contentsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/contents`, {
              headers: {
                'Accept': 'application/vnd.github.v3+json'
              }
            });

            if (contentsResponse.ok) {
              const contents = await contentsResponse.json();
              const fileNames = contents.map(item => item.name.toLowerCase());

              // 주요 설정 파일 분석
              const analysis = {
                isWeb: fileNames.includes('package.json') || fileNames.includes('index.html') || fileNames.includes('app.py'),
                isPython: fileNames.includes('requirements.txt') || fileNames.includes('setup.py') || fileNames.includes('pyproject.toml'),
                isRust: fileNames.includes('cargo.toml') || fileNames.includes('cargo.lock'),
                isCpp: fileNames.includes('cmakelists.txt') || fileNames.includes('makefile') || fileNames.includes('.cpp'),
                isRos: fileNames.includes('package.xml') || (fileNames.includes('setup.py') && fileNames.some(f => f.includes('ros'))),
                isAndroid: fileNames.includes('build.gradle') || fileNames.includes('androidmanifest.xml'),
                isJupyter: fileNames.some(f => f.endsWith('.ipynb')),
                hasDocker: fileNames.includes('dockerfile') || fileNames.includes('docker-compose.yml'),
                hasReadme: fileNames.includes('readme.md') || fileNames.includes('readme.rst'),
              };

              // 프로젝트 타입 판단
              const parts = [];

              if (analysis.isWeb) {
                if (fileNames.includes('package.json')) {
                  parts.push('웹 애플리케이션');
                } else {
                  parts.push('웹사이트');
                }
              } else if (analysis.isAndroid) {
                parts.push('안드로이드 앱');
              } else if (analysis.isRos) {
                parts.push('ROS 로봇 프로젝트');
              } else if (analysis.isPython) {
                if (analysis.isJupyter) {
                  parts.push('Jupyter 노트북');
                } else if (fileNames.some(f => f.includes('robot') || f.includes('mecha'))) {
                  parts.push('로봇 제어 시스템');
                } else {
                  parts.push('Python 프로젝트');
                }
              } else if (analysis.isCpp) {
                if (fileNames.some(f => f.includes('robot') || f.includes('segway'))) {
                  parts.push('로봇 하드웨어 제어');
                } else {
                  parts.push('C++ 프로젝트');
                }
              } else if (analysis.isRust) {
                parts.push('Rust 프로젝트');
              }

              // 언어 정보 추가
              if (repo.language && !parts.includes(repo.language + ' 프로젝트')) {
                if (parts.length === 0) {
                  parts.push(`${repo.language} 프로젝트`);
                }
              }

              // Topics 정보 활용
              if (repo.topics && repo.topics.length > 0) {
                const relevantTopics = repo.topics.filter(t =>
                  !['config', 'github-config', 'template', 'starter', 'hacktoberfest'].includes(t.toLowerCase())
                );
                if (relevantTopics.length > 0 && parts.length === 0) {
                  parts.push(relevantTopics[0] + ' 프로젝트');
                }
              }

              // Docker 사용 여부
              if (analysis.hasDocker) {
                parts.push('(Docker 지원)');
              }

              // 최종 요약 생성
              if (parts.length > 0) {
                summary = parts.join(' ') + '입니다.';
              } else {
                summary = `${repo.language || '다양한 언어'}로 개발된 프로젝트입니다.`;
              }
            }
          } catch (error) {
            console.log(`저장소 내용 분석 실패: ${repo.name}`, error);
            // 분석 실패 시 기본 설명
            if (repo.language) {
              summary = `${repo.language}로 개발된 프로젝트입니다.`;
            } else if (repo.topics && repo.topics.length > 0) {
              const relevantTopics = repo.topics.filter(t =>
                !['config', 'github-config'].includes(t.toLowerCase())
              );
              summary = relevantTopics.length > 0
                ? `${relevantTopics[0]} 프로젝트입니다.`
                : '프로젝트입니다.';
            } else {
              summary = '프로젝트입니다.';
            }
          }
        }

        // 깨진 텍스트 감지 및 정리
        const isCorrupted = (text) => {
          if (!text || text.length < 5) return false;
          const corruptedPattern = /[ìíîïðñóôõöùúûüýþÿ]/;
          const corruptedChars = text.match(/[ìíîïðñóôõöùúûüýþÿ]/g);
          if (corruptedChars && corruptedChars.length > text.length * 0.2) {
            return true;
          }
          return corruptedPattern.test(text) && corruptedChars && corruptedChars.length > 3;
        };

        // 깨진 텍스트면 재생성
        if (isCorrupted(summary)) {
          // 깨진 텍스트는 저장소 정보로 재생성
          const parts = [];
          if (repo.language) parts.push(`${repo.language} 프로젝트`);
          if (repo.topics && repo.topics.length > 0) {
            const relevantTopics = repo.topics.filter(t =>
              !['config', 'github-config'].includes(t.toLowerCase())
            );
            if (relevantTopics.length > 0) {
              parts.push(relevantTopics[0] + ' 관련');
            }
          }
          summary = parts.length > 0 ? parts.join(' ') + '입니다.' : `${repo.language || '프로젝트'}입니다.`;
        }

        // 최종 설명
        if (!summary || summary.length < 5) {
          summary = `${repo.language || '다양한 언어'}로 개발된 프로젝트입니다.`;
        }

        return {
          id: repo.id,
          title: repo.name,
          description: summary,
          github: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updated: repo.updated_at,
          topics: repo.topics || []
        };
      })
    );

    return reposWithDetails;
  } catch (error) {
    console.error('GitHub API 오류:', error);
    return [];
  }
};
