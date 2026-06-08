import { buildLogIndex } from './log.js';

// 빌드 시점에 모든 글 원문을 문자열로 로드
const modules = import.meta.glob('../content/log/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const LOG_POSTS = buildLogIndex(modules);

export function getPost(slug) {
  return LOG_POSTS.find((p) => p.slug === slug) || null;
}
