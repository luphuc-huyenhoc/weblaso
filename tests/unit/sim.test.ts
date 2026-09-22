import { describe, it, expect } from 'vitest';
import { calculateSimFortune, calculateSimHexagram, calculateSimElement, detectNiceSimPatterns } from '@/domain/sim/index';

describe('Sim Phong Thủy Domain Engine', () => {
  const testPhone = '0826226888';
  const testInput = {
    phoneNumber: testPhone,
    fullName: 'NGUYỄN VĂN A',
    gender: true, // Nam
    day: 1,
    month: 11,
    year: 1992,
    hour: 17,
    minute: 0,
    calendarType: 'solar' as const,
  };

  it('calculates Mai Hoa hexagram accurately for 0826226888', () => {
    const hex = calculateSimHexagram(testPhone);
    expect(hex.sumFirst).toBe(18); // 0+8+2+6+2
    expect(hex.sumSecond).toBe(32); // 2+6+8+8+8
    expect(hex.totalSum).toBe(50);
    expect(hex.upperNum).toBe(2); // 18 % 8 = 2 (Đoài / Trạch)
    expect(hex.lowerNum).toBe(8); // 32 % 8 = 0 -> 8 (Khôn / Địa)
    expect(hex.movingLine).toBe(2); // 50 % 6 = 2
    expect(hex.originalBinary).toBe('011000'); // Trạch Địa Tụy
  });

  it('calculates Sim Element via Lạc Thư Cửu Tinh', () => {
    const elem = calculateSimElement(testPhone);
    // 50 -> 5 + 0 = 5 -> Trung Cung (Thổ)
    expect(elem).toBe('Thổ');
  });

  it('detects nice sim patterns (Tam Hoa, Đuôi Lớn)', () => {
    const patterns = detectNiceSimPatterns(testPhone);
    expect(patterns.patterns).toContain('Sim Tam Hoa');
    expect(patterns.patterns).toContain('Sim Đuôi Số Lớn');
  });

  it('performs full Sim Fortune calculation matching reference', () => {
    const result = calculateSimFortune(testInput);

    expect(result.overview.originalHexagramName).toBe('Trạch Địa Tụy');
    expect(result.overview.movingLine).toBe(2);
    expect(result.overview.simElement).toBe('Thổ');
    expect(result.overview.totalScore).toBe(8);
    expect(result.overview.scoreRating).toBe('Cát');

    // Bát tự thân chủ
    expect(result.baziDetail.pillars.year.stem).toBe('Nhâm');
    expect(result.baziDetail.pillars.year.branch).toBe('Thân');
    expect(result.baziDetail.pillars.month.stem).toBe('Canh');
    expect(result.baziDetail.pillars.month.branch).toBe('Tuất');
    expect(result.baziDetail.pillars.day.stem).toBe('Tân');
    expect(result.baziDetail.pillars.day.branch).toBe('Tỵ');
    expect(result.baziDetail.pillars.hour.stem).toBe('Đinh');
    expect(result.baziDetail.pillars.hour.branch).toBe('Dậu');
    expect(result.baziDetail.napAm).toBe('Kiếm Phong Kim');

    // Ngũ hành sim vs Mệnh chủ: Thổ sinh Kim (Sim sinh cho chủ)
    expect(result.auxiliary.simElementVsMaster.isGood).toBe(true);
    expect(result.auxiliary.simElementVsMaster.relation).toContain('Sim tương sinh cho thân chủ');

    // 4 số cuối chia 80: 6888 % 80 = 8 (Qua giai đoạn gian nan...)
    expect(result.auxiliary.last4Digits.calcRemainder).toBe(8);
    expect(result.auxiliary.last4Digits.nature).toBe('Đại Cát');
    expect(result.auxiliary.last4Digits.meaning).toContain('Qua giai đoạn gian nan');

    // Âm dương: 100% âm (10 số chẵn), hợp Dương Nam
    expect(result.auxiliary.yinYang.evenCount).toBe(10);
    expect(result.auxiliary.yinYang.evenPercent).toBe(100);
    expect(result.auxiliary.yinYang.userGenderBalance).toBe('Dương Nam');
  });
});
