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
    expect(res.calculation.originalHexagram.thoanCa).toBe('KHỐN LONG ĐẮC THỦY');
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
    // Line 0 (Hào sơ) changed from Yang to Yin -> Càn trên Tốn dưới = Thiên Phong Cấu
    expect(res.calculation.changedHexagram?.name).toBe('Thiên Phong Cấu');
  });

  it('correctly calculates Phong Sơn Tiệm (Họ Cấn, Quy Hồn, Thế 3, Ứng 6, Phục Thần)', () => {
    // Phong Sơn Tiệm: Lower = Cấn (line 0=Âm, line 1=Âm, line 2=Dương)
    // Upper = Tốn (line 3=Âm, line 4=Dương, line 5=Dương)
    const lines = [
      { lineIndex: 0, polarity: 'Âm' as const, movement: 'Tĩnh' as const },
      { lineIndex: 1, polarity: 'Âm' as const, movement: 'Tĩnh' as const },
      { lineIndex: 2, polarity: 'Dương' as const, movement: 'Tĩnh' as const },
      { lineIndex: 3, polarity: 'Âm' as const, movement: 'Tĩnh' as const },
      { lineIndex: 4, polarity: 'Dương' as const, movement: 'Tĩnh' as const },
      { lineIndex: 5, polarity: 'Dương' as const, movement: 'Tĩnh' as const },
    ];

    const res = calculateIching({
      title: 'Xem tài lộc tháng tới',
      method: 'Lục Hào',
      lines,
      day: 21,
      month: 9,
      year: 2026,
      hour: 12,
      minute: 46,
    });

    const orig = res.calculation.originalHexagram;
    expect(orig.name).toBe('Phong Sơn Tiệm');
    expect(orig.palace).toBe('Họ Cấn');
    expect(orig.nature).toBe('Quy Hồn');
    expect(orig.thoanCa).toBe('TUẤN MÃ XUẤT LUNG');
    // Line 3 (index 2) is Thế
    expect(orig.lines[2].isThe).toBe(true);
    // Line 6 (index 5) is Ứng
    expect(orig.lines[5].isUng).toBe(true);
    // Line 5 (index 4) has Phục Thần Tài-Tý
    expect(orig.lines[4].phucThan).toBe('Tài-Tý');
  });

  it('correctly generates Quẻ Ngẫu Nhiên', () => {
    const res = calculateIching({
      title: 'Chiêm việc sắp tới',
      method: 'Ngẫu Nhiên',
      day: 21,
      month: 9,
      year: 2026,
      hour: 12,
      minute: 46,
    });

    expect(res.calculation.originalHexagram.lines.length).toBe(6);
    expect(res.calculation.originalHexagram.name).toBeDefined();
    expect(res.calculation.originalHexagram.palace).toBeDefined();
    expect(res.calculation.nhatThan).toBeDefined();
    expect(res.calculation.nguyetLenh).toBeDefined();
    expect(res.calculation.tuanKhong.length).toBe(2);
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
    expect(lines.some((l) => l.movement === 'Động')).toBe(true);
  });
});
