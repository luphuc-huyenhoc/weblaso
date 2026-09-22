import { describe, it, expect } from 'vitest';
import {
  calculateAlmanacDay,
  searchGoodDaysForPurpose,
  TRUC_NAMES,
  HOANG_DAO_DEITIES,
} from '@/domain/almanac';

describe('Almanac Calculation Engine', () => {
  it('calculates full almanac for a specific date (2026-09-21)', () => {
    const res = calculateAlmanacDay(2026, 9, 21);

    expect(res.day).toBe(21);
    expect(res.month).toBe(9);
    expect(res.year).toBe(2026);
    expect(res.canChiDay).toBeDefined();
    expect(res.canChiMonth).toBeDefined();
    expect(res.canChiYear).toBeDefined();
    expect(TRUC_NAMES).toContain(res.truc as any);
    expect(['Hoàng Đạo', 'Hắc Đạo']).toContain(res.hoangDaoType);
    expect(res.zodiacHours).toHaveLength(12);

    // Check zodiac hours count (6 Hoàng Đạo hours each day)
    const goodHours = res.zodiacHours.filter((h) => h.isZodiac);
    expect(goodHours).toHaveLength(6);

    // Check directions
    expect(res.departureDirections.hyThan).toBeDefined();
    expect(res.departureDirections.taiThan).toBeDefined();
  });

  it('detects Tam Nương taboo days correctly (3, 7, 13, 18, 22, 27 lunar)', () => {
    // Check multiple days across month
    let foundTamNuong = false;
    for (let d = 1; d <= 30; d++) {
      const res = calculateAlmanacDay(2026, 9, d);
      if ([3, 7, 13, 18, 22, 27].includes(res.lunarDay)) {
        expect(res.specialDays.some((s) => s.includes('Tam Nương'))).toBe(true);
        foundTamNuong = true;
      }
    }
    expect(foundTamNuong).toBe(true);
  });

  it('searches good days for specific purpose (Cưới hỏi)', () => {
    const results = searchGoodDaysForPurpose(
      { year: 2026, month: 9, day: 1 },
      { year: 2026, month: 9, day: 30 },
      'Cưới hỏi'
    );

    expect(Array.isArray(results)).toBe(true);
    for (const item of results) {
      // Good wedding days must not be in special taboo days
      expect(item.specialDays).toHaveLength(0);
      expect(item.matchedReasons.length).toBeGreaterThan(0);
      expect(['Định', 'Thành', 'Kiến']).toContain(item.truc);
    }
  });

  it('searches good days for Khai trương', () => {
    const results = searchGoodDaysForPurpose(
      { year: 2026, month: 10, day: 1 },
      { year: 2026, month: 10, day: 31 },
      'Khai trương'
    );

    expect(Array.isArray(results)).toBe(true);
    for (const item of results) {
      expect(item.specialDays).toHaveLength(0);
      expect(['Khai', 'Thành', 'Mãn', 'Định']).toContain(item.truc);
    }
  });
});
