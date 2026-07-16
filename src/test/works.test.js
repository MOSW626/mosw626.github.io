import { describe, it, expect } from 'vitest';
import { flattenWorks, featuredWorks, worksInGroup, periodStartKey, sortByPeriodDesc } from '../lib/works.js';
import { findWorkBySlug, detailWorks, adjacentWorks } from '../lib/works.js';

const fixture = {
  robotDevelopment: [
    { title: 'A', period: '2022.03.02 - 2022.09.15', featured: true },
    { title: 'B', period: '2023.06.15 - 2023.06.25' },
  ],
  videoProduction: [
    { title: 'C', period: '2023.12.18 - 2023.12', featured: true },
  ],
};

describe('flattenWorks', () => {
  it('combines groups and tags each item with a group key', () => {
    const all = flattenWorks(fixture);
    expect(all.map((w) => [w.title, w.group])).toEqual([
      ['A', 'robot'], ['B', 'robot'], ['C', 'video'],
    ]);
  });
});

describe('featuredWorks', () => {
  it('returns only items flagged featured', () => {
    expect(featuredWorks(fixture).map((w) => w.title)).toEqual(['A', 'C']);
  });
});

describe('worksInGroup', () => {
  it('returns all when group is "all"', () => {
    expect(worksInGroup(flattenWorks(fixture), 'all')).toHaveLength(3);
  });
  it('filters by group key', () => {
    expect(worksInGroup(flattenWorks(fixture), 'video').map((w) => w.title)).toEqual(['C']);
  });
});

describe('periodStartKey', () => {
  it('builds a sortable key from the start date', () => {
    expect(periodStartKey('2022.03.02 - 2022.09.15')).toBe('20220302');
    expect(periodStartKey('2023.12.14')).toBe('20231214');
  });
});

describe('sortByPeriodDesc', () => {
  it('orders newest start date first without mutating input', () => {
    const input = flattenWorks(fixture);
    const sorted = sortByPeriodDesc(input);
    expect(sorted.map((w) => w.title)).toEqual(['C', 'B', 'A']);
    expect(input.map((w) => w.title)).toEqual(['A', 'B', 'C']);
  });
});

const FIX = {
  robotDevelopment: [
    { title: 'A', slug: 'a', period: '2022.01' },
    { title: 'B', period: '2021.01' },
    { title: 'C', slug: 'c', period: '2020.01' },
  ],
  videoProduction: [], softwareProjects: [],
};

describe('work detail helpers', () => {
  it('findWorkBySlug returns the matching work with group attached', () => {
    expect(findWorkBySlug('a', FIX).title).toBe('A');
    expect(findWorkBySlug('a', FIX).group).toBe('robot');
  });
  it('findWorkBySlug returns null for unknown slug', () => {
    expect(findWorkBySlug('nope', FIX)).toBeNull();
  });
  it('detailWorks returns only slugged works in flatten order', () => {
    expect(detailWorks(FIX).map((w) => w.slug)).toEqual(['a', 'c']);
  });
  it('adjacentWorks returns prev/next with nulls at edges', () => {
    expect(adjacentWorks('a', FIX).prev).toBeNull();
    expect(adjacentWorks('a', FIX).next.slug).toBe('c');
    expect(adjacentWorks('c', FIX).prev.slug).toBe('a');
    expect(adjacentWorks('c', FIX).next).toBeNull();
  });
  it('every real robotDevelopment entry has a unique slug', () => {
    const slugs = flattenWorks().filter((w) => w.group === 'robot').map((w) => w.slug);
    expect(slugs.every(Boolean)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
