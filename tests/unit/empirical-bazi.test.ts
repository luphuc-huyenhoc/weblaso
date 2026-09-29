import { describe, it, expect } from 'vitest';
import {
  calculateBazi,
  calculateLuckCycles,
  calculateAnnualPillars,
  calculateTieuVanPillars,
  calculateMonthlyPillars,
  getTenGod,
  getChangSheng,
  calculateTargetBranchShenSha,
  CAN,
  CHI
} from '@/domain/bazi/empiricalEngine';

describe('Empirical Bazi Engine (Bát Tự Thực Nghiệm - Thế Sơn)', () => {
  it('correctly calculates 4 pillars for 2003-12-01 13:00 matching user screenshot', () => {
    const res = calculateBazi(2003, 12, 1, 13, 0, 7, 'female');

    expect(res.pillars.year.stem).toBe('Quý');
    expect(res.pillars.year.branch).toBe('Mùi');
    expect(res.pillars.year.tenGod).toBe('Tài');

    expect(res.pillars.month.stem).toBe('Quý');
    expect(res.pillars.month.branch).toBe('Hợi');
    expect(res.pillars.month.tenGod).toBe('Tài');

    expect(res.pillars.day.stem).toBe('Mậu');
    expect(res.pillars.day.branch).toBe('Thân');
    expect(res.pillars.day.tenGod).toBe('NHẬT CHỦ');

    expect(res.pillars.hour.stem).toBe('Kỷ');
    expect(res.pillars.hour.branch).toBe('Mùi');
    expect(res.pillars.hour.tenGod).toBe('Kiếp');
  });

  it('correctly calculates Ten Gods relative to Day Master', () => {
    const dm = 'Mậu'; // Thổ Dương
    expect(getTenGod(dm, 'Mậu')).toBe('Tỷ');
    expect(getTenGod(dm, 'Kỷ')).toBe('Kiếp');
    expect(getTenGod(dm, 'Canh')).toBe('Thực');
    expect(getTenGod(dm, 'Tân')).toBe('Thương');
    expect(getTenGod(dm, 'Nhâm')).toBe('T.Tài');
    expect(getTenGod(dm, 'Quý')).toBe('Tài');
    expect(getTenGod(dm, 'Giáp')).toBe('Sát');
    expect(getTenGod(dm, 'Ất')).toBe('Quan');
    expect(getTenGod(dm, 'Bính')).toBe('Kiêu');
    expect(getTenGod(dm, 'Đinh')).toBe('Ấn');
  });

  it('correctly calculates 12 Chang Sheng stages', () => {
    // Giáp Hợi là Trường Sinh, Tý là Mộc Dục, Sửu là Quan Đới, Dần là Lâm Quan, Mão là Đế Vượng
    expect(getChangSheng('Giáp', 'Hợi')).toBe('Trường Sinh');
    expect(getChangSheng('Giáp', 'Dần')).toBe('Lâm Quan');
    expect(getChangSheng('Giáp', 'Mão')).toBe('Đế Vượng');
  });

  it('correctly calculates Major Luck Cycles and initiation info', () => {
    const birthDate = new Date(Date.UTC(2003, 11, 1, 6, 0)); // 13:00 UTC+7 is 06:00 UTC
    const { cycles, initiationInfo } = calculateLuckCycles(
      'Quý',
      'Quý',
      'Hợi',
      'female',
      birthDate,
      'Mậu',
      7
    );

    expect(cycles.length).toBeGreaterThan(0);
    expect(initiationInfo).toContain('tuổi');
  });

  it('calculates Minor Luck based on Hour pillar direction rule', () => {
    const annuals = calculateAnnualPillars(2003, 'Mậu', 10, 2026);
    // Quý Mùi là Âm Nữ -> direction = +1 (thuận)
    const tieuVans = calculateTieuVanPillars('Kỷ', 'Mùi', 'Quý', 'female', 2003, annuals);

    expect(tieuVans.length).toBe(10);
    expect(CAN).toContain(tieuVans[0].stem);
    expect(CHI).toContain(tieuVans[0].branch);
  });

  it('calculates 12 monthly luck pillars', () => {
    const months = calculateMonthlyPillars(2026, 7);
    expect(months.length).toBe(12);
    expect(months[0].branch).toBe('Dần');
    expect(months[11].branch).toBe('Sửu');
  });
});
