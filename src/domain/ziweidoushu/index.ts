import {
  THIEN_CAN,
  DIA_CHI,
  ThienCan,
  DiaChi,
  NguhanhType,
  solarToLunar,
  getCanChiYear,
} from '../calendar/index';
import { NAP_AM } from '../bazi/index';
import crypto from 'crypto';

export interface ZiWeiInput {
  fullName: string;
  gender: boolean; // true = Nam, false = Nữ
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  viewYear?: number;
}

export type CungType =
  | 'Mệnh'
  | 'Phụ Mẫu'
  | 'Phúc Đức'
  | 'Điền Trạch'
  | 'Quan Lộc'
  | 'Nô Bộc'
  | 'Thiên Di'
  | 'Tật Ách'
  | 'Tài Bạch'
  | 'Tử Tức'
  | 'Phu Thê'
  | 'Huynh Đệ';

export interface StarDetail {
  name: string;
  type: 'Chánh Tinh' | 'Cát Tinh' | 'Sát Tinh' | 'Tứ Hóa' | 'Vòng Sao';
  element: NguhanhType;
  brightness?: 'Miếu' | 'Vượng' | 'Đắc' | 'Hãm';
}

export interface PalaceDetail {
  index: number; // 0..11
  branch: DiaChi;
  stem: ThienCan;
  cungName: CungType;
  isThan: boolean;
  isMenh: boolean;
  mainStars: StarDetail[];
  subStars: StarDetail[];
  tuanTriet?: string[];
  daiHanAge: number;
}

export interface MiniBaziPillar {
  can: string;
  chi: string;
  thapThan: string;
  tangCan: string;
  truongSinh: string;
}

export interface ZiWeiCalculationResult {
  personal: {
    fullName: string;
    genderLabel: string;
    solarDateStr: string;
    lunarDateStr: string;
    cuc: string; // e.g. "Thổ Ngũ Cục"
    menhElement: string;
    thanCungName: CungType;
    lunarAge?: number;
    yearCanChi?: string;
    currentYearCanChi?: string;
    menhMainStar?: string;
    menhChu?: string;
    thanChu?: string;
    menhQuai?: string;
    hanCuuCung?: string;
    miniBazi?: {
      year: MiniBaziPillar;
      month: MiniBaziPillar;
      day: MiniBaziPillar;
      hour: MiniBaziPillar;
    };
  };
  palaces: PalaceDetail[];
}

export interface ZiweiEnvelope {
  engine: 'ziwei';
  engineVersion: '1.0.0';
  methodology: 'tu-vi-dau-so-toan-thu-v1';
  calendarVersion: '1.0.0';
  timezonePolicy: 'UTC+07-fixed';
  calculatedAt: string;
  inputHash: string;
  calculation: ZiWeiCalculationResult;
}

export interface SaoHanResult {
  birthYear: number;
  lunarAge: number;
  targetYear: number;
  targetYearCanChi: string;
  cuuDieu: {
    star: string;
    nature: 'Cát' | 'Hung' | 'Trung Tính';
    description: string;
    remedy: string;
  };
  nienHan: {
    name: string;
    description: string;
  };
  tamTai: {
    isTamTai: boolean;
    yearIndex: number; // 1 = Năm đầu, 2 = Năm giữa, 3 = Năm cuối, 0 = Không
    description: string;
  };
  kimLau: {
    isKimLau: boolean;
    type?: 'Kim Lâu Thân' | 'Kim Lâu Thê' | 'Kim Lâu Tử' | 'Kim Lâu Súc';
    description: string;
  };
  hoangOc: {
    palace: 'Nhất Cát' | 'Nhì Nghi' | 'Tam Địa Sát' | 'Tứ Tấn Tài' | 'Ngũ Thọ Tử' | 'Lục Hoang Ốc';
    isGood: boolean;
    description: string;
  };
}

export interface ZiWeiEnvelope {
  engine: 'ziwei';
  engineVersion: '1.0.0';
  methodology: 'tu-vi-dau-so-toan-thu-v1';
  calendarVersion: '1.0.0';
  timezonePolicy: 'UTC+07-fixed';
  calculatedAt: string;
  inputHash: string;
  calculation: ZiWeiCalculationResult;
}

const CUNG_NAMES: CungType[] = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch',
  'Quan Lộc', 'Nô Bộc', 'Thiên Di', 'Tật Ách',
  'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'
];

/** 14 Chánh Tinh Elements */
const MAIN_STAR_ELEMENTS: Record<string, NguhanhType> = {
  'Tử Vi': 'Thổ', 'Thiên Cơ': 'Mộc', 'Thái Dương': 'Hỏa', 'Vũ Khúc': 'Kim',
  'Thiên Đồng': 'Thủy', 'Liêm Trinh': 'Hỏa', 'Thiên Phủ': 'Thổ', 'Thái Âm': 'Thủy',
  'Tham Lang': 'Thủy', 'Cự Môn': 'Thủy', 'Thiên Tướng': 'Thủy', 'Thiên Lương': 'Mộc',
  'Thất Sát': 'Kim', 'Phá Quân': 'Thủy',
};

/** Tứ Hóa mapping by Year Stem */
const TU_HOA_MAP: Record<ThienCan, { loc: string; quyen: string; khoa: string; ky: string }> = {
  Giáp: { loc: 'Liêm Trinh', quyen: 'Phá Quân', khoa: 'Vũ Khúc', ky: 'Thái Dương' },
  Ất: { loc: 'Thiên Cơ', quyen: 'Thiên Lương', khoa: 'Tử Vi', ky: 'Thái Âm' },
  Bính: { loc: 'Thiên Đồng', quyen: 'Thiên Cơ', khoa: 'Văn Xương', ky: 'Liêm Trinh' },
  Đinh: { loc: 'Thái Âm', quyen: 'Thiên Đồng', khoa: 'Thiên Cơ', ky: 'Cự Môn' },
  Mậu: { loc: 'Tham Lang', quyen: 'Thái Âm', khoa: 'Hữu Bật', ky: 'Thiên Cơ' },
  Kỷ: { loc: 'Vũ Khúc', quyen: 'Tham Lang', khoa: 'Thiên Lương', ky: 'Văn Khúc' },
  Canh: { loc: 'Thái Dương', quyen: 'Vũ Khúc', khoa: 'Thái Âm', ky: 'Thiên Đồng' },
  Tân: { loc: 'Cự Môn', quyen: 'Thái Dương', khoa: 'Văn Khúc', ky: 'Văn Xương' },
  Nhâm: { loc: 'Thiên Lương', quyen: 'Tử Vi', khoa: 'Tả Phù', ky: 'Vũ Khúc' },
  Quý: { loc: 'Phá Quân', quyen: 'Cự Môn', khoa: 'Thái Âm', ky: 'Tham Lang' },
};

/** Mệnh Chủ mapping by Year Branch */
const MENH_CHU_MAP: Record<number, string> = {
  0: 'Tham Lang', // Tý
  1: 'Cự Môn',   // Sửu
  2: 'Lộc Tồn',   // Dần
  3: 'Văn Khúc',  // Mão
  4: 'Liêm Trinh',// Thìn
  5: 'Vũ Khúc',   // Tị
  6: 'Phá Quân',  // Ngọ
  7: 'Vũ Khúc',   // Mùi
  8: 'Liêm Trinh',// Thân
  9: 'Văn Khúc',  // Dậu
  10: 'Lộc Tồn',  // Tuất
  11: 'Cự Môn',   // Hợi
};

/** Thân Chủ mapping by Year Branch */
const THAN_CHU_MAP: Record<number, string> = {
  0: 'Hỏa Tinh',   // Tý
  1: 'Thiên Tướng',// Sửu
  2: 'Thiên Lương',// Dần
  3: 'Thiên Đồng', // Mão
  4: 'Văn Xương',  // Thìn
  5: 'Thiên Cơ',   // Tị
  6: 'Hỏa Tinh',   // Ngọ
  7: 'Thiên Tướng',// Mùi
  8: 'Thiên Lương',// Thân
  9: 'Thiên Đồng', // Dậu
  10: 'Văn Xương', // Tuất
  11: 'Thiên Cơ',  // Hợi
};

/** Mệnh Quái mapping (Bát Trạch Cung Phi) */
function getMenhQuai(lunarYear: number, gender: boolean): string {
  let sum = 0;
  let y = lunarYear;
  while (y > 0) {
    sum += y % 10;
    y = Math.floor(y / 10);
  }
  while (sum > 9) {
    sum = Math.floor(sum / 10) + (sum % 10);
  }
  let remainder = 0;
  if (lunarYear < 2000) {
    remainder = gender ? (10 - sum) : (sum + 5);
  } else {
    remainder = gender ? (9 - sum) : (sum + 6);
  }
  while (remainder > 9) remainder -= 9;
  if (remainder <= 0) remainder += 9;
  if (remainder === 5) remainder = gender ? 2 : 8;
  const quaiMap: Record<number, string> = {
    1: 'Khảm', 2: 'Khôn', 3: 'Chấn', 4: 'Tốn',
    6: 'Càn', 7: 'Đoài', 8: 'Cấn', 9: 'Ly'
  };
  return quaiMap[remainder] || 'Khảm';
}

/** Lục Thập Hoa Giáp Nạp Âm to Cục */
function determineCuc(menhBranchIdx: number, yearCan: ThienCan): { cucName: string; cucNum: number } {
  // Can of Cung Menh via Ngu Ho Don
  const yearCanIdx = THIEN_CAN.indexOf(yearCan);
  const startCan = ((yearCanIdx % 5) * 2 + 2) % 10;
  // Dần = 2
  const menhOffset = (menhBranchIdx - 2 + 12) % 12;
  const menhCan = THIEN_CAN[(startCan + menhOffset) % 10];
  const pair = `${menhCan} ${DIA_CHI[menhBranchIdx]}`;

  const cucMap: Record<string, { cucName: string; cucNum: number }> = {
    'Thủy': { cucName: 'Thủy Nhị Cục', cucNum: 2 },
    'Mộc': { cucName: 'Mộc Tam Cục', cucNum: 3 },
    'Kim': { cucName: 'Kim Tứ Cục', cucNum: 4 },
    'Thổ': { cucName: 'Thổ Ngũ Cục', cucNum: 5 },
    'Hỏa': { cucName: 'Hỏa Lục Cục', cucNum: 6 },
  };

  // Simplistic standard default
  if (['Giáp', 'Ất'].includes(menhCan)) return cucMap['Hỏa'];
  if (['Bính', 'Đinh'].includes(menhCan)) return cucMap['Thổ'];
  if (['Mậu', 'Kỷ'].includes(menhCan)) return cucMap['Mộc'];
  if (['Canh', 'Tân'].includes(menhCan)) return cucMap['Kim'];
  return cucMap['Thủy'];
}

/** Main Tử Vi Chart Calculation */
export function calculateZiWei(input: ZiWeiInput): ZiWeiEnvelope {
  const { fullName, gender, day, month, year, hour, minute } = input;

  const lunar = solarToLunar(year, month, day);
  let lMonth = lunar.month;
  // Handle Leap Lunar Month rule: day 16+ advances to next month
  if (lunar.isLeap && lunar.day >= 16) {
    lMonth = (lMonth % 12) + 1;
  }

  const hourBranchIdx = Math.floor(((hour + 1) % 24) / 2); // 0=Tý, 1=Sửu, ..., 11=Hợi
  const yearCanChi = getCanChiYear(lunar.year);
  const [yearStem, yearBranch] = yearCanChi.split(' ') as [ThienCan, DiaChi];

  // 1. Locate Cung Mệnh and Cung Thân
  // Dần = 2
  // Cung Mệnh: Từ Dần (2) đi thuận tới Tháng sinh, rồi đi nghịch tới Giờ sinh
  const menhBranchIdx = (2 + (lMonth - 1) - hourBranchIdx + 120) % 12;
  // Cung Thân: Từ Dần (2) đi thuận tới Tháng sinh, rồi đi thuận tới Giờ sinh
  const thanBranchIdx = (2 + (lMonth - 1) + hourBranchIdx) % 12;

  // 2. Cục
  const { cucName, cucNum } = determineCuc(menhBranchIdx, yearStem);

  // 3. 12 Palaces assembly
  const palaces: PalaceDetail[] = [];
  const yearCanIdx = THIEN_CAN.indexOf(yearStem);
  const startCanIdx = ((yearCanIdx % 5) * 2 + 2) % 10;

  for (let i = 0; i < 12; i++) {
    const branchIdx = (menhBranchIdx - i + 12) % 12;
    const cungName = CUNG_NAMES[i];
    const isMenh = branchIdx === menhBranchIdx;
    const isThan = branchIdx === thanBranchIdx;
    const stem = THIEN_CAN[(startCanIdx + (branchIdx - 2 + 12) % 12) % 10];

    // Major limits starting age
    const daiHanAge = cucNum + i * 10;

    palaces.push({
      index: i,
      branch: DIA_CHI[branchIdx],
      stem,
      cungName,
      isMenh,
      isThan,
      mainStars: [],
      subStars: [],
      daiHanAge,
    });
  }

  // 4. Place 14 Main Stars
  // An Tử Vi by Cục and Lunar Day
  const tuViBranchIdx = (2 + Math.floor(lunar.day / cucNum) + 12) % 12;

  const getStarBrightness = (star: string, bIdx: number): 'Miếu' | 'Vượng' | 'Đắc' | 'Hãm' => {
    // Standard brightness table
    const brightMap: Record<string, number[]> = {
      'Tử Vi': [1, 2, 6, 7],      // Miếu tại Sửu, Dần, Ngọ, Mùi
      'Thiên Cơ': [0, 4, 6, 10],   // Miếu tại Tý, Thìn, Ngọ, Tuất
      'Thái Dương': [3, 5, 6],     // Miếu tại Mão, Tị, Ngọ
      'Vũ Khúc': [1, 4, 7, 10],    // Miếu tại Sửu, Thìn, Mùi, Tuất
      'Thiên Đồng': [2, 3],        // Miếu tại Dần, Mão
      'Liêm Trinh': [2, 8],        // Miếu tại Dần, Thân
      'Thiên Phủ': [0, 1, 2, 4, 7, 8, 10], // Miếu tại Tý, Sửu, Dần, Thìn, Mùi, Thân, Tuất
      'Thái Âm': [0, 1, 10, 11],   // Miếu tại Tý, Sửu, Tuất, Hợi
      'Tham Lang': [1, 4, 7, 10],  // Miếu tại Sửu, Thìn, Mùi, Tuất
      'Cự Môn': [2, 3, 8, 9],      // Miếu tại Dần, Mão, Thân, Dậu
      'Thiên Tướng': [0, 1, 2, 7, 8], // Miếu tại Tý, Sửu, Dần, Mùi, Thân
      'Thiên Lương': [0, 2, 3, 6, 8, 9], // Miếu tại Tý, Dần, Mão, Ngọ, Thân, Dậu
      'Thất Sát': [0, 1, 2, 6, 7, 8],    // Miếu tại Tý, Sửu, Dần, Ngọ, Mùi, Thân
      'Phá Quân': [0, 6],          // Miếu tại Tý, Ngọ
    };
    if (brightMap[star]?.includes(bIdx)) return 'Miếu';
    if ([2, 4, 6, 8].includes(bIdx)) return 'Vượng';
    if ([1, 5, 7, 11].includes(bIdx)) return 'Đắc';
    return 'Hãm';
  };

  const placeMainStar = (starName: string, bIdx: number) => {
    const p = palaces.find(x => DIA_CHI.indexOf(x.branch) === bIdx);
    if (p) {
      p.mainStars.push({
        name: starName,
        type: 'Chánh Tinh',
        element: MAIN_STAR_ELEMENTS[starName] ?? 'Kim',
        brightness: getStarBrightness(starName, bIdx),
      });
    }
  };

  const placeSubStar = (
    starName: string,
    bIdx: number,
    type: 'Cát Tinh' | 'Sát Tinh' | 'Tứ Hóa' | 'Vòng Sao',
    element: NguhanhType = 'Kim',
    brightness?: 'Miếu' | 'Vượng' | 'Đắc' | 'Hãm'
  ) => {
    const p = palaces.find(x => DIA_CHI.indexOf(x.branch) === bIdx);
    if (p) {
      p.subStars.push({
        name: starName,
        type,
        element,
        brightness,
      });
    }
  };

  // Group Tử Vi
  placeMainStar('Tử Vi', tuViBranchIdx);
  placeMainStar('Thiên Cơ', (tuViBranchIdx - 1 + 12) % 12);
  placeMainStar('Thái Dương', (tuViBranchIdx - 3 + 12) % 12);
  placeMainStar('Vũ Khúc', (tuViBranchIdx - 4 + 12) % 12);
  placeMainStar('Thiên Đồng', (tuViBranchIdx - 5 + 12) % 12);
  placeMainStar('Liêm Trinh', (tuViBranchIdx - 8 + 12) % 12);

  // Group Thiên Phủ
  const thienPhuBranchIdx = (4 - tuViBranchIdx + 12) % 12;
  placeMainStar('Thiên Phủ', thienPhuBranchIdx);
  placeMainStar('Thái Âm', (thienPhuBranchIdx + 1) % 12);
  placeMainStar('Tham Lang', (thienPhuBranchIdx + 2) % 12);
  placeMainStar('Cự Môn', (thienPhuBranchIdx + 3) % 12);
  placeMainStar('Thiên Tướng', (thienPhuBranchIdx + 4) % 12);
  placeMainStar('Thiên Lương', (thienPhuBranchIdx + 5) % 12);
  placeMainStar('Thất Sát', (thienPhuBranchIdx + 6) % 12);
  placeMainStar('Phá Quân', (thienPhuBranchIdx + 10) % 12);

  // [A] Lục Cát Tinh
  // Tả Phù (từ Thìn khởi tháng 1 đi thuận) & Hữu Bật (từ Tuất khởi tháng 1 đi nghịch)
  placeSubStar('Tả Phù', (4 + (lMonth - 1)) % 12, 'Cát Tinh', 'Thổ');
  placeSubStar('Hữu Bật', (10 - (lMonth - 1) + 12) % 12, 'Cát Tinh', 'Thổ');

  // Văn Xương (từ Tuất khởi Tý đi nghịch) & Văn Khúc (từ Thìn khởi Tý đi thuận)
  placeSubStar('Văn Xương', (10 - hourBranchIdx + 12) % 12, 'Cát Tinh', 'Kim');
  placeSubStar('Văn Khúc', (4 + hourBranchIdx) % 12, 'Cát Tinh', 'Thủy');

  // Thiên Khôi & Thiên Việt
  const khoiVietMap: Record<ThienCan, [number, number]> = {
    Giáp: [1, 7], Mậu: [1, 7], Canh: [1, 7],
    Ất: [0, 8], Kỷ: [0, 8],
    Bính: [11, 9], Đinh: [11, 9],
    Tân: [6, 2],
    Nhâm: [3, 5], Quý: [3, 5],
  };
  const [khoiIdx, vietIdx] = khoiVietMap[yearStem] || [1, 7];
  placeSubStar('Thiên Khôi', khoiIdx, 'Cát Tinh', 'Hỏa');
  placeSubStar('Thiên Việt', vietIdx, 'Cát Tinh', 'Hỏa');

  // [B] Lục Sát Tinh & Lộc Tồn
  // Lộc Tồn theo Can Năm
  const locTonMap: Record<ThienCan, number> = {
    Giáp: 2, Ất: 3, Bính: 5, Đinh: 6, Mậu: 5, Kỷ: 6, Canh: 8, Tân: 9, Nhâm: 11, Quý: 0,
  };
  const locTonIdx = locTonMap[yearStem] ?? 2;
  placeSubStar('Lộc Tồn', locTonIdx, 'Cát Tinh', 'Thổ', 'Miếu');

  // Kình Dương (tiến 1) & Đà La (lùi 1)
  placeSubStar('Kình Dương', (locTonIdx + 1) % 12, 'Sát Tinh', 'Kim', 'Đắc');
  placeSubStar('Đà La', (locTonIdx - 1 + 12) % 12, 'Sát Tinh', 'Kim', 'Đắc');

  // Địa Không & Địa Kiếp
  placeSubStar('Địa Không', (11 - hourBranchIdx + 12) % 12, 'Sát Tinh', 'Hỏa', 'Hãm');
  placeSubStar('Địa Kiếp', (11 + hourBranchIdx) % 12, 'Sát Tinh', 'Hỏa', 'Hãm');

  // Hỏa Tinh & Linh Tinh
  const yearBranchIdx = DIA_CHI.indexOf(yearBranch);
  const hoaKhoiMap: Record<number, [number, number]> = {
    2: [1, 3], 6: [1, 3], 10: [1, 3],  // Dần Ngọ Tuất
    8: [2, 10], 0: [2, 10], 4: [2, 10], // Thân Tý Thìn
    5: [3, 10], 9: [3, 10], 1: [3, 10], // Tỵ Dậu Sửu
    11: [9, 10], 3: [9, 10], 7: [9, 10],// Hợi Mão Mùi
  };
  const [hoaStart, linhStart] = hoaKhoiMap[yearBranchIdx] || [1, 3];
  placeSubStar('Hỏa Tinh', (hoaStart + hourBranchIdx) % 12, 'Sát Tinh', 'Hỏa', 'Đắc');
  placeSubStar('Linh Tinh', (linhStart + hourBranchIdx) % 12, 'Sát Tinh', 'Hỏa', 'Đắc');

  // [C] Các Phụ Tinh Cát Khánh: Thiên Mã, Đào Hoa, Hồng Loan, Thiên Hỷ
  // Thiên Mã (theo Chi Năm)
  const maMap: Record<number, number> = { 2: 8, 6: 8, 10: 8, 8: 2, 0: 2, 4: 2, 5: 11, 9: 11, 1: 11, 11: 5, 3: 5, 7: 5 };
  placeSubStar('Thiên Mã', maMap[yearBranchIdx] ?? 8, 'Cát Tinh', 'Hỏa');

  // Đào Hoa
  const daoHoaMap: Record<number, number> = { 2: 3, 6: 3, 10: 3, 8: 9, 0: 9, 4: 9, 5: 6, 9: 6, 1: 6, 11: 0, 3: 0, 7: 0 };
  placeSubStar('Đào Hoa', daoHoaMap[yearBranchIdx] ?? 3, 'Cát Tinh', 'Mộc');

  // Hồng Loan & Thiên Hỷ
  const hongLoanIdx = (3 - yearBranchIdx + 12) % 12;
  placeSubStar('Hồng Loan', hongLoanIdx, 'Cát Tinh', 'Thủy');
  placeSubStar('Thiên Hỷ', (hongLoanIdx + 6) % 12, 'Cát Tinh', 'Thủy');

  // Thiên Khốc & Thiên Hư
  placeSubStar('Thiên Khốc', (6 - yearBranchIdx + 12) % 12, 'Sát Tinh', 'Thủy');
  placeSubStar('Thiên Hư', (6 + yearBranchIdx) % 12, 'Sát Tinh', 'Thủy');

  // Long Trì & Phượng Các
  placeSubStar('Long Trì', (4 + yearBranchIdx) % 12, 'Cát Tinh', 'Thủy');
  placeSubStar('Phượng Các', (10 - yearBranchIdx + 12) % 12, 'Cát Tinh', 'Thổ');
  placeSubStar('Giải Thần', (10 - yearBranchIdx + 12) % 12, 'Cát Tinh', 'Mộc');

  // [D] Vòng Thái Tuế (12 sao)
  const thaiTueNames = [
    'Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm',
    'Quan Phù', 'Tử Phù', 'Tuế Phá', 'Long Đức',
    'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù'
  ];
  thaiTueNames.forEach((star, idx) => {
    placeSubStar(star, (yearBranchIdx + idx) % 12, 'Vòng Sao', 'Kim');
  });

  // [E] Vòng Bác Sĩ (12 sao từ Lộc Tồn)
  // Dương Nam (Giáp, Bính, Mậu, Canh, Nhâm + Nam) hoặc Âm Nữ (Ất, Đinh, Kỷ, Tân, Quý + Nữ) -> Thuận; Ngược lại -> Nghịch
  const isDuongCan = ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'].includes(yearStem);
  const isThuan = (isDuongCan && gender) || (!isDuongCan && !gender);
  const bacSiNames = [
    'Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao',
    'Tướng Quân', 'Tấu Thư', 'Phi Liêm', 'Hỷ Thần',
    'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ'
  ];
  bacSiNames.forEach((star, idx) => {
    const bIdx = isThuan ? (locTonIdx + idx) % 12 : (locTonIdx - idx + 12) % 12;
    placeSubStar(star, bIdx, 'Vòng Sao', 'Thổ');
  });

  // [F] Vòng Tràng Sinh (12 sao)
  const trangSinhStarts: Record<number, number> = { 2: 8, 5: 8, 3: 11, 4: 5, 6: 2 };
  const trangSinhStart = trangSinhStarts[cucNum] ?? 8;
  const trangSinhNames = [
    'Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan',
    'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'
  ];
  trangSinhNames.forEach((star, idx) => {
    const bIdx = isThuan ? (trangSinhStart + idx) % 12 : (trangSinhStart - idx + 12) % 12;
    placeSubStar(star, bIdx, 'Vòng Sao', 'Thủy');
  });

  // [G] Tuần Trung & Triệt Lộ Không Vong
  const trietPairs: Record<ThienCan, [number, number]> = {
    Giáp: [8, 9], Kỷ: [8, 9],
    Ất: [6, 7], Canh: [6, 7],
    Bính: [4, 5], Tân: [4, 5],
    Đinh: [2, 3], Nhâm: [2, 3],
    Mậu: [0, 1], Quý: [0, 1],
  };
  const trietBranches = trietPairs[yearStem] || [8, 9];

  const tuanOffset = (yearBranchIdx - yearCanIdx + 12) % 12;
  const tuanBranchPair = [ (10 - tuanOffset + 12) % 12, (11 - tuanOffset + 12) % 12 ];

  palaces.forEach(p => {
    const bIdx = DIA_CHI.indexOf(p.branch);
    const marks: string[] = [];
    if (trietBranches.includes(bIdx)) marks.push('Triệt');
    if (tuanBranchPair.includes(bIdx)) marks.push('Tuần');
    if (marks.length > 0) p.tuanTriet = marks;
  });

  // [H] Phụ Tinh Cát/Hung bổ sung theo truyền thống Tử Vi Nam Phái & Bắc Phái
  // 1. Ân Quang & Thiên Quý
  const xuongIdx = (10 - hourBranchIdx + 12) % 12;
  const khucIdx = (4 + hourBranchIdx) % 12;
  const anQuangIdx = (xuongIdx + lunar.day - 2 + 120) % 12;
  const thienQuyIdx = (khucIdx - lunar.day + 2 + 120) % 12;
  placeSubStar('Ân Quang', anQuangIdx, 'Cát Tinh', 'Mộc');
  placeSubStar('Thiên Quý', thienQuyIdx, 'Cát Tinh', 'Thổ');

  // 2. Tam Thai & Bát Tọa
  const phuIdx = (4 + (lMonth - 1)) % 12;
  const batIdx = (10 - (lMonth - 1) + 12) % 12;
  const tamThaiIdx = (phuIdx + lunar.day - 1) % 12;
  const batToaIdx = (batIdx - lunar.day + 1 + 120) % 12;
  placeSubStar('Tam Thai', tamThaiIdx, 'Cát Tinh', 'Thủy');
  placeSubStar('Bát Tọa', batToaIdx, 'Cát Tinh', 'Thủy');

  // 3. Phong Cáo & Quốc Ấn, Đường Phù
  placeSubStar('Phong Cáo', (khucIdx + 2) % 12, 'Cát Tinh', 'Kim');
  placeSubStar('Quốc Ấn', (locTonIdx + 8) % 12, 'Cát Tinh', 'Thổ');
  placeSubStar('Đường Phù', (locTonIdx - 7 + 120) % 12, 'Cát Tinh', 'Mộc');

  // 4. Thiên Thọ & Thiên Tài
  placeSubStar('Thiên Tài', (menhBranchIdx + yearBranchIdx) % 12, 'Cát Tinh', 'Thổ');
  placeSubStar('Thiên Thọ', (thanBranchIdx + yearBranchIdx) % 12, 'Cát Tinh', 'Thổ');

  // 5. Thiên Hình & Thiên Diêu, Thiên Y
  const thienHinhIdx = (9 + (lMonth - 1)) % 12; // Khởi Dậu (9) đi thuận
  const thienDieuIdx = (1 + (lMonth - 1)) % 12; // Khởi Sửu (1) đi thuận
  placeSubStar('Thiên Hình', thienHinhIdx, 'Sát Tinh', 'Hỏa', 'Đắc');
  placeSubStar('Thiên Diêu', thienDieuIdx, 'Sát Tinh', 'Thủy');
  placeSubStar('Thiên Y', (1 + (lMonth - 1)) % 12, 'Cát Tinh', 'Thủy');

  // 6. Cô Thần & Quả Tú
  const coThanMap: Record<number, [number, number]> = {
    11: [2, 10], 3: [2, 10], 7: [2, 10], // Hợi Mão Mùi -> Dần, Tuất
    2: [5, 1], 6: [5, 1], 10: [5, 1],    // Dần Ngọ Tuất -> Tị, Sửu
    5: [8, 4], 9: [8, 4], 1: [8, 4],     // Tị Dậu Sửu -> Thân, Thìn
    8: [11, 7], 0: [11, 7], 4: [11, 7],  // Thân Tý Thìn -> Hợi, Mùi
  };
  const [coThanIdx, quaTuIdx] = coThanMap[yearBranchIdx] || [2, 10];
  placeSubStar('Cô Thần', coThanIdx, 'Sát Tinh', 'Hỏa');
  placeSubStar('Quả Tú', quaTuIdx, 'Sát Tinh', 'Thổ');

  // 7. Kiếp Sát, Hoa Cái, Phá Toái
  const kiepSatMap: Record<number, number> = {
    2: 11, 6: 11, 10: 11, // Dần Ngọ Tuất -> Hợi
    8: 5, 0: 5, 4: 5,     // Thân Tý Thìn -> Tị
    5: 2, 9: 2, 1: 2,     // Tị Dậu Sửu -> Dần
    11: 8, 3: 8, 7: 8,    // Hợi Mão Mùi -> Thân
  };
  placeSubStar('Kiếp Sát', kiepSatMap[yearBranchIdx] ?? 11, 'Sát Tinh', 'Hỏa');

  const hoaCaiMap: Record<number, number> = {
    2: 10, 6: 10, 10: 10, // Dần Ngọ Tuất -> Tuất
    8: 4, 0: 4, 4: 4,     // Thân Tý Thìn -> Thìn
    5: 1, 9: 1, 1: 1,     // Tị Dậu Sửu -> Sửu
    11: 7, 3: 7, 7: 7,    // Hợi Mão Mùi -> Mùi
  };
  placeSubStar('Hoa Cái', hoaCaiMap[yearBranchIdx] ?? 10, 'Cát Tinh', 'Kim');

  const phaToaiMap: Record<number, number> = {
    0: 5, 6: 5, 3: 5, 9: 5,    // Tý Ngọ Mão Dậu -> Tị
    4: 1, 10: 1, 1: 1, 7: 1,  // Thìn Tuất Sửu Mùi -> Sửu
    2: 9, 8: 9, 5: 9, 11: 9,  // Dần Thân Tị Hợi -> Dậu
  };
  placeSubStar('Phá Toái', phaToaiMap[yearBranchIdx] ?? 5, 'Sát Tinh', 'Hỏa');

  // 8. Lưu Hà
  const luuHaMap: Record<ThienCan, number> = {
    Giáp: 9, Ất: 10, Bính: 7, Đinh: 4, Mậu: 5,
    Kỷ: 6, Canh: 8, Tân: 3, Nhâm: 11, Quý: 2,
  };
  placeSubStar('Lưu Hà', luuHaMap[yearStem] ?? 9, 'Sát Tinh', 'Thủy');

  // 9. Thiên Không (tại cung Thiếu Dương = yearBranchIdx + 1)
  placeSubStar('Thiên Không', (yearBranchIdx + 1) % 12, 'Sát Tinh', 'Hỏa');

  // 10. Đẩu Quân
  const dauQuanIdx = (yearBranchIdx - (lMonth - 1) + hourBranchIdx + 120) % 12;
  placeSubStar('Đẩu Quân', dauQuanIdx, 'Cát Tinh', 'Hỏa');

  // 11. Thiên Phúc, Thiên Quan
  const thienQuanMap: Record<ThienCan, number> = {
    Giáp: 7, Ất: 4, Bính: 5, Đinh: 2, Mậu: 3, Kỷ: 9, Canh: 11, Tân: 9, Nhâm: 10, Quý: 6
  };
  const thienPhucMap: Record<ThienCan, number> = {
    Giáp: 9, Ất: 8, Bính: 0, Đinh: 11, Mậu: 3, Kỷ: 2, Canh: 6, Tân: 5, Nhâm: 5, Quý: 2
  };
  placeSubStar('Thiên Quan', thienQuanMap[yearStem] ?? 7, 'Cát Tinh', 'Hỏa');
  placeSubStar('Thiên Phúc', thienPhucMap[yearStem] ?? 9, 'Cát Tinh', 'Thổ');

  // 12. Thiên Thương & Thiên Sứ
  const noBocPalace = palaces.find(p => p.cungName === 'Nô Bộc');
  if (noBocPalace) {
    placeSubStar('Thiên Thương', DIA_CHI.indexOf(noBocPalace.branch), 'Sát Tinh', 'Thổ');
  }
  const tatAchPalace = palaces.find(p => p.cungName === 'Tật Ách');
  if (tatAchPalace) {
    placeSubStar('Thiên Sứ', DIA_CHI.indexOf(tatAchPalace.branch), 'Sát Tinh', 'Thủy');
  }

  // 5. Tứ Hóa
  const tuHoa = TU_HOA_MAP[yearStem];
  if (tuHoa) {
    palaces.forEach(p => {
      p.mainStars.forEach(s => {
        if (s.name === tuHoa.loc) s.name += ' (Hóa Lộc)';
        if (s.name === tuHoa.quyen) s.name += ' (Hóa Quyền)';
        if (s.name === tuHoa.khoa) s.name += ' (Hóa Khoa)';
        if (s.name === tuHoa.ky) s.name += ' (Hóa Kỵ)';
      });
      p.subStars.forEach(s => {
        if (s.name === tuHoa.loc) s.name += ' (Hóa Lộc)';
        if (s.name === tuHoa.quyen) s.name += ' (Hóa Quyền)';
        if (s.name === tuHoa.khoa) s.name += ' (Hóa Khoa)';
        if (s.name === tuHoa.ky) s.name += ' (Hóa Kỵ)';
      });
    });
  }

  // 6. Than Cung Name
  const thanPalace = palaces.find(p => p.isThan);
  const thanCungName = thanPalace ? thanPalace.cungName : 'Mệnh';

  const viewYear = input.viewYear || 2026;
  const lunarAge = viewYear - lunar.year + 1;
  const currentYearCanChi = getCanChiYear(viewYear);

  const menhPalace = palaces.find(p => p.isMenh);
  const menhMainStar = menhPalace && menhPalace.mainStars.length > 0
    ? menhPalace.mainStars.map(s => s.name.split(' ')[0]).join(', ')
    : 'Mệnh Vô Chính Diệu';

  const menhChu = MENH_CHU_MAP[yearBranchIdx] || 'Tham Lang';
  const thanChu = THAN_CHU_MAP[yearBranchIdx] || 'Hỏa Tinh';
  const menhQuai = getMenhQuai(lunar.year, gender);
  const saoHan = calculateSaoHan(lunar.year, gender, viewYear);
  const hanCuuCung = saoHan.cuuDieu.star;

  const menhElement = (NAP_AM as Record<string, string>)[yearCanChi] || 'Sa Trung Kim';

  const miniBazi = {
    year: { can: yearStem, chi: yearBranch, thapThan: 'Năm', tangCan: '', truongSinh: '' },
    month: { can: lunar.canChiMonth.split(' ')[0] || '', chi: lunar.canChiMonth.split(' ')[1] || '', thapThan: 'Tháng', tangCan: '', truongSinh: '' },
    day: { can: lunar.canChiDay.split(' ')[0] || '', chi: lunar.canChiDay.split(' ')[1] || '', thapThan: 'Ngày', tangCan: '', truongSinh: '' },
    hour: { can: THIEN_CAN[(startCanIdx + hourBranchIdx) % 10], chi: DIA_CHI[hourBranchIdx], thapThan: 'Giờ', tangCan: '', truongSinh: '' },
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const inputHash = crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');

  const calculation: ZiWeiCalculationResult = {
    personal: {
      fullName: fullName.toUpperCase(),
      genderLabel: gender ? 'Nam Mạng' : 'Nữ Mạng',
      solarDateStr: `${pad(day)}/${pad(month)}/${year} ${pad(hour)}:${pad(minute)}`,
      lunarDateStr: `${pad(lunar.day)}/${pad(lunar.month)}/${lunar.year}${lunar.isLeap ? ' (Nhuận)' : ''}`,
      cuc: cucName,
      menhElement,
      thanCungName,
      lunarAge,
      yearCanChi,
      currentYearCanChi,
      menhMainStar,
      menhChu,
      thanChu,
      menhQuai,
      hanCuuCung,
      miniBazi,
    },
    palaces,
  };

  return {
    engine: 'ziwei',
    engineVersion: '1.0.0',
    methodology: 'tu-vi-dau-so-toan-thu-v1',
    calendarVersion: '1.0.0',
    timezonePolicy: 'UTC+07-fixed',
    calculatedAt: new Date().toISOString(),
    inputHash,
    calculation,
  };
}

export { calculateZiWei as calculateZiwei };

/** Calculate Sao Hạn (Cửu Diệu, Tam Tai, Kim Lâu, Hoang Ốc) */
export function calculateSaoHan(
  birthYear: number,
  gender: boolean,
  targetYear: number
): SaoHanResult {
  const lunarAge = targetYear - birthYear + 1; // Nominal age (tuổi mụ)

  // 1. Cửu Diệu (9 Stars)
  // Male cycle from age 10: La Hầu, Thổ Tú, Thủy Diệu, Thái Bạch, Thái Dương, Vân Hớn, Kế Đô, Thái Âm, Mộc Đức
  const maleStars = [
    'La Hầu', 'Thổ Tú', 'Thủy Diệu', 'Thái Bạch', 'Thái Dương',
    'Vân Hớn', 'Kế Đô', 'Thái Âm', 'Mộc Đức'
  ];
  // Female cycle from age 10: Kế Đô, Vân Hớn, Mộc Đức, Thái Âm, Thổ Tú, La Hầu, Thái Dương, Thủy Diệu, Thái Bạch
  const femaleStars = [
    'Kế Đô', 'Vân Hớn', 'Mộc Đức', 'Thái Âm', 'Thổ Tú',
    'La Hầu', 'Thái Dương', 'Thủy Diệu', 'Thái Bạch'
  ];

  const starIdx = (lunarAge - 10 + 900) % 9;
  const starName = gender ? maleStars[starIdx] : femaleStars[starIdx];

  const starMeta: Record<string, { nature: 'Cát' | 'Hung' | 'Trung Tính'; desc: string; remedy: string }> = {
    'Thái Dương': { nature: 'Cát', desc: 'Chủ về sự quang minh, tài lộc thịnh vượng, kinh doanh đại lợi.', remedy: 'Nên cúng nghênh sao vào ngày 27 âm lịch hàng tháng.' },
    'Thái Âm': { nature: 'Cát', desc: 'Chủ về cầu tài danh, công việc thuận lợi, quý nhân phù trợ.', remedy: 'Cúng nghênh sao vào ngày 26 âm lịch hàng tháng.' },
    'Mộc Đức': { nature: 'Cát', desc: 'Chủ về sự an lành, hôn nhân hòa hợp, thêm nhân khẩu.', remedy: 'Cúng nghênh sao vào ngày 25 âm lịch hàng tháng.' },
    'Vân Hớn': { nature: 'Trung Tính', desc: 'Chủ về khẩu thiệt thị phi, gia đạo bình hòa, cẩn trọng lời ăn tiếng nói.', remedy: 'Cúng dâng sao giải hạn vào ngày 29 âm lịch hàng tháng.' },
    'Thổ Tú': { nature: 'Trung Tính', desc: 'Chủ về sự trở ngại nhỏ, đi xa cẩn thận, phòng kẻ tiểu nhân gièm pha.', remedy: 'Cúng nghênh sao vào ngày 19 âm lịch hàng tháng.' },
    'Thủy Diệu': { nature: 'Trung Tính', desc: 'Chủ về tài lộc hanh thông nhưng kỵ sông nước và tranh cãi thị phi tháng 4, tháng 8.', remedy: 'Cúng dâng sao vào ngày 21 âm lịch hàng tháng.' },
    'La Hầu': { nature: 'Hung', desc: 'Chủ về thị phi công quyền, tai tiếng bệnh tật, đặc biệt tháng giêng và tháng 7.', remedy: 'Dâng sớ cầu an giải hạn vào ngày mùng 8 âm lịch hàng tháng.' },
    'Kế Đô': { nature: 'Hung', desc: 'Chủ về âu lo buồn phiền, hao tài tốn của, đặc biệt kỵ tháng 3 và tháng 9.', remedy: 'Dâng sớ cầu an giải hạn vào ngày 18 âm lịch hàng tháng.' },
    'Thái Bạch': { nature: 'Hung', desc: 'Chủ về hao tốn tiền của, sức khỏe suy giảm, phòng việc làm ăn tháng 5 âm lịch.', remedy: 'Dâng sớ hóa giải sao vào ngày 15 âm lịch hàng tháng.' },
  };

  const curStar = starMeta[starName] ?? starMeta['Thái Dương'];

  // 2. Niên Hạn (8 Limits)
  const nienHanList = ['Huỳnh Tuyền', 'Tam Kheo', 'Ngũ Mộ', 'Thiên Tinh', 'Tán Tận', 'Thiên La', 'Địa Võng', 'Diêm Vương'];
  const hanIdx = (lunarAge - 10 + 800) % 8;
  const hanName = nienHanList[hanIdx];

  // 3. Tam Tai
  // Thân - Tý - Thìn gặp Dần - Mão - Thìn
  // Dần - Ngọ - Tuất gặp Thân - Dậu - Tuất
  // Tỵ - Dậu - Sửu gặp Hợi - Tý - Sửu
  // Hợi - Mão - Mùi gặp Tỵ - Ngọ - Mùi
  const birthChi = DIA_CHI[(birthYear + 8) % 12];
  const targetChi = DIA_CHI[(targetYear + 8) % 12];

  const tamTaiRules: Record<string, DiaChi[]> = {
    Thân: ['Dần', 'Mão', 'Thìn'], Tý: ['Dần', 'Mão', 'Thìn'], Thìn: ['Dần', 'Mão', 'Thìn'],
    Dần: ['Thân', 'Dậu', 'Tuất'], Ngọ: ['Thân', 'Dậu', 'Tuất'], Tuất: ['Thân', 'Dậu', 'Tuất'],
    Tỵ: ['Hợi', 'Tý', 'Sửu'], Dậu: ['Hợi', 'Tý', 'Sửu'], Sửu: ['Hợi', 'Tý', 'Sửu'],
    Hợi: ['Tỵ', 'Ngọ', 'Mùi'], Mão: ['Tỵ', 'Ngọ', 'Mùi'], Mùi: ['Tỵ', 'Ngọ', 'Mùi'],
  };

  const ttGroup = tamTaiRules[birthChi] ?? [];
  const ttIdx = ttGroup.indexOf(targetChi);
  const isTamTai = ttIdx !== -1;

  // 4. Kim Lâu
  // Remainder of lunarAge / 9
  const klRem = lunarAge % 9;
  let isKimLau = false;
  let klType: 'Kim Lâu Thân' | 'Kim Lâu Thê' | 'Kim Lâu Tử' | 'Kim Lâu Súc' | undefined = undefined;
  if (klRem === 1) { isKimLau = true; klType = 'Kim Lâu Thân'; }
  else if (klRem === 3) { isKimLau = true; klType = 'Kim Lâu Thê'; }
  else if (klRem === 6) { isKimLau = true; klType = 'Kim Lâu Tử'; }
  else if (klRem === 8) { isKimLau = true; klType = 'Kim Lâu Súc'; }

  // 5. Hoang Ốc
  // 6 Palaces: 1=Nhất Cát, 2=Nhì Nghi, 3=Tam Địa Sát, 4=Tứ Tấn Tài, 5=Ngũ Thọ Tử, 6=Lục Hoang Ốc
  const hoangOcList: Array<'Nhất Cát' | 'Nhì Nghi' | 'Tam Địa Sát' | 'Tứ Tấn Tài' | 'Ngũ Thọ Tử' | 'Lục Hoang Ốc'> = [
    'Nhất Cát', 'Nhì Nghi', 'Tam Địa Sát', 'Tứ Tấn Tài', 'Ngũ Thọ Tử', 'Lục Hoang Ốc'
  ];
  const hoIdx = (lunarAge - 10 + 600) % 6;
  const hoPalace = hoangOcList[hoIdx];
  const isGoodHo = ['Nhất Cát', 'Nhì Nghi', 'Tứ Tấn Tài'].includes(hoPalace);

  return {
    birthYear,
    lunarAge,
    targetYear,
    targetYearCanChi: getCanChiYear(targetYear),
    cuuDieu: {
      star: starName,
      nature: curStar.nature,
      description: curStar.desc,
      remedy: curStar.remedy,
    },
    nienHan: {
      name: hanName,
      description: `Hạn ${hanName} ảnh hưởng sức khỏe, cần thận trọng tài vận và đi lại.`,
    },
    tamTai: {
      isTamTai,
      yearIndex: isTamTai ? ttIdx + 1 : 0,
      description: isTamTai
        ? `Năm ${targetYear} là năm Tam Tai thứ ${ttIdx + 1} của bản mệnh. Tránh khởi công đại sự đột ngột.`
        : `Năm ${targetYear} không phạm hạn Tam Tai. Vạn sự tiến hành thuận lợi.`,
    },
    kimLau: {
      isKimLau,
      type: klType,
      description: isKimLau
        ? `Bản mệnh phạm ${klType}. Không nên cưới gả hay đứng tên xây cất nhà cửa.`
        : `Bản mệnh không phạm Kim Lâu trong năm này.`,
    },
    hoangOc: {
      palace: hoPalace,
      isGood: isGoodHo,
      description: isGoodHo
        ? `Cung ${hoPalace} là cung tốt, làm nhà khởi sự gặp nhiều cát lợi sinh tài.`
        : `Cung ${hoPalace} là cung xấu, nên tránh làm nhà hoặc mượn tuổi người hợp để khởi công.`,
    },
  };
}
