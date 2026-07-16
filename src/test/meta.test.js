import { describe, it, expect } from 'vitest';
import { buildTitle, resolveDescription } from '../lib/meta.js';

describe('buildTitle', () => {
  it('appends site name', () => {
    expect(buildTitle('Works')).toBe('Works · YS AN');
  });
  it('returns bare site name when no page title', () => {
    expect(buildTitle()).toBe('YS AN — Robotics Archive');
  });
});

describe('resolveDescription', () => {
  it('returns the given description when present', () => {
    expect(resolveDescription('페이지 설명')).toBe('페이지 설명');
  });
  it('falls back to the site default when empty/undefined', () => {
    const fallback = resolveDescription();
    expect(fallback).toBe(
      'ROS 기반 로봇 개발자 안연수의 포트폴리오. 전국과학전람회 대통령상, 긱블 출연, YSC 선정.'
    );
    expect(resolveDescription('')).toBe(fallback);
  });
});
