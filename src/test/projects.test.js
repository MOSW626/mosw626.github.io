import { describe, it, expect } from 'vitest';
import { projectLinks } from '../lib/projects.js';

describe('projectLinks', () => {
  it('omits links with empty urls', () => {
    const links = projectLinks({ link: '', github: 'https://gh/x', youtube: '' });
    expect(links).toEqual([{ kind: 'github', url: 'https://gh/x' }]);
  });
  it('includes notion, github, youtube when present in order', () => {
    const links = projectLinks({ link: 'https://n', github: 'https://g', youtube: 'https://y' });
    expect(links.map((l) => l.kind)).toEqual(['notion', 'github', 'youtube']);
  });
  it('returns empty array when no links', () => {
    expect(projectLinks({})).toEqual([]);
  });
});
