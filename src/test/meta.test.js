import { describe, it, expect } from 'vitest';
import { buildTitle } from '../lib/meta.js';

describe('buildTitle', () => {
  it('appends site name', () => {
    expect(buildTitle('Works')).toBe('Works · YS AN');
  });
  it('returns bare site name when no page title', () => {
    expect(buildTitle()).toBe('YS AN — Robotics Archive');
  });
});
