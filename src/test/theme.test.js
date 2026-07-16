import { describe, it, expect } from 'vitest';
import { resolveTheme } from '../lib/theme.js';

describe('resolveTheme', () => {
  it('honors stored value', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
  });
  it('falls back to OS preference when nothing stored', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });
  it('ignores garbage stored values', () => {
    expect(resolveTheme('banana', true)).toBe('dark');
  });
});
