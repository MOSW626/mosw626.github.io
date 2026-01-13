// GitHub API를 사용하여 프로젝트 정보 가져오기
export const fetchGitHubRepos = async (username = 'MOSW626') => {
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

    // README 내용도 가져오기 (rate limit을 피하기 위해 선택적으로)
    const reposWithDetails = await Promise.all(
      repos.slice(0, 10).map(async (repo, index) => {
        // rate limit을 피하기 위해 일부만 README 가져오기
        let readme = null;
        if (index < 5) {
          try {
            const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
              headers: {
                'Accept': 'application/vnd.github.v3+json'
              }
            });
            if (readmeResponse.ok) {
              const readmeData = await readmeResponse.json();
              // Base64 디코딩
              const decoded = atob(readmeData.content.replace(/\s/g, ''));
              // Markdown 제거 및 텍스트만 추출
              const textOnly = decoded
                .replace(/#{1,6}\s+/g, '') // 헤더 제거
                .replace(/\*\*([^*]+)\*\*/g, '$1') // 볼드 제거
                .replace(/\*([^*]+)\*/g, '$1') // 이탤릭 제거
                .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 링크 제거
                .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
                .replace(/`([^`]+)`/g, '$1') // 인라인 코드 제거
                .replace(/\n{3,}/g, '\n\n') // 여러 줄바꿈 정리
                .trim();
              readme = textOnly.substring(0, 200); // 처음 200자만
            }
          } catch (e) {
            // README가 없으면 무시
            console.log(`README를 가져올 수 없습니다: ${repo.name}`);
          }
        }

        // 설명 정리: description이 없거나 너무 짧으면 README 사용
        let finalDescription = repo.description;
        if (!finalDescription || finalDescription.length < 10) {
          finalDescription = readme;
        }
        if (!finalDescription || finalDescription.length < 10) {
          finalDescription = '설명이 없습니다.';
        }

        return {
          id: repo.id,
          title: repo.name,
          description: finalDescription,
          github: repo.html_url,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updated: repo.updated_at,
          topics: repo.topics || [],
          readme: readme
        };
      })
    );

    return reposWithDetails;
  } catch (error) {
    console.error('GitHub API 오류:', error);
    return [];
  }
};
