/**
 * 프로젝트 객체에서 비어있지 않은 링크만 순서대로 추출.
 * link(notion) → github → youtube
 */
export function projectLinks(project) {
  const out = [];
  if (project.link) out.push({ kind: 'notion', url: project.link });
  if (project.github) out.push({ kind: 'github', url: project.github });
  if (project.youtube) out.push({ kind: 'youtube', url: project.youtube });
  return out;
}
