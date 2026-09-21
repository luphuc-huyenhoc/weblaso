import { describe, it, expect } from 'vitest';
import { calculateIching, rollThreeCoins, castPhoneHexagram } from '../../src/domain/iching';

describe('Quẻ Dịch & Lục Hào Domain Engine', () => {
  it('correctly calculates manual Lục Hào hexagram', () => {
    // 6 Dương lines = Thuần Càn
    const lines = Array.from({ length: 6 }, (_, i) => ({
      lineIndex: i,
      polarity: 'Dương' as const,
      movement: 'Tĩnh' as const,
    }));

    const res = calculateIching({
      title: 'Hỏi công danh',
      method: 'Lục Hào',
      lines,
      day: 15,
      month: 8,
      year: 1990,
      hour: 10,
      minute: 30,
    });

    expect(res.calculation.originalHexagram.name).toBe('Thuần Càn');
    expect(res.calculation.originalHexagram.palace).toBe('Họ Càn');
    expect(res.calculation.originalHexagram.lines.length).toBe(6);
    expect(res.calculation.originalHexagram.lines[0].lucThu).toBeDefined();
    expect(res.calculation.originalHexagram.lines[0].lucThan).toBeDefined();
  });

  it('correctly generates transformed hexagram when moving lines exist', () => {
    const lines = [
      { lineIndex: 0, polarity: 'Dương' as const, movement: 'Động' as const },
      { lineIndex: 1, polarity: 'Dương' as const, movement: 'Tĩnh' as const },
      { lineIndex: 2, polarity: 'Dương' as const, movement: 'Tĩnh' as const },
      { lineIndex: 3, polarity: 'Dương' as const, movement: 'Tĩnh' as const },
      { lineIndex: 4, polarity: 'Dương' as const, movement: 'Tĩnh' as const },
      { lineIndex: 5, polarity: 'Dương' as const, movement: 'Tĩnh' as const },
    ];

    const res = calculateIching({
      title: 'Hỏi việc đầu tư',
      method: 'Lục Hào',
      lines,
      day: 21,
      month: 9,
      year: 2026,
      hour: 10,
      minute: 0,
    });

    expect(res.calculation.originalHexagram.name).toBe('Thuần Càn');
    expect(res.calculation.changedHexagram).toBeDefined();
    // Line 0 changed from Yang to Yin -> Càn trên Đoài dưới = Thiên Trạch Lý
    expect(res.calculation.changedHexagram?.name).toBe('Thiên Trạch Lý');
  });

  it('correctly rolls 3 coins with valid states', () => {
    for (let i = 0; i < 50; i++) {
      const rolled = rollThreeCoins();
      expect(['Âm', 'Dương']).toContain(rolled.polarity);
      expect(['Tĩnh', 'Động']).toContain(rolled.movement);
    }
  });

  it('correctly reduces phone number to 6 lines via Mai Hoa Dịch Số', () => {
    const lines = castPhoneHexagram('0916889131');
    expect(lines.length).toBe(6);
    expect(lines.some(l => l.movement === 'Động')).toBe(true);
  });
});
