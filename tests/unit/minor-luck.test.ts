import { describe, it, expect } from 'vitest';
import { calculateMinorLuck } from '@/domain/bazi/minorLuck';

describe('Bazi Minor Luck (Tiểu Vận) Engine', () => {
  // Test case 1: Reference example from User Screenshot
  // Nam, 15/08/1990 (Canh Ngọ -> Dương Nam)
  // Trụ Giờ: Ất Tỵ
  // Nhật Chủ: Nhâm (Nhâm Tý)
  it('correctly calculates Dương Nam with forward (+1) direction starting from Trụ Giờ', () => {
    const res = calculateMinorLuck({
      gender: true,
      yearStem: 'Canh',
      hourStem: 'Ất',
      hourBranch: 'Tỵ',
      dayMaster: 'Nhâm',
      birthYear: 1990,
      focusYear: 2026,
    });

    expect(res.direction).toBe('Thuận');
    expect(res.directionValue).toBe(1);
    expect(res.baseHourPillar.canChi).toBe('Ất Tỵ');

    // Rule 5: Age 0 must be exactly Trụ Giờ
    const age0 = res.table.find((t) => t.age === 0);
    expect(age0?.canChi).toBe('Ất Tỵ');

    // Age 1: Bính Ngọ (Ất+1=Bính, Tỵ+1=Ngọ)
    const age1 = res.table.find((t) => t.age === 1);
    expect(age1?.canChi).toBe('Bính Ngọ');

    // Age 28 (Year 2017): Quý Dậu
    // (1 + 28) % 10 = 9 (Quý), (5 + 28) % 12 = 9 (Dậu)
    const age28 = res.table.find((t) => t.age === 28);
    expect(age28?.canChi).toBe('Quý Dậu');
    // Day Master is Nhâm, Quý is Kiếp Tài
    expect(age28?.tenGod).toBe('Kiếp');

    // Age 37 (Year 2026): Nhâm Ngọ
    // (1 + 37) % 10 = 8 (Nhâm), (5 + 37) % 12 = 6 (Ngọ)
    expect(res.currentAge).toBe(37);
    expect(res.current.canChi).toBe('Nhâm Ngọ');
    // Day Master is Nhâm, Nhâm is Tỷ Kiên
    expect(res.current.tenGod).toBe('Tỷ');
    expect(res.current.tenGodFullName).toBe('Tỷ Kiên');

    // Rule 6: At age 60, Minor Luck returns exactly to Trụ Giờ
    const age60 = res.table.find((t) => t.age === 60);
    expect(age60?.canChi).toBe('Ất Tỵ');
  });

  it('correctly calculates Âm Nam with backward (-1) direction', () => {
    // Nam born in Tân Mùi (Tân is Yin Metal -> Âm Nam -> Nghịch -1)
    // Hour pillar: Giáp Tý (canIndex 0, chiIndex 0)
    // Day Master: Giáp
    const res = calculateMinorLuck({
      gender: true,
      yearStem: 'Tân',
      hourStem: 'Giáp',
      hourBranch: 'Tý',
      dayMaster: 'Giáp',
      birthYear: 1991,
      focusYear: 1992,
    });

    expect(res.direction).toBe('Nghịch');
    expect(res.directionValue).toBe(-1);

    // Age 0: Giáp Tý
    expect(res.table[0].canChi).toBe('Giáp Tý');

    // Age 1: (0 - 1 + 10)%10 = 9 (Quý), (0 - 1 + 12)%12 = 11 (Hợi) -> Quý Hợi
    expect(res.table[1].canChi).toBe('Quý Hợi');

    // Age 60: returns to Giáp Tý
    expect(res.table[60].canChi).toBe('Giáp Tý');
  });

  it('correctly calculates Âm Nữ (Thuận +1) and Dương Nữ (Nghịch -1)', () => {
    // Âm Nữ: Female born in Ất Hợi (Ất is Yin -> Âm Nữ -> Thuận +1)
    const resAmNu = calculateMinorLuck({
      gender: false,
      yearStem: 'Ất',
      hourStem: 'Bính',
      hourBranch: 'Dần',
      dayMaster: 'Mậu',
      birthYear: 1995,
      focusYear: 1995,
    });
    expect(resAmNu.direction).toBe('Thuận');
    expect(resAmNu.directionValue).toBe(1);

    // Dương Nữ: Female born in Giáp Tuất (Giáp is Yang -> Dương Nữ -> Nghịch -1)
    const resDuongNu = calculateMinorLuck({
      gender: false,
      yearStem: 'Giáp',
      hourStem: 'Bính',
      hourBranch: 'Dần',
      dayMaster: 'Mậu',
      birthYear: 1994,
      focusYear: 1994,
    });
    expect(resDuongNu.direction).toBe('Nghịch');
    expect(resDuongNu.directionValue).toBe(-1);
  });
});
