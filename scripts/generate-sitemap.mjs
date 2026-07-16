// 빌드 시 public/sitemap.xml을 생성한다. node 내장 fs만 사용 (신규 런타임 의존성 금지).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://mosw626.github.io';

function workSlugs() {
  const projectsPath = path.join(ROOT, 'src/data/projects.json');
  const data = JSON.parse(readFileSync(projectsPath, 'utf-8'));
  const slugs = [];
  for (const group of Object.values(data)) {
    if (!Array.isArray(group)) continue;
    for (const item of group) {
      if (item && item.slug) slugs.push(item.slug);
    }
  }
  return slugs;
}

function noteSlugs() {
  const logDir = path.join(ROOT, 'src/content/log');
  const files = readdirSync(logDir);
  const slugs = [];
  for (const file of files) {
    const m = /^(.+)\.ko\.md$/.exec(file);
    if (m) slugs.push(m[1]);
  }
  return slugs;
}

function buildSitemap() {
  const staticPaths = ['/', '/works', '/notes', '/cv'];
  const workPaths = workSlugs().map((slug) => `/works/${slug}`);
  const notePaths = noteSlugs().map((slug) => `/notes/${slug}`);
  const urls = [...staticPaths, ...workPaths, ...notePaths];

  const body = urls
    .map((u) => `  <url>\n    <loc>${ORIGIN}${u}</loc>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

const xml = buildSitemap();
writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml, 'utf-8');
console.log(`sitemap.xml written with ${xml.split('<url>').length - 1} URLs`);
