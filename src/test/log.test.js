import { describe, it, expect } from 'vitest';
import { parseFrontmatter, slugAndLang, buildLogIndex } from '../lib/log.js';

describe('parseFrontmatter', () => {
  it('splits frontmatter from body and parses tags as a list', () => {
    const raw = `---\ntitle: 첫 글\ndate: 2026-06-08\nsummary: 요약\ntags: 로봇, 회고\n---\n본문 첫 줄\n`;
    const { data, body } = parseFrontmatter(raw);
    expect(data.title).toBe('첫 글');
    expect(data.date).toBe('2026-06-08');
    expect(data.summary).toBe('요약');
    expect(data.tags).toEqual(['로봇', '회고']);
    expect(body).toBe('본문 첫 줄');
  });
  it('returns empty data and trimmed body when no frontmatter', () => {
    const { data, body } = parseFrontmatter('그냥 본문');
    expect(data).toEqual({});
    expect(body).toBe('그냥 본문');
  });
});

describe('slugAndLang', () => {
  it('extracts slug and language from a path', () => {
    expect(slugAndLang('../content/log/first-robot.ko.md')).toEqual({ slug: 'first-robot', lang: 'ko' });
    expect(slugAndLang('/x/y/hello.en.md')).toEqual({ slug: 'hello', lang: 'en' });
  });
  it('returns null for non-matching files', () => {
    expect(slugAndLang('../content/log/README.md')).toBeNull();
  });
});

describe('buildLogIndex', () => {
  const modules = {
    '../content/log/a.ko.md': `---\ntitle: 가\ndate: 2026-01-01\nsummary: 가요약\ntags: x\n---\n가 본문`,
    '../content/log/a.en.md': `---\ntitle: A\ndate: 2026-01-01\nsummary: A summary\n---\nA body`,
    '../content/log/b.ko.md': `---\ntitle: 나\ndate: 2026-05-05\nsummary: 나요약\n---\n나 본문`,
  };
  it('merges ko/en by slug and sorts by date desc', () => {
    const posts = buildLogIndex(modules);
    expect(posts.map((p) => p.slug)).toEqual(['b', 'a']);
  });
  it('exposes both language variants when present', () => {
    const a = buildLogIndex(modules).find((p) => p.slug === 'a');
    expect(a.ko.title).toBe('가');
    expect(a.en.title).toBe('A');
    expect(a.ko.body).toBe('가 본문');
  });
  it('uses ko frontmatter for shared date/tags, leaving en variant null when missing', () => {
    const b = buildLogIndex(modules).find((p) => p.slug === 'b');
    expect(b.date).toBe('2026-05-05');
    expect(b.tags).toEqual([]);
    expect(b.en).toBeNull();
  });
});
