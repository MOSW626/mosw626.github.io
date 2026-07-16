/** 정규식 특수문자를 이스케이프한다. */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * text를 highlights 목록 기준으로 세그먼트 배열로 나눈다.
 * 각 세그먼트: { text, highlight: boolean }.
 * highlights가 비어있거나 매치가 없으면 전체가 highlight:false인 단일 세그먼트.
 * (dangerouslySetInnerHTML 없이 <strong> 강조를 렌더하기 위한 순수 함수)
 */
export function highlightSegments(text, highlights = []) {
  if (!text) return [];
  const terms = (highlights || []).filter(Boolean);
  if (terms.length === 0) return [{ text, highlight: false }];

  const pattern = terms
    .slice()
    .sort((a, b) => b.length - a.length) // 긴 것부터 매치해 부분 중첩 방지
    .map(escapeRegExp)
    .join('|');
  const re = new RegExp(`(${pattern})`, 'g');
  const highlightSet = new Set(terms);

  return text
    .split(re)
    .filter((part) => part !== '')
    .map((part) => ({ text: part, highlight: highlightSet.has(part) }));
}
