import { describe, it, expect } from 'vitest';
import { flattenWorks, featuredWorks, worksInGroup, periodStartKey, sortByPeriodDesc } from '../lib/works.js';

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
