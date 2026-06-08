/** "---\n...\n---\n본문" 형식을 { data, body }로 파싱 (의존성 없음). */
export function parseFrontmatter(raw) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!m) return { data: {}, body: raw.trim() };
  const data = {};
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key === 'tags') {
      data.tags = val ? val.split(',').map((s) => s.trim()).filter(Boolean) : [];
    } else {
      data[key] = val;
    }
  }
  return { data, body: m[2].trim() };
}

/** 경로에서 slug와 언어를 추출. "<slug>.<ko|en>.md"만 매칭. */
export function slugAndLang(path) {
  const file = path.split('/').pop();
  const m = /^(.+)\.(ko|en)\.md$/.exec(file);
  if (!m) return null;
  return { slug: m[1], lang: m[2] };
}

/**
 * { [path]: rawString } 맵을 받아 글 인덱스를 만든다.
 * slug별로 ko/en을 묶고, 공유 메타(date/tags)는 ko 우선, 없으면 en.
 * 날짜 역순 정렬.
 */
export function buildLogIndex(modules) {
  const bySlug = {};
  for (const [path, raw] of Object.entries(modules)) {
    const sl = slugAndLang(path);
    if (!sl) continue;
    const { slug, lang } = sl;
    const { data, body } = parseFrontmatter(raw);
    bySlug[slug] = bySlug[slug] || { slug, ko: null, en: null, _meta: {} };
    bySlug[slug][lang] = {
      title: data.title || '',
      summary: data.summary || '',
      thumbnail: data.thumbnail || '',
      body,
    };
    bySlug[slug]._meta[lang] = { date: data.date || '', tags: data.tags || [] };
  }
  const posts = Object.values(bySlug).map((p) => {
    const meta = p._meta.ko || p._meta.en || { date: '', tags: [] };
    return { slug: p.slug, date: meta.date, tags: meta.tags, ko: p.ko, en: p.en };
  });
  return posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
