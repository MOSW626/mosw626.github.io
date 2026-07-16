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

  it('returns the original text unsplit when no highlight term appears in it', () => {
    expect(highlightSegments('hello world', ['xyz', 'abc'])).toEqual([
      { text: 'hello world', highlight: false },
    ]);
  });

  it('prefers the longest overlapping highlight regardless of input order (longest-first)', () => {
    // 'quick' is a substring of 'quick brown' — even listed first, the longer
    // term must win so the match isn't fragmented into 'quick' + ' brown'.
    const segs = highlightSegments('the quick brown fox jumps', ['quick', 'quick brown']);
    expect(segs).toEqual([
      { text: 'the ', highlight: false },
      { text: 'quick brown', highlight: true },
      { text: ' fox jumps', highlight: false },
    ]);
  });
});
