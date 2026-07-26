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
  it('expands an array of github urls into one link each', () => {
    const links = projectLinks({ github: ['https://g1', 'https://g2'] });
    expect(links).toEqual([
      { kind: 'github', url: 'https://g1' },
      { kind: 'github', url: 'https://g2' },
    ]);
  });
  it('returns empty array when no links', () => {
    expect(projectLinks({})).toEqual([]);
  });
  it('puts a live demo link first when present', () => {
    const links = projectLinks({ demo: 'https://d', link: 'https://n', github: 'https://g' });
    expect(links.map((l) => l.kind)).toEqual(['demo', 'notion', 'github']);
  });
});
