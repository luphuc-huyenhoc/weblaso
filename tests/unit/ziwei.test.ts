import { describe, it, expect } from 'vitest';
import { calculateZiWei, calculateSaoHan } from '../../src/domain/ziweidoushu';

describe('Tử Vi & Sao Hạn Domain Engine', () => {
  it('correctly constructs 12 palaces and places main stars', () => {
    const res = calculateZiWei({
      fullName: 'Nguyễn Văn A',
      gender: true,
      day: 15,
      month: 8,
      year: 1990,
      hour: 10,
      minute: 30,
    });

    expect(res.calculation.palaces.length).toBe(12);
    expect(res.calculation.personal.fullName).toBe('NGUYỄN VĂN A');
    expect(res.calculation.personal.cuc).toContain('Cục');

    const menh = res.calculation.palaces.find(p => p.isMenh);
    expect(menh).toBeDefined();

    const allMainStars = res.calculation.palaces.flatMap(p => p.mainStars);
    expect(allMainStars.length).toBeGreaterThanOrEqual(14);
    expect(allMainStars.some(s => s.name.includes('Tử Vi'))).toBe(true);
    expect(allMainStars.some(s => s.name.includes('Thiên Phủ'))).toBe(true);
  });

  it('correctly calculates Sao Hạn for given birth year, gender, and target year', () => {
    // 1990 Male in 2026: age = 2026 - 1990 + 1 = 37t
    const res = calculateSaoHan(1990, true, 2026);
    expect(res.lunarAge).toBe(37);
    expect(res.cuuDieu.star).toBeDefined();
    expect(res.nienHan.name).toBeDefined();
    expect(typeof res.tamTai.isTamTai).toBe('boolean');
    expect(typeof res.kimLau.isKimLau).toBe('boolean');
    expect(res.hoangOc.palace).toBeDefined();
  });
});
