import { describe, it, expect } from 'vitest';
import { calculateSaoHanDetailed, getNapAmFromYear } from '@/domain/astrology/sao-han';

describe('Sao Han Astrology Engine', () => {
  it('calculates accurate Cửu Diệu and Niên Hạn for 1990 Male in 2026', () => {
    // 1990 in 2026: lunar age = 2026 - 1990 + 1 = 37
    // Male 37: 37 % 9 = 1 -> La Hầu
    const res = calculateSaoHanDetailed({
      fullName: 'Nguyễn Văn A',
      gender: true,
      birthDay: 15,
      birthMonth: 8,
      birthYear: 1990,
      targetYear: 2026,
    });

    expect(res.solarAge).toBe(36);
    expect(res.lunarAge).toBe(37);
    expect(res.cuuDieu.star).toBe('La Hầu');
    expect(res.cuuDieu.nature).toBe('Hung');
    expect(res.cuuDieu.element).toBe('Kim');
    expect(res.cuuDieu.remedy).toBeDefined();

    // 1990 Canh Ngọ
    expect(res.birthYearCanChi).toBe('Canh Ngọ');
    expect(res.menhNapAm).toBe('Lộ Bàng Thổ');

    // (37 - 10) % 8 = 3 -> Thiên Tinh
    expect(res.nienHan.name).toBe('Thiên Tinh');

    // Kim Lâu: 37 % 9 = 1 -> Kim Lâu Thân
    expect(res.kimLau.isKimLau).toBe(true);
    expect(res.kimLau.type).toBe('Kim Lâu Thân');

    // Hoang Ốc: 37: 30 is Tam Địa Sát, 31 Tứ Tấn Tài, 32 Ngũ Thọ Tử, 33 Lục Hoang Ốc, 34 Nhất Cát, 35 Nhì Nghi, 36 Tam Địa Sát, 37 Tứ Tấn Tài
    expect(res.hoangOc.palace).toBe('Tứ Tấn Tài');
    expect(res.hoangOc.isGood).toBe(true);
  });

  it('calculates accurate Cửu Diệu for 1990 Female in 2026', () => {
    // Female 37: 37 % 9 = 1 -> Kế Đô
    const res = calculateSaoHanDetailed({
      fullName: 'Trần Thị B',
      gender: false,
      birthDay: 10,
      birthMonth: 5,
      birthYear: 1990,
      targetYear: 2026,
    });

    expect(res.lunarAge).toBe(37);
    expect(res.cuuDieu.star).toBe('Kế Đô');
    expect(res.cuuDieu.nature).toBe('Hung');
    expect(res.cuuDieu.element).toBe('Thổ');
  });

  it('detects Tam Tai for Thân - Tý - Thìn in Dần - Mão - Thìn', () => {
    // 1992 Nhâm Thân (birthMonth 8) in 2024 (Giáp Thìn) -> Tam Tai year 3
    const res = calculateSaoHanDetailed({
      gender: true,
      birthDay: 15,
      birthMonth: 8,
      birthYear: 1992,
      targetYear: 2024,
    });

    expect(res.birthYearCanChi).toBe('Nhâm Thân');
    expect(res.tamTai.isTamTai).toBe(true);
    expect(res.tamTai.yearIndex).toBe(3);
  });

  it('provides accurate Nạp Âm mapping', () => {
    expect(getNapAmFromYear(1990).napAm).toBe('Lộ Bàng Thổ');
    expect(getNapAmFromYear(1984).napAm).toBe('Hải Trung Kim');
    expect(getNapAmFromYear(1989).napAm).toBe('Đại Lâm Mộc');
  });
});
