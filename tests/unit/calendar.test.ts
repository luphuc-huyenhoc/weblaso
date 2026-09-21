import { describe, it, expect } from 'vitest';
import { solarToLunar, lunarToSolar, getSurroundingSolarTerms } from '../../src/domain/calendar';
import calendarFixtures from '../fixtures/calendar-fixtures.json';

describe('Calendar Domain Engine', () => {
  it('correctly converts Solar to Lunar across multi-decade golden fixtures', () => {
    for (const fix of calendarFixtures) {
      const res = solarToLunar(fix.solar.year, fix.solar.month, fix.solar.day);
      expect(res.year).toBe(fix.expected.lunarYear);
      expect(res.month).toBe(fix.expected.lunarMonth);
      expect(res.day).toBe(fix.expected.lunarDay);
      expect(res.isLeap).toBe(fix.expected.isLeap);
      expect(res.canChiYear).toBe(fix.expected.canChiYear);
    }
  });

  it('correctly converts Lunar back to Solar (Two-Way Roundtrip)', () => {
    for (const fix of calendarFixtures) {
      const solar = lunarToSolar(
        fix.expected.lunarYear,
        fix.expected.lunarMonth,
        fix.expected.lunarDay,
        fix.expected.isLeap
      );
      expect(solar.year).toBe(fix.solar.year);
      expect(solar.month).toBe(fix.solar.month);
      expect(solar.day).toBe(fix.solar.day);
    }
  });

  it('determines 24 Solar Terms with accurate timestamps', () => {
    const terms = getSurroundingSolarTerms(1990, 8, 15, 10, 30);
    expect(terms.currentTerm).toBe('Lập thu');
    expect(terms.nextTerm).toBe('Xử thử');
    expect(terms.daysToNextTerm).toBeGreaterThan(0);
  });
});
