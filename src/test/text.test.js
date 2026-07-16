import { describe, it, expect } from 'vitest';
import { highlightSegments } from '../lib/text.js';

describe('highlightSegments', () => {
  it('splits text into highlighted and non-highlighted segments', () => {
    const segs = highlightSegments('전국과학전람회 대통령상·국무총리상을 받았습니다.', ['대통령상·국무총리상']);
    expect(segs).toEqual([
      { text: '전국과학전람회 ', highlight: false },
      { text: '대통령상·국무총리상', highlight: true },
      { text: '을 받았습니다.', highlight: false },
    ]);
  });

  it('returns a single non-highlighted segment when there are no highlights', () => {
    expect(highlightSegments('hello world', [])).toEqual([{ text: 'hello world', highlight: false }]);
  });

  it('returns an empty array for empty text', () => {
    expect(highlightSegments('', ['x'])).toEqual([]);
  });

  it('handles regex special characters in highlight terms safely', () => {
    const segs = highlightSegments('cost is $5 (approx.)', ['$5 (approx.)']);
    expect(segs).toEqual([
      { text: 'cost is ', highlight: false },
      { text: '$5 (approx.)', highlight: true },
    ]);
  });
});
