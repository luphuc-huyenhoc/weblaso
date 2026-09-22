import {
  THIEN_CAN,
  DIA_CHI,
  ThienCan,
  DiaChi,
  NguhanhType,
  gregorianToJdn,
  getSunLongitude,
  findSolarTermInstant,
  solarToLunar,
  getCanChiHour,
} from '../calendar/index';
import crypto from 'crypto';

export interface BaziInput {
  fullName: string;
  gender: boolean; // true = Male, false = Female
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  focusYear?: number;
  oneHundredYears?: boolean;
}

export type TenGod =
  | 'Tỷ'
  | 'Kiếp'
  | 'Thực'
  | 'Thương'
  | 'Tài'
  | 'T.Tài'
  | 'Quan'
  | 'Sát'
  | 'Ấn'
  | 'Kiêu'
  | 'NHẬT CHỦ';

export interface PillarData {
  name: string; // Niên Trụ, Nguyệt Trụ, Nhật Trụ, Thời Trụ
  solarValue: string;
  stem: ThienCan;
  branch: DiaChi;
  stemTenGod: TenGod;
  stemElement: NguhanhType;
  branchElement: NguhanhType;
  hiddenStems: Array<{
    stem: ThienCan;
    element: NguhanhType;
    tenGod: TenGod;
    percentage: number;
  }>;
  stars: string[];
}

export interface MajorLuckPillar {
  index: number;
  stem: ThienCan;
  branch: DiaChi;
  tenGod: TenGod;
  startAge: number;
  endAge: number;
  startYearMonth: string;
  annualYears: Array<{
    year: number;
    age: number;
    stem: ThienCan;
    branch: DiaChi;
    isFocusYear: boolean;
  }>;
}

export interface BaziCalculationResult {
  personal: {
    fullName: string;
    genderLabel: 'Dương Nam' | 'Âm Nam' | 'Dương Nữ' | 'Âm Nữ';
    solarDateStr: string;
    lunarDateStr: string;
    napAm: string;
  };
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData;
  };
  dayMaster: {
    stem: ThienCan;
    element: NguhanhType;
    strength: 'Thân Vượng' | 'Thân Nhược' | 'Trung Hòa';
    percentage: number;
  };
  solarTerms: {
    currentTerm: string;
    currentStart: string;
    nextTerm: string;
    nextStart: string;
  };
  majorLuck: {
    direction: 'Thuận' | 'Nghịch';
    calcValue: number;
    startAgeYears: number;
    startAgeMonths: number;
    pillars: MajorLuckPillar[];
  };
}

export interface BaziInterpretationResult {
  elementsScore: Record<NguhanhType, number>;
  dungThan: NguhanhType;
  hyThan: NguhanhType;
  kyThan: NguhanhType;
  recommendations: {
    favorableColors: string[];
    favorableDirections: string[];
    favorableGemstones: string[];
    summary: string;
  };
}

export interface BaziEnvelope {
  engine: 'bazi';
  engineVersion: '1.0.0';
  methodology: 'tu-binh-manh-phai-v1';
  calendarVersion: '1.0.0';
  timezonePolicy: 'UTC+07-fixed';
  calculatedAt: string;
  inputHash: string;
  input: BaziInput;
  calculation: BaziCalculationResult;
  interpretation: BaziInterpretationResult;
}

// Five Element mapping for Stems
export const STEM_ELEMENTS: Record<ThienCan, NguhanhType> = {
  Giáp: 'Mộc',
  Ất: 'Mộc',
  Bính: 'Hỏa',
  Đinh: 'Hỏa',
  Mậu: 'Thổ',
  Kỷ: 'Thổ',
  Canh: 'Kim',
  Tân: 'Kim',
  Nhâm: 'Thủy',
  Quý: 'Thủy',
};

// Polarity for Stems (true = Yang, false = Yin)
export const STEM_YANG: Record<ThienCan, boolean> = {
  Giáp: true,
  Ất: false,
  Bính: true,
  Đinh: false,
  Mậu: true,
  Kỷ: false,
  Canh: true,
  Tân: false,
  Nhâm: true,
  Quý: false,
};

// Five Element mapping for Branches
export const BRANCH_ELEMENTS: Record<DiaChi, NguhanhType> = {
  Tý: 'Thủy',
  Sửu: 'Thổ',
  Dần: 'Mộc',
  Mão: 'Mộc',
  Thìn: 'Thổ',
  Tỵ: 'Hỏa',
  Ngọ: 'Hỏa',
  Mùi: 'Thổ',
  Thân: 'Kim',
  Dậu: 'Kim',
  Tuất: 'Thổ',
  Hợi: 'Thủy',
};

// Hidden Stems in each Branch
const HIDDEN_STEMS: Record<
  DiaChi,
  Array<{ stem: ThienCan; percentage: number }>
> = {
  Tý: [{ stem: 'Quý', percentage: 100 }],
  Sửu: [
    { stem: 'Kỷ', percentage: 60 },
    { stem: 'Quý', percentage: 30 },
    { stem: 'Tân', percentage: 10 },
  ],
  Dần: [
    { stem: 'Giáp', percentage: 60 },
    { stem: 'Bính', percentage: 30 },
    { stem: 'Mậu', percentage: 10 },
  ],
  Mão: [{ stem: 'Ất', percentage: 100 }],
  Thìn: [
    { stem: 'Mậu', percentage: 60 },
    { stem: 'Ất', percentage: 30 },
    { stem: 'Quý', percentage: 10 },
  ],
  Tỵ: [
    { stem: 'Bính', percentage: 60 },
    { stem: 'Canh', percentage: 30 },
    { stem: 'Mậu', percentage: 10 },
  ],
  Ngọ: [
    { stem: 'Đinh', percentage: 70 },
    { stem: 'Kỷ', percentage: 30 },
  ],
  Mùi: [
    { stem: 'Kỷ', percentage: 60 },
    { stem: 'Đinh', percentage: 30 },
    { stem: 'Ất', percentage: 10 },
  ],
  Thân: [
    { stem: 'Canh', percentage: 60 },
    { stem: 'Nhâm', percentage: 30 },
    { stem: 'Mậu', percentage: 10 },
  ],
  Dậu: [{ stem: 'Tân', percentage: 100 }],
  Tuất: [
    { stem: 'Mậu', percentage: 60 },
    { stem: 'Tân', percentage: 30 },
    { stem: 'Đinh', percentage: 10 },
  ],
  Hợi: [
    { stem: 'Nhâm', percentage: 70 },
    { stem: 'Giáp', percentage: 30 },
  ],
};

// 12 Jie (Solar terms) for Month Pillar boundaries
const JIE_ANGLES = [
  315, // Lập xuân -> Dần
  345, // Kinh trập -> Mão
  15,  // Thanh minh -> Thìn
  45,  // Lập hạ -> Tỵ
  75,  // Mang chủng -> Ngọ
  105, // Tiểu thử -> Mùi
  135, // Lập thu -> Thân
  165, // Bạch lộ -> Dậu
  195, // Hàn lộ -> Tuất
  225, // Lập đông -> Hợi
  255, // Đại tuyết -> Tý
  285, // Tiểu hàn -> Sửu
];

const JIE_NAMES = [
  'Lập xuân',
  'Kinh trập',
  'Thanh minh',
  'Lập hạ',
  'Mang chủng',
  'Tiểu thử',
  'Lập thu',
  'Bạch lộ',
  'Hàn lộ',
  'Lập đông',
  'Đại tuyết',
  'Tiểu hàn',
];

const MONTH_BRANCH_NAMES: DiaChi[] = [
  'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi',
  'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'
];

/** Determine Ten God between Day Master and target Stem */
export function getTenGod(dayMaster: ThienCan, target: ThienCan): TenGod {
  if (dayMaster === target) return 'Tỷ';

  const dmElem = STEM_ELEMENTS[dayMaster];
  const targetElem = STEM_ELEMENTS[target];
  const samePolarity = STEM_YANG[dayMaster] === STEM_YANG[target];

  if (dmElem === targetElem) {
    return samePolarity ? 'Tỷ' : 'Kiếp';
  }

  // Generation cycle
  const generates: Record<NguhanhType, NguhanhType> = {
    Mộc: 'Hỏa',
    Hỏa: 'Thổ',
    Thổ: 'Kim',
    Kim: 'Thủy',
    Thủy: 'Mộc',
  };

  // Overcomes cycle
  const overcomes: Record<NguhanhType, NguhanhType> = {
    Mộc: 'Thổ',
    Thổ: 'Thủy',
    Thủy: 'Hỏa',
    Hỏa: 'Kim',
    Kim: 'Mộc',
  };

  if (generates[dmElem] === targetElem) {
    return samePolarity ? 'Thực' : 'Thương';
  }
  if (generates[targetElem] === dmElem) {
    return samePolarity ? 'Kiêu' : 'Ấn';
  }
  if (overcomes[dmElem] === targetElem) {
    return samePolarity ? 'T.Tài' : 'Tài';
  }
  if (overcomes[targetElem] === dmElem) {
    return samePolarity ? 'Sát' : 'Quan';
  }

  return 'Tỷ';
}

/** Nạp Âm Lục Thập Hoa Giáp lookup */
const NAP_AM: Record<string, string> = {
  'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim',
  'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa',
  'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc',
  'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
  'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim',
  'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa',
  'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy',
  'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
  'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim',
  'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc',
  'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy',
  'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
  'Mậu Tý': 'Tích Lịch Hỏa', 'Kỷ Sửu': 'Tích Lịch Hỏa',
  'Canh Dần': 'Tùng Bách Mộc', 'Tân Mão': 'Tùng Bách Mộc',
  'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy',
  'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
  'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa',
  'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc',
  'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ',
  'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
  'Giáp Thìn': 'Phúc Đăng Hỏa', 'Ất Tỵ': 'Phúc Đăng Hỏa',
  'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy',
  'Mậu Thân': 'Đại Dịch Thổ', 'Kỷ Dậu': 'Đại Dịch Thổ',
  'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
  'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc',
  'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
  'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ',
  'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
  'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc',
  'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy',
};

/** Calculate Deities and Stars for a pillar */
function calculateStars(
  pillarBranch: DiaChi,
  dayMaster: ThienCan,
  yearBranch: DiaChi,
  monthBranch: DiaChi,
  yearStem?: ThienCan,
  dayBranch?: DiaChi,
  dayStem?: ThienCan,
  pillarStem?: ThienCan
): string[] {
  const stars: string[] = [];

  // 1. Kình Dương (Dương thuận Âm nghịch / Manh Phái)
  const kinhDuongMap: Record<ThienCan, DiaChi> = {
    Giáp: 'Mão',
    Ất: 'Thìn',
    Bính: 'Ngọ',
    Đinh: 'Tỵ',
    Mậu: 'Ngọ',
    Kỷ: 'Tỵ',
    Canh: 'Dậu',
    Tân: 'Tuất',
    Nhâm: 'Tý',
    Quý: 'Sửu',
  };
  if (kinhDuongMap[dayMaster] === pillarBranch) {
    stars.push('Kình Dương');
  }

  // 2. Không Vong (Tuần Không based on Day Pillar Xun)
  if (dayStem && dayBranch) {
    const canIdx = THIEN_CAN.indexOf(dayStem);
    const chiIdx = DIA_CHI.indexOf(dayBranch);
    const diff = (chiIdx - canIdx + 12) % 12;
    const xunKongMap: Record<number, DiaChi[]> = {
      0: ['Tuất', 'Hợi'],  // Giáp Tý tuần
      10: ['Thân', 'Dậu'], // Giáp Tuất tuần
      8: ['Ngọ', 'Mùi'],   // Giáp Thân tuần
      6: ['Thìn', 'Tỵ'],   // Giáp Ngọ tuần
      4: ['Dần', 'Mão'],   // Giáp Thìn tuần
      2: ['Tý', 'Sửu'],    // Giáp Dần tuần
    };
    if (xunKongMap[diff]?.includes(pillarBranch)) {
      stars.push('Không Vong');
    }
  }

  // 3. Hoa Cái (Tam Hợp)
  const hoaCaiMap: Record<DiaChi, DiaChi> = {
    Dần: 'Tuất', Ngọ: 'Tuất', Tuất: 'Tuất',
    Thân: 'Thìn', Tý: 'Thìn', Thìn: 'Thìn',
    Tỵ: 'Sửu', Dậu: 'Sửu', Sửu: 'Sửu',
    Hợi: 'Mùi', Mão: 'Mùi', Mùi: 'Mùi',
  };
  if (dayBranch && hoaCaiMap[dayBranch] === pillarBranch) {
    stars.push('Hoa Cái');
  } else if (hoaCaiMap[yearBranch] === pillarBranch) {
    stars.push('Hoa Cái');
  }

  // 4. Văn Xương Quý Nhân (based on Day Master)
  const vanXuongMap: Record<ThienCan, DiaChi> = {
    Giáp: 'Tỵ',
    Ất: 'Ngọ',
    Bính: 'Thân',
    Đinh: 'Dậu',
    Mậu: 'Thân',
    Kỷ: 'Dậu',
    Canh: 'Hợi',
    Tân: 'Tý',
    Nhâm: 'Dần',
    Quý: 'Mão',
  };
  if (vanXuongMap[dayMaster] === pillarBranch) {
    stars.push('Văn Xương');
  }

  // 5. Thiên Ất Quý Nhân (based on Day Master)
  const thienAtMap: Record<ThienCan, DiaChi[]> = {
    Giáp: ['Sửu', 'Mùi'],
    Mậu: ['Sửu', 'Mùi'],
    Ất: ['Tý', 'Thân'],
    Kỷ: ['Tý', 'Thân'],
    Bính: ['Hợi', 'Dậu'],
    Đinh: ['Hợi', 'Dậu'],
    Canh: ['Dần', 'Ngọ'],
    Tân: ['Dần', 'Ngọ'],
    Nhâm: ['Tỵ', 'Mão'],
    Quý: ['Tỵ', 'Mão'],
  };
  if (thienAtMap[dayMaster]?.includes(pillarBranch)) {
    stars.push('Thiên Ất');
  }

  // 6. Tướng Tinh (Tam Hợp trung ương)
  const tuongTinhMap: Record<DiaChi, DiaChi> = {
    Thân: 'Tý', Tý: 'Tý', Thìn: 'Tý',
    Dần: 'Ngọ', Ngọ: 'Ngọ', Tuất: 'Ngọ',
    Tỵ: 'Dậu', Dậu: 'Dậu', Sửu: 'Dậu',
    Hợi: 'Mão', Mão: 'Mão', Mùi: 'Mão',
  };
  if (dayBranch && tuongTinhMap[dayBranch] === pillarBranch) {
    stars.push('Tướng Tinh');
  } else if (tuongTinhMap[yearBranch] === pillarBranch) {
    stars.push('Tướng Tinh');
  }

  // 7. Thiên Đức Quý Nhân (based on Month Branch)
  const thienDucMap: Record<DiaChi, { stem?: ThienCan; branch?: DiaChi }> = {
    Dần: { stem: 'Đinh' },
    Mão: { branch: 'Thân' },
    Thìn: { stem: 'Nhâm' },
    Tỵ: { stem: 'Tân' },
    Ngọ: { branch: 'Hợi' },
    Mùi: { stem: 'Giáp' },
    Thân: { stem: 'Quý' },
    Dậu: { branch: 'Dần' },
    Tuất: { stem: 'Bính' },
    Hợi: { stem: 'Ất' },
    Tý: { branch: 'Tỵ' },
    Sửu: { stem: 'Tân' }, // In month Sửu, Thiên Đức is Tân (governs Hour Tân Sửu)
  };
  const td = thienDucMap[monthBranch];
  if (td) {
    if (td.stem && pillarStem === td.stem) {
      stars.push('Thiên Đức');
    } else if (td.branch && pillarBranch === td.branch) {
      stars.push('Thiên Đức');
    }
  }

  // 8. Dịch Mã
  const dichMaMap: Record<DiaChi, DiaChi> = {
    Thân: 'Dần', Tý: 'Dần', Thìn: 'Dần',
    Dần: 'Thân', Ngọ: 'Thân', Tuất: 'Thân',
    Tỵ: 'Hợi', Dậu: 'Hợi', Sửu: 'Hợi',
    Hợi: 'Tỵ', Mão: 'Tỵ', Mùi: 'Tỵ',
  };
  if ((dayBranch && dichMaMap[dayBranch] === pillarBranch) || dichMaMap[yearBranch] === pillarBranch) {
    stars.push('Trạch Mã');
  }

  // 9. Đào Hoa
  const daoHoaMap: Record<DiaChi, DiaChi> = {
    Thân: 'Dậu', Tý: 'Dậu', Thìn: 'Dậu',
    Dần: 'Mão', Ngọ: 'Mão', Tuất: 'Mão',
    Tỵ: 'Ngọ', Dậu: 'Ngọ', Sửu: 'Ngọ',
    Hợi: 'Tý', Mão: 'Tý', Mùi: 'Tý',
  };
  if ((dayBranch && daoHoaMap[dayBranch] === pillarBranch) || daoHoaMap[yearBranch] === pillarBranch) {
    stars.push('Đào Hoa');
  }

  return Array.from(new Set(stars));
}

/** Main Deterministic Bát Tự Calculation Engine */
export function calculateBazi(input: BaziInput): BaziEnvelope {
  const {
    fullName,
    gender,
    day,
    month,
    year,
    hour,
    minute,
    focusYear = 2026,
    oneHundredYears = false,
  } = input;

  // 1. Julian Day Number & Solar Longitude at Birth
  const birthJdn =
    gregorianToJdn(year, month, day) + (hour + minute / 60 - 7.0) / 24;
  const sunLong = getSunLongitude(birthJdn);

  // 2. Year Pillar Boundary Rule: Transitions at exact Lập Xuân (315°)
  // If birth in Jan/Feb has sunLong < 315°, Year Pillar belongs to (year - 1)
  let astroYear = year;
  if (month <= 2 && sunLong < 315) {
    astroYear = year - 1;
  }
  const yearCanIndex = (astroYear + 6) % 10;
  const yearChiIndex = (astroYear + 8) % 12;
  const yearStem = THIEN_CAN[yearCanIndex];
  const yearBranch = DIA_CHI[yearChiIndex];

  // 3. Month Pillar Boundary Rule: Exact 12 Jie (Solar Terms)
  // Normalized angle starting from Lap Xuan (315°)
  let angleFromLapXuan = sunLong - 315;
  if (angleFromLapXuan < 0) angleFromLapXuan += 360;
  const monthOrderIndex = Math.floor(angleFromLapXuan / 30); // 0 = Dan, 1 = Mao, ..., 11 = Suu
  const monthBranch = MONTH_BRANCH_NAMES[monthOrderIndex];
  const monthChiIndex = DIA_CHI.indexOf(monthBranch);

  // Ngu Ho Don for Month Stem:
  // Giap/Ky -> Binh(2); At/Canh -> Mau(4); Binh/Tan -> Canh(6); Dinh/Nham -> Nham(8); Mau/Quy -> Giap(0)
  const monthStartCan = ((yearCanIndex % 5) * 2 + 2) % 10;
  const monthStem = THIEN_CAN[(monthStartCan + monthOrderIndex) % 10];

  // 4. Day Pillar Boundary Rule: Changes strictly at 23:00 (Dạ Tý)
  let dayJdn = gregorianToJdn(year, month, day);
  if (hour >= 23) {
    dayJdn += 1;
  }
  const dayCanIndex = (dayJdn + 9) % 10;
  const dayChiIndex = (dayJdn + 1) % 12;
  const dayStem = THIEN_CAN[dayCanIndex];
  const dayBranch = DIA_CHI[dayChiIndex];

  // 5. Hour Pillar: 12 double-hours, Day Stem governs start via Ngu Thu Don
  const hourBranchIndex = Math.floor(((hour + 1) % 24) / 2);
  const hourBranch = DIA_CHI[hourBranchIndex];
  const hourCanStart = ((dayCanIndex % 5) * 2) % 10;
  const hourStem = THIEN_CAN[(hourCanStart + hourBranchIndex) % 10];

  // 6. Day Master
  const dayMaster = dayStem;
  const dmElement = STEM_ELEMENTS[dayMaster];

  // 7. Assemble Pillars Data
  const makePillar = (
    name: string,
    solarValue: string,
    stem: ThienCan,
    branch: DiaChi,
    isDay: boolean = false
  ): PillarData => {
    const stemTenGod = isDay ? 'NHẬT CHỦ' : getTenGod(dayMaster, stem);
    const hidden = HIDDEN_STEMS[branch].map(h => ({
      stem: h.stem,
      element: STEM_ELEMENTS[h.stem],
      tenGod: getTenGod(dayMaster, h.stem),
      percentage: h.percentage,
    }));
    const stars = calculateStars(
      branch,
      dayMaster,
      yearBranch,
      monthBranch,
      yearStem,
      dayBranch,
      dayStem,
      stem
    );

    return {
      name,
      solarValue,
      stem,
      branch,
      stemTenGod,
      stemElement: STEM_ELEMENTS[stem],
      branchElement: BRANCH_ELEMENTS[branch],
      hiddenStems: hidden,
      stars,
    };
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const pillars = {
    year: makePillar('NĂM', `${year}`, yearStem, yearBranch),
    month: makePillar('THÁNG', pad(month), monthStem, monthBranch),
    day: makePillar('NGÀY', pad(day), dayStem, dayBranch, true),
    hour: makePillar('GIỜ', `${pad(hour)}:${pad(minute)}`, hourStem, hourBranch),
  };

  // 8. Major Luck (Đại Vận) Calculation
  const isYangYear = (yearCanIndex % 2) === 0;
  const isForward = gender ? isYangYear : !isYangYear; // Dương Nam/Âm Nữ = Thuận; Âm Nam/Dương Nữ = Nghịch

  // Target Solar Term angle:
  // Forward -> Next Jie angle
  // Backward -> Current Jie angle
  const curJieAngle = JIE_ANGLES[monthOrderIndex];
  const nextJieAngle = JIE_ANGLES[(monthOrderIndex + 1) % 12];

  let prevJieJdn = findSolarTermInstant(year, curJieAngle);
  if (prevJieJdn > (birthJdn + 7 / 24)) {
    prevJieJdn = findSolarTermInstant(year - 1, curJieAngle);
  }

  let nextJieJdn = findSolarTermInstant(year, nextJieAngle);
  if (nextJieJdn < (birthJdn + 7 / 24)) {
    nextJieJdn = findSolarTermInstant(year + 1, nextJieAngle);
  }

  // Calculate local birth instant for matching reference calculation
  const birthLocalInstant = gregorianToJdn(year, month, day) + (hour + minute / 60) / 24 - 0.5;

  const diffDays = isForward
    ? Math.max(0, nextJieJdn - birthLocalInstant)
    : Math.max(0, birthLocalInstant - prevJieJdn);

  // Conversion: 3 days = 1 year, 1 day = 4 months (120 days), 1 hour = 5 days
  const totalMonths = (diffDays / 3) * 12;
  const startAgeYears = Math.floor(totalMonths / 12);
  const startAgeMonths = Math.round(totalMonths % 12);
  const calcValue = diffDays;

  // Major Luck Pillars (up to 10 pillars for 100 years)
  const majorLuckPillars: MajorLuckPillar[] = [];
  const monthStemIndex = THIEN_CAN.indexOf(monthStem);
  const numPillars = oneHundredYears ? 10 : 8;

  // Nominal start age = real start age + 1 (tuổi mụ)
  const nominalStartAge = Math.max(1, startAgeYears + 1);
  const startYear = year + startAgeYears;

  for (let i = 1; i <= numPillars; i++) {
    const step = isForward ? i : -i;
    const pStemIdx = (monthStemIndex + step + 100) % 10;
    const pChiIdx = (monthChiIndex + step + 120) % 12;
    const pStem = THIEN_CAN[pStemIdx];
    const pBranch = DIA_CHI[pChiIdx];
    const pStartAge = nominalStartAge + (i - 1) * 10;
    const pEndAge = pStartAge + 9;
    const pYear = startYear + (i - 1) * 10;

    // 10 Annual Years (Lưu Niên) within this Major Luck pillar
    const annualYears = [];
    for (let y = 0; y < 10; y++) {
      const curY = pYear + y;
      const curAge = pStartAge + y;
      const aCan = THIEN_CAN[(curY + 6) % 10];
      const aChi = DIA_CHI[(curY + 8) % 12];
      annualYears.push({
        year: curY,
        age: curAge,
        stem: aCan,
        branch: aChi,
        isFocusYear: curY === focusYear,
      });
    }

    majorLuckPillars.push({
      index: i,
      stem: pStem,
      branch: pBranch,
      tenGod: getTenGod(dayMaster, pStem),
      startAge: pStartAge,
      endAge: pEndAge,
      startYearMonth: `${pad(startAgeMonths + 1)}/${pYear}`,
      annualYears,
    });
  }

  // 9. Quantitative Ngũ Hành Scoring
  const elementsScore: Record<NguhanhType, number> = {
    Kim: 0,
    Mộc: 0,
    Thủy: 0,
    Hỏa: 0,
    Thổ: 0,
  };

  // Stems: 100 pts each
  elementsScore[STEM_ELEMENTS[yearStem]] += 100;
  elementsScore[STEM_ELEMENTS[monthStem]] += 100;
  elementsScore[STEM_ELEMENTS[dayStem]] += 100;
  elementsScore[STEM_ELEMENTS[hourStem]] += 100;

  // Month Branch: 300 pts season ruler
  elementsScore[BRANCH_ELEMENTS[monthBranch]] += 300;

  // Hidden Stems: weighted
  [yearBranch, monthBranch, dayBranch, hourBranch].forEach(b => {
    HIDDEN_STEMS[b].forEach(h => {
      elementsScore[STEM_ELEMENTS[h.stem]] += h.percentage;
    });
  });

  const totalScore = Object.values(elementsScore).reduce((a, b) => a + b, 0);
  const dmScore = elementsScore[dmElement];
  const dmPercent = Math.round((dmScore / totalScore) * 100);

  const strength: 'Thân Vượng' | 'Thân Nhược' | 'Trung Hòa' =
    dmPercent >= 42 ? 'Thân Vượng' : dmPercent <= 28 ? 'Thân Nhược' : 'Trung Hòa';

  // Determine Dụng Thần & Hỷ Thần
  // Sorted by score
  const sortedElements = (Object.keys(elementsScore) as NguhanhType[]).sort(
    (a, b) => elementsScore[a] - elementsScore[b]
  );

  let dungThan: NguhanhType = sortedElements[0]; // Lowest element by default
  let hyThan: NguhanhType = sortedElements[1];
  let kyThan: NguhanhType = sortedElements[sortedElements.length - 1]; // Highest element

  if (strength === 'Thân Nhược') {
    // Needs generation (Ấn) or assistance (Tỷ)
    const generators: Record<NguhanhType, NguhanhType> = {
      Mộc: 'Thủy', Hỏa: 'Mộc', Thổ: 'Hỏa', Kim: 'Thổ', Thủy: 'Kim'
    };
    dungThan = generators[dmElement];
    hyThan = dmElement;
  }

  // Lunar date representation
  const lunar = solarToLunar(year, month, day);
  const lunarDateStr = `${pad(hour)}:${pad(minute)} ${pad(lunar.day)}/${pad(lunar.month)}/${lunar.year}${lunar.isLeap ? ' (Nhuận)' : ''}`;
  const solarDateStr = `${pad(hour)}:${pad(minute)} ${pad(day)}/${pad(month)}/${year}`;
  const canChiYearStr = `${yearStem} ${yearBranch}`;
  const napAm = NAP_AM[canChiYearStr] ?? 'Sa Trung Kim';

  // Gender label
  const genderLabel = gender
    ? isYangYear ? 'Dương Nam' : 'Âm Nam'
    : isYangYear ? 'Dương Nữ' : 'Âm Nữ';

  // Formatting solar terms in UTC matching standard reference
  const curJDate = new Date((prevJieJdn - 2440587.5) * 86400000);
  const nextJDate = new Date((nextJieJdn - 2440587.5) * 86400000);

  const formatTermDate = (d: Date) => {
    const dd = pad(d.getUTCDate());
    const mm = pad(d.getUTCMonth() + 1);
    const yyyy = d.getUTCFullYear();
    const hh = pad(d.getUTCHours());
    const min = pad(d.getUTCMinutes());
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  };

  const calculationResult: BaziCalculationResult = {
    personal: {
      fullName: fullName.toUpperCase(),
      genderLabel,
      solarDateStr,
      lunarDateStr,
      napAm,
    },
    pillars,
    dayMaster: {
      stem: dayMaster,
      element: dmElement,
      strength,
      percentage: dmPercent,
    },
    solarTerms: {
      currentTerm: JIE_NAMES[monthOrderIndex],
      currentStart: formatTermDate(curJDate),
      nextTerm: JIE_NAMES[(monthOrderIndex + 1) % 12],
      nextStart: formatTermDate(nextJDate),
    },
    majorLuck: {
      direction: isForward ? 'Thuận' : 'Nghịch',
      calcValue,
      startAgeYears,
      startAgeMonths,
      pillars: majorLuckPillars,
    },
  };

  const interpretationResult: BaziInterpretationResult = {
    elementsScore,
    dungThan,
    hyThan,
    kyThan,
    recommendations: {
      favorableColors:
        dungThan === 'Kim' ? ['Trắng', 'Xám', 'Bạc'] :
        dungThan === 'Mộc' ? ['Xanh lá cây', 'Xanh lục'] :
        dungThan === 'Thủy' ? ['Đen', 'Xanh nước biển', 'Xanh lam'] :
        dungThan === 'Hỏa' ? ['Đỏ', 'Hồng', 'Tím', 'Cam'] :
        ['Vàng', 'Nâu đất', 'Cà phê'],
      favorableDirections:
        dungThan === 'Kim' ? ['Tây', 'Tây Bắc'] :
        dungThan === 'Mộc' ? ['Đông', 'Đông Nam'] :
        dungThan === 'Thủy' ? ['Bắc'] :
        dungThan === 'Hỏa' ? ['Nam'] :
        ['Trung Cung', 'Đông Bắc', 'Tây Nam'],
      favorableGemstones:
        dungThan === 'Kim' ? ['Thạch anh trắng', 'Kim cương', 'Đá mặt trăng'] :
        dungThan === 'Mộc' ? ['Gỗ trầm hương', 'Ngọc bích', 'Thạch anh dâu tây xanh'] :
        dungThan === 'Thủy' ? ['Thạch anh đen', 'Đá obsidian', 'Lam ngọc'] :
        dungThan === 'Hỏa' ? ['Thạch anh hồng', 'Garnet ngọc hồng lựu', 'Ruby'] :
        ['Thạch anh vàng', 'Mắt hổ vàng', 'Ngọc hoàng long'],
      summary: `Mệnh chủ ${strength}, ngũ hành Dụng Thần cần bổ trợ là hành ${dungThan}, Hỷ Thần là hành ${hyThan}. Cần hạn chế hành ${kyThan} để cân bằng sinh khắc của Bát Tự.`,
    },
  };

  const inputHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(input))
    .digest('hex');

  return {
    engine: 'bazi',
    engineVersion: '1.0.0',
    methodology: 'tu-binh-manh-phai-v1',
    calendarVersion: '1.0.0',
    timezonePolicy: 'UTC+07-fixed',
    calculatedAt: new Date().toISOString(),
    inputHash,
    input,
    calculation: calculationResult,
    interpretation: interpretationResult,
  };
}
