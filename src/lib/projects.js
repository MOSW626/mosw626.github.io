/**
 * 프로젝트 객체에서 비어있지 않은 링크만 순서대로 추출.
 * demo(라이브) → link(notion) → github → youtube
 */
export function projectLinks(project) {
  const out = [];
  if (project.demo) out.push({ kind: 'demo', url: project.demo });
  if (project.link) out.push({ kind: 'notion', url: project.link });
  for (const url of [].concat(project.github || [])) out.push({ kind: 'github', url });
  if (project.youtube) out.push({ kind: 'youtube', url: project.youtube });
  return out;
}
