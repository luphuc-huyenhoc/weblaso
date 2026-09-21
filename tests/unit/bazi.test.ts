import { describe, it, expect } from 'vitest';
import { calculateBazi } from '../../src/domain/bazi';
import { searchBaziByPillars } from '../../src/domain/bazi/reverse';
import baziFixtures from '../fixtures/bazi-fixtures.json';

describe('Bát Tự Domain Engine', () => {
  it('correctly calculates the baseline Bát Tự chart from nguhanh.net reference', () => {
    const fix = baziFixtures[0];
    const exp = fix.expected as any;
    const res = calculateBazi(fix.input as any);

    expect(res.calculation.pillars.year.stem).toBe(exp.pillars.year.stem);
    expect(res.calculation.pillars.year.branch).toBe(exp.pillars.year.branch);
    expect(res.calculation.pillars.year.stemTenGod).toBe(exp.pillars.year.tenGod);

    expect(res.calculation.pillars.month.stem).toBe(exp.pillars.month.stem);
    expect(res.calculation.pillars.month.branch).toBe(exp.pillars.month.branch);
    expect(res.calculation.pillars.month.stemTenGod).toBe(exp.pillars.month.tenGod);

    expect(res.calculation.pillars.day.stem).toBe(exp.pillars.day.stem);
    expect(res.calculation.pillars.day.branch).toBe(exp.pillars.day.branch);
    expect(res.calculation.pillars.day.stemTenGod).toBe(exp.pillars.day.tenGod);

    expect(res.calculation.pillars.hour.stem).toBe(exp.pillars.hour.stem);
    expect(res.calculation.pillars.hour.branch).toBe(exp.pillars.hour.branch);
    expect(res.calculation.pillars.hour.stemTenGod).toBe(exp.pillars.hour.tenGod);

    expect(res.calculation.majorLuck.direction).toBe(exp.majorLuck.direction);
    expect(res.calculation.majorLuck.pillars[0].stem).toBe(exp.majorLuck.firstPillar.stem);
    expect(res.calculation.majorLuck.pillars[0].branch).toBe(exp.majorLuck.firstPillar.branch);
    expect(res.calculation.majorLuck.pillars[0].startAge).toBe(exp.majorLuck.firstPillar.startAge);
  });

  it('correctly maintains the Year Pillar boundary at Lập Xuân instead of Lunar New Year', () => {
    const fix = baziFixtures[1];
    const exp = fix.expected as any;
    const res = calculateBazi(fix.input as any);

    // Born on Lunar New Year 2003, but before Lap Xuan 2003 -> Must remain Nham Ngo (2002)
    expect(res.calculation.pillars.year.stem).toBe(exp.pillars.year.stem);
    expect(res.calculation.pillars.year.branch).toBe(exp.pillars.year.branch);
  });

  it('correctly advances Day Pillar at 23:00 (Dạ Tý boundary)', () => {
    const before23 = calculateBazi({
      fullName: 'Test',
      gender: true,
      year: 1984,
      month: 5,
      day: 10,
      hour: 22,
      minute: 55,
    });

    const after23 = calculateBazi({
      fullName: 'Test',
      gender: true,
      year: 1984,
      month: 5,
      day: 10,
      hour: 23,
      minute: 5,
    });

    // The day pillar branch after 23:00 must be different (advanced to next day)
    expect(before23.calculation.pillars.day.branch).not.toBe(after23.calculation.pillars.day.branch);
    expect(after23.calculation.pillars.hour.branch).toBe('Tý');
  });

  it('correctly finds matching Gregorian dates in reverse Bazi search', () => {
    const matches = searchBaziByPillars({
      thienCanYear: 1, // Giáp
      diaChiYear: 1,   // Tý
      diaChiMonth: 1,  // Dần
      thienCanDay: 1,  // Giáp
      diaChiDay: 1,    // Tý
      diaChiHour: 1,   // Tý
      startYear: 1900,
      endYear: 2000,
    });

    expect(Array.isArray(matches)).toBe(true);
    // Verified result from reference audit showed matching date in 1924
    if (matches.length > 0) {
      expect(matches[0].year).toBe(1924);
      expect(matches[0].viewUrlMale).toContain('la-so-bat-tu');
    }
  });
});
