import { describe, it, expect } from 'vitest';
import { pick } from '../i18n.js';

describe('pick', () => {
  it('returns the base value in ko', () => {
    expect(pick({ name: '안연수', nameEn: 'Yeonsu' }, 'name', 'ko')).toBe('안연수');
  });
  it('returns the En field in en when present', () => {
    expect(pick({ name: '안연수', nameEn: 'Yeonsu' }, 'name', 'en')).toBe('Yeonsu');
  });
  it('falls back to base value in en when En field missing', () => {
    expect(pick({ title: '학생' }, 'title', 'en')).toBe('학생');
  });
});
