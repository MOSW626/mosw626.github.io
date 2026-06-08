import data from '../data/projects.json';

/** projects.json 그룹 키 → 짧은 그룹 식별자 (표시 순서대로, 최근 활동 우선) */
export const WORK_GROUPS = [
  { key: 'softwareProjects', group: 'project' },
  { key: 'robotDevelopment', group: 'robot' },
  { key: 'videoProduction', group: 'video' },
];

/** 그룹 배열들을 하나로 합치고 각 항목에 group 식별자를 붙인다. */
export function flattenWorks(d = data) {
  const out = [];
  for (const { key, group } of WORK_GROUPS) {
    for (const item of d[key] || []) out.push({ ...item, group });
  }
  return out;
}

/** featured === true 인 작업물만 (전 그룹 합산) */
export function featuredWorks(d = data) {
  return flattenWorks(d).filter((w) => w.featured === true);
}

/** group이 'all'이면 전체, 아니면 해당 group만 */
export function worksInGroup(works, group) {
  if (group === 'all') return works;
  return works.filter((w) => w.group === group);
}

/** "2022.03.02 - 2022.09.15" → "20220302" (정렬용 키) */
export function periodStartKey(period) {
  const start = (period || '').split('-')[0].trim();
  const [y = '0000', m = '00', d = '00'] = start.split('.');
  return `${y.padStart(4, '0')}${m.padStart(2, '0')}${d.padStart(2, '0')}`;
}

/** 시작일 역순 정렬 (입력 불변) */
export function sortByPeriodDesc(works) {
  return [...works].sort((a, b) => periodStartKey(b.period).localeCompare(periodStartKey(a.period)));
}
