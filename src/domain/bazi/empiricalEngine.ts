import { Solar, Lunar } from 'lunar-javascript';

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
export type CanType = typeof CAN[number];

export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;
export type ChiType = typeof CHI[number];

export const HAN_CHARS: Record<string, string> = {
  'Giáp': '甲', 'Ất': '乙', 'Bính': '丙', 'Đinh': '丁', 'Mậu': '戊',
  'Kỷ': '己', 'Canh': '庚', 'Tân': '辛', 'Nhâm': '壬', 'Quý': '癸',
  'Tý': '子', 'Sửu': '丑', 'Dần': '寅', 'Mão': '卯', 'Thìn': '辰',
  'Tỵ': '巳', 'Ngọ': '午', 'Mùi': '未', 'Thân': '申', 'Dậu': '酉',
  'Tuất': '戌', 'Hợi': '亥'
};

export const HAN_TO_VIET: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn',
  '巳': 'Tỵ', '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu',
  '戌': 'Tuất', '亥': 'Hợi'
};

export const ELEMENTS: Record<string, 'Mộc' | 'Hỏa' | 'Thổ' | 'Kim' | 'Thủy'> = {
  'Giáp': 'Mộc', 'Ất': 'Mộc',
  'Bính': 'Hỏa', 'Đinh': 'Hỏa',
  'Mậu': 'Thổ', 'Kỷ': 'Thổ',
  'Canh': 'Kim', 'Tân': 'Kim',
  'Nhâm': 'Thủy', 'Quý': 'Thủy',
  'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc',
  'Thìn': 'Thổ', 'Tỵ': 'Hỏa', 'Ngọ': 'Hỏa', 'Mùi': 'Thổ',
  'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
};

export const COLORS = {
  Moc: '#009e49',
  Hoa: '#e31d1a',
  Tho: '#b8860b',
  Kim: '#8e949f',
  Thuy: '#1b73f8'
};

export const GENDER_MAP: Record<string, string> = {
  male: 'Nam',
  female: 'Nữ'
};

export const HIDDEN_STEMS: Record<string, string[]> = {
  'Tý': ['Quý'],
  'Sửu': ['Kỷ', 'Quý', 'Tân'],
  'Dần': ['Giáp', 'Bính', 'Mậu'],
  'Mão': ['Ất'],
  'Thìn': ['Mậu', 'Ất', 'Quý'],
  'Tỵ': ['Bính', 'Mậu', 'Canh'],
  'Ngọ': ['Đinh', 'Kỷ'],
  'Mùi': ['Kỷ', 'Đinh', 'Ất'],
  'Thân': ['Canh', 'Nhâm', 'Mậu'],
  'Dậu': ['Tân'],
  'Tuất': ['Mậu', 'Tân', 'Đinh'],
  'Hợi': ['Nhâm', 'Giáp']
};

export const NAP_AM: Record<string, string> = {
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
  'Giáp Thìn': 'Phú Đăng Hỏa', 'Ất Tỵ': 'Phú Đăng Hỏa',
  'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy',
  'Mậu Thân': 'Đại Dịch Thổ', 'Kỷ Dậu': 'Đại Dịch Thổ',
  'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
  'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc',
  'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
  'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ',
  'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
  'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc',
  'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy'
};

// 10 Thần (Ten Gods)
const STEM_YIN_YANG: Record<string, boolean> = {
  'Giáp': true, 'Ất': false,
  'Bính': true, 'Đinh': false,
  'Mậu': true, 'Kỷ': false,
  'Canh': true, 'Tân': false,
  'Nhâm': true, 'Quý': false
};

const ELEMENT_CYCLE = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'] as const;

export function getTenGod(dayMaster: string, targetStem: string, isTuTru: boolean = false): string {
  if (!dayMaster || !targetStem) return '';
  if (dayMaster === targetStem && !isTuTru) return 'Tỷ';

  const dmElem = ELEMENTS[dayMaster];
  const targetElem = ELEMENTS[targetStem];
  if (!dmElem || !targetElem) return '';

  const dmYinYang = STEM_YIN_YANG[dayMaster];
  const targetYinYang = STEM_YIN_YANG[targetStem];
  const sameYinYang = dmYinYang === targetYinYang;

  const dmIdx = ELEMENT_CYCLE.indexOf(dmElem);
  const targetIdx = ELEMENT_CYCLE.indexOf(targetElem);
  const diff = (targetIdx - dmIdx + 5) % 5;

  switch (diff) {
    case 0:
      return sameYinYang ? 'Tỷ' : 'Kiếp';
    case 1:
      return sameYinYang ? 'Thực' : 'Thương';
    case 2:
      return sameYinYang ? 'T.Tài' : 'Tài';
    case 3:
      return sameYinYang ? 'Sát' : 'Quan';
    case 4:
      return sameYinYang ? 'Kiêu' : 'Ấn';
    default:
      return '';
  }
}

export function getHoaSonBranchTenGod(dayMaster: string, branch: string): string {
  const hidden = HIDDEN_STEMS[branch];
  if (!hidden || hidden.length === 0) return '';
  return getTenGod(dayMaster, hidden[0], true);
}

// 12 Tràng Sinh (12 Chang Sheng Stages)
const CHANG_SHENG_ORDER = [
  'Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng',
  'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'
];

const CHANG_SHENG_START_BRANCH: Record<string, string> = {
  'Giáp': 'Hợi', // Dương Mộc thuận
  'Ất': 'Ngọ',   // Âm Mộc nghịch
  'Bính': 'Dần', // Dương Hỏa thuận
  'Đinh': 'Dậu', // Âm Hỏa nghịch
  'Mậu': 'Dần', // Dương Thổ thuận
  'Kỷ': 'Dậu',   // Âm Thổ nghịch
  'Canh': 'Tỵ',  // Dương Kim thuận
  'Tân': 'Tý',   // Âm Kim nghịch
  'Nhâm': 'Thân', // Dương Thủy thuận
  'Quý': 'Mão'   // Âm Thủy nghịch
};

export function getChangSheng(dayMaster: string, branch: string): string {
  const startBranch = CHANG_SHENG_START_BRANCH[dayMaster];
  if (!startBranch) return '';

  const branchIdx = CHI.indexOf(branch as ChiType);
  const startIdx = CHI.indexOf(startBranch as ChiType);
  if (branchIdx === -1 || startIdx === -1) return '';

  const isYang = STEM_YIN_YANG[dayMaster] ?? true;
  let stageIdx: number;
  if (isYang) {
    stageIdx = (branchIdx - startIdx + 12) % 12;
  } else {
    stageIdx = (startIdx - branchIdx + 12) % 12;
  }

  return CHANG_SHENG_ORDER[stageIdx] || '';
}

// Thần Sát (Shen Sha Stars)
export function isDuongNhan(dayMaster: string, branch: string): boolean {
  const map: Record<string, string> = {
    'Giáp': 'Mão', 'Ất': 'Thìn', 'Bính': 'Ngọ', 'Đinh': 'Mùi', 'Mậu': 'Ngọ',
    'Kỷ': 'Mùi', 'Canh': 'Dậu', 'Tân': 'Tuất', 'Nhâm': 'Tý', 'Quý': 'Sửu'
  };
  return map[dayMaster] === branch;
}

export function isLocThan(dayMaster: string, branch: string): boolean {
  const map: Record<string, string> = {
    'Giáp': 'Dần', 'Ất': 'Mão', 'Bính': 'Tỵ', 'Đinh': 'Ngọ', 'Mậu': 'Tỵ',
    'Kỷ': 'Ngọ', 'Canh': 'Thân', 'Tân': 'Dậu', 'Nhâm': 'Hợi', 'Quý': 'Tý'
  };
  return map[dayMaster] === branch;
}

export function isAmDuongLech(stem: string, branch: string): boolean {
  const list = [
    'Bính Tý', 'Đinh Sửu', 'Mậu Dần', 'Tân Mão', 'Nhâm Thìn', 'Quý Tỵ',
    'Bính Ngọ', 'Đinh Mùi', 'Mậu Thân', 'Tân Dậu', 'Nhâm Tuất', 'Quý Hợi'
  ];
  return list.includes(`${stem} ${branch}`);
}

export function calculateTargetBranchShenSha(
  branch: string,
  natal: {
    yearStem: string; yearBranch: string;
    monthStem: string; monthBranch: string;
    dayStem: string; dayBranch: string;
    hourStem: string; hourBranch: string;
  },
  _targetType: 'luck' | 'annual' | 'tieuvan' = 'luck',
  targetStem: string = '',
  _isTuTru: boolean = false
): string[] {
  const stars: string[] = [];

  // Dịch Mã (dựa theo Chi Năm / Chi Ngày)
  const dimaCheck = (b: string) => {
    if (['Thân', 'Tý', 'Thìn'].includes(b)) return 'Dần';
    if (['Dần', 'Ngọ', 'Tuất'].includes(b)) return 'Thân';
    if (['Tỵ', 'Dậu', 'Sửu'].includes(b)) return 'Hợi';
    if (['Hợi', 'Mão', 'Mùi'].includes(b)) return 'Tỵ';
    return '';
  };
  if (branch === dimaCheck(natal.yearBranch) || branch === dimaCheck(natal.dayBranch)) {
    stars.push('Dịch Mã');
  }

  // Đào Hoa
  const daohoaCheck = (b: string) => {
    if (['Thân', 'Tý', 'Thìn'].includes(b)) return 'Dậu';
    if (['Dần', 'Ngọ', 'Tuất'].includes(b)) return 'Mão';
    if (['Tỵ', 'Dậu', 'Sửu'].includes(b)) return 'Ngọ';
    if (['Hợi', 'Mão', 'Mùi'].includes(b)) return 'Tý';
    return '';
  };
  if (branch === daohoaCheck(natal.yearBranch) || branch === daohoaCheck(natal.dayBranch)) {
    stars.push('Đào Hoa');
  }

  // Hoa Cái
  const hoacaiCheck = (b: string) => {
    if (['Thân', 'Tý', 'Thìn'].includes(b)) return 'Thìn';
    if (['Dần', 'Ngọ', 'Tuất'].includes(b)) return 'Tuất';
    if (['Tỵ', 'Dậu', 'Sửu'].includes(b)) return 'Sửu';
    if (['Hợi', 'Mão', 'Mùi'].includes(b)) return 'Mùi';
    return '';
  };
  if (branch === hoacaiCheck(natal.yearBranch) || branch === hoacaiCheck(natal.dayBranch)) {
    stars.push('Hoa Cái');
  }

  // Tướng Tinh
  const tuongtinhCheck = (b: string) => {
    if (['Thân', 'Tý', 'Thìn'].includes(b)) return 'Tý';
    if (['Dần', 'Ngọ', 'Tuất'].includes(b)) return 'Ngọ';
    if (['Tỵ', 'Dậu', 'Sửu'].includes(b)) return 'Dậu';
    if (['Hợi', 'Mão', 'Mùi'].includes(b)) return 'Mão';
    return '';
  };
  if (branch === tuongtinhCheck(natal.yearBranch) || branch === tuongtinhCheck(natal.dayBranch)) {
    stars.push('Tướng Tinh');
  }

  // Kiếp Sát
  const kiepsatCheck = (b: string) => {
    if (['Thân', 'Tý', 'Thìn'].includes(b)) return 'Tỵ';
    if (['Dần', 'Ngọ', 'Tuất'].includes(b)) return 'Hợi';
    if (['Tỵ', 'Dậu', 'Sửu'].includes(b)) return 'Dần';
    if (['Hợi', 'Mão', 'Mùi'].includes(b)) return 'Thân';
    return '';
  };
  if (branch === kiepsatCheck(natal.yearBranch) || branch === kiepsatCheck(natal.dayBranch)) {
    stars.push('Kiếp Sát');
  }

  // Thiên Ất Quý Nhân (theo Nhật Can / Niên Can)
  const quynhanMap: Record<string, string[]> = {
    'Giáp': ['Sửu', 'Mùi'], 'Mậu': ['Sửu', 'Mùi'], 'Canh': ['Sửu', 'Mùi'],
    'Ất': ['Tý', 'Thân'], 'Kỷ': ['Tý', 'Thân'],
    'Bính': ['Hợi', 'Dậu'], 'Đinh': ['Hợi', 'Dậu'],
    'Nhâm': ['Tỵ', 'Mão'], 'Quý': ['Tỵ', 'Mão'],
    'Tân': ['Ngọ', 'Dần']
  };
  const qnDay = quynhanMap[natal.dayStem] || [];
  const qnYear = quynhanMap[natal.yearStem] || [];
  if (qnDay.includes(branch) || qnYear.includes(branch)) {
    stars.push('Quý Nhân');
  }

  // Văn Xương
  const vanxuongMap: Record<string, string> = {
    'Giáp': 'Tỵ', 'Ất': 'Ngọ', 'Bính': 'Thân', 'Đinh': 'Dậu', 'Mậu': 'Thân',
    'Kỷ': 'Dậu', 'Canh': 'Hợi', 'Tân': 'Tý', 'Nhâm': 'Dần', 'Quý': 'Mão'
  };
  if (branch === vanxuongMap[natal.dayStem] || branch === vanxuongMap[natal.yearStem]) {
    stars.push('Văn Xương');
  }

  // Lộc Thần & Dương Nhẫn
  if (isLocThan(natal.dayStem, branch)) stars.push('Lộc Thần');
  if (isDuongNhan(natal.dayStem, branch)) stars.push('Dương Nhẫn');

  // Không Vong (Tuần Không của Trụ Ngày)
  const getXunKong = (stem: string, b: string): string[] => {
    const sIdx = CAN.indexOf(stem as CanType);
    const bIdx = CHI.indexOf(b as ChiType);
    if (sIdx === -1 || bIdx === -1) return [];
    const diff = (bIdx - sIdx + 12) % 12;
    return [CHI[(diff + 10) % 12], CHI[(diff + 11) % 12]];
  };
  const dayKong = getXunKong(natal.dayStem, natal.dayBranch);
  if (dayKong.includes(branch)) {
    stars.push('Không Vong');
  }

  // Âm Dương Lệch
  if (targetStem && isAmDuongLech(targetStem, branch)) {
    stars.push('Âm Dương Lệch');
  }

  return Array.from(new Set(stars));
}

// Bazi Calculation Function
export interface EmpiricalPillar {
  stem: string;
  branch: string;
  tenGod: string;
  hiddenStems: Array<{ stem: string; tenGod: string }>;
  stars: string[];
  changSheng: string;
  napAm: string;
}

export interface EmpiricalLuckCycle {
  index: number;
  age: number;
  year: number;
  stem: string;
  branch: string;
  tenGod: string;
  napAm: string;
  changSheng: string;
}

export interface EmpiricalAnnualPillar {
  year: number;
  age: number;
  stem: string;
  branch: string;
  tenGod: string;
  napAm: string;
  isFocusYear?: boolean;
}

export interface EmpiricalTieuVanPillar {
  year: number;
  age: number;
  stem: string;
  branch: string;
  tenGod: string;
  napAm: string;
}

export interface EmpiricalMonthlyPillar {
  monthIndex: number; // 1 - 12
  monthName: string;
  stem: string;
  branch: string;
  tenGod: string;
  napAm: string;
  solarTermName: string;
  solarTermDate: string;
}

export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  _timezone: number = 7,
  gender: 'male' | 'female' = 'male',
  isLunarInput: boolean = false,
  isLeapMonth: boolean = false
) {
  const solar = isLunarInput
    ? Lunar.fromYmdHms(year, isLeapMonth ? -month : month, day, hour, minute, 0).getSolar()
    : Solar.fromYmdHms(year, month, day, hour, minute, 0);

  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const toViet = (char: string) => HAN_TO_VIET[char] || char;

  const yearStem = toViet(eightChar.getYearGan());
  const yearBranch = toViet(eightChar.getYearZhi());
  const monthStem = toViet(eightChar.getMonthGan());
  const monthBranch = toViet(eightChar.getMonthZhi());
  const dayStem = toViet(eightChar.getDayGan());
  const dayBranch = toViet(eightChar.getDayZhi());
  const hourStem = toViet(eightChar.getTimeGan());
  const hourBranch = toViet(eightChar.getTimeZhi());

  const natalInfo = {
    yearStem, yearBranch,
    monthStem, monthBranch,
    dayStem, dayBranch,
    hourStem, hourBranch
  };

  const buildPillar = (stem: string, branch: string, isDay: boolean = false): EmpiricalPillar => {
    const hidden = HIDDEN_STEMS[branch] || [];
    return {
      stem,
      branch,
      tenGod: isDay ? 'NHẬT CHỦ' : getTenGod(dayStem, stem),
      hiddenStems: hidden.map(h => ({ stem: h, tenGod: getTenGod(dayStem, h) })),
      stars: calculateTargetBranchShenSha(branch, natalInfo, 'luck', stem),
      changSheng: getChangSheng(dayStem, branch),
      napAm: NAP_AM[`${stem} ${branch}`] || ''
    };
  };

  const pillars = {
    year: buildPillar(yearStem, yearBranch),
    month: buildPillar(monthStem, monthBranch),
    day: buildPillar(dayStem, dayBranch, true),
    hour: buildPillar(hourStem, hourBranch)
  };

  // Mệnh Quái (Cung phi bát trạch)
  const mingGua = eightChar.getYun(gender === 'male' ? 1 : 0);

  return {
    pillars,
    mingGua,
    solarDateStr: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    lunarDateStr: `${lunar.getDay().toString().padStart(2, '0')}-${lunar.getMonth().toString().padStart(2, '0')}-${lunar.getYear()}`
  };
}

export function calculateLuckCycles(
  yearStem: string,
  _monthStem: string,
  _monthBranch: string,
  gender: 'male' | 'female',
  birthDate: Date,
  dayStem: string,
  _timezone: number = 7
) {
  const solar = Solar.fromDate(birthDate);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  const isMale = gender === 'male';
  const yun = eightChar.getYun(isMale ? 1 : 0);

  const startYearNum = yun.getStartYear();
  const startMonthNum = yun.getStartMonth();
  const startDayNum = yun.getStartDay();
  const startSolar = yun.getStartSolar();
  const startSolarStr = startSolar ? `${startSolar.getDay().toString().padStart(2, '0')}/${startSolar.getMonth().toString().padStart(2, '0')}/${startSolar.getYear()}` : '';

  const initiationInfo = `${startYearNum} tuổi ${startMonthNum} tháng ${startDayNum} ngày${startSolarStr ? ` - ${startSolarStr}` : ''}`;

  const daYunList = yun.getDaYun();
  const cycles: EmpiricalLuckCycle[] = [];

  for (let i = 0; i < daYunList.length && cycles.length < 10; i++) {
    const dy = daYunList[i];
    const gz = dy.getGanZhi();
    if (!gz || gz.length < 2) continue; // skip pre-luck if empty

    const stem = HAN_TO_VIET[gz[0]] || gz[0];
    const branch = HAN_TO_VIET[gz[1]] || gz[1];
    cycles.push({
      index: cycles.length,
      age: dy.getStartAge(),
      year: dy.getStartYear(),
      stem,
      branch,
      tenGod: getTenGod(dayStem, stem),
      napAm: NAP_AM[`${stem} ${branch}`] || '',
      changSheng: getChangSheng(dayStem, branch)
    });
  }

  return { cycles, initiationInfo };
}

export function calculateAnnualPillars(
  _birthYear: number,
  dayStem: string,
  count: number = 10,
  startYear: number
): EmpiricalAnnualPillar[] {
  const annuals: EmpiricalAnnualPillar[] = [];
  for (let i = 0; i < count; i++) {
    const currentYear = startYear + i;
    const canIdx = (currentYear - 4) % 10 < 0 ? (currentYear - 4) % 10 + 10 : (currentYear - 4) % 10;
    const chiIdx = (currentYear - 4) % 12 < 0 ? (currentYear - 4) % 12 + 12 : (currentYear - 4) % 12;

    const stem = CAN[canIdx];
    const branch = CHI[chiIdx];
    annuals.push({
      year: currentYear,
      age: 0, // will be computed in caller
      stem,
      branch,
      tenGod: getTenGod(dayStem, stem),
      napAm: NAP_AM[`${stem} ${branch}`] || ''
    });
  }
  return annuals;
}

export function calculateTieuVanPillars(
  hourStem: string,
  hourBranch: string,
  yearStem: string,
  gender: 'male' | 'female',
  birthYear: number,
  annuals: EmpiricalAnnualPillar[]
): EmpiricalTieuVanPillar[] {
  const isYangYear = STEM_YIN_YANG[yearStem] ?? true;
  const isMale = gender === 'male';
  // Dương Nam hoặc Âm Nữ: thuận (+1), Âm Nam hoặc Dương Nữ: nghịch (-1)
  const direction = (isYangYear && isMale) || (!isYangYear && !isMale) ? 1 : -1;

  const hourCanIdx = CAN.indexOf(hourStem as CanType);
  const hourChiIdx = CHI.indexOf(hourBranch as ChiType);

  return annuals.map(ann => {
    const age = Math.max(0, ann.year - birthYear);
    let canIdx = (hourCanIdx + direction * age) % 10;
    if (canIdx < 0) canIdx += 10;
    let chiIdx = (hourChiIdx + direction * age) % 12;
    if (chiIdx < 0) chiIdx += 12;

    const stem = CAN[canIdx];
    const branch = CHI[chiIdx];

    return {
      year: ann.year,
      age: age + 1, // Tuổi mụ
      stem,
      branch,
      tenGod: '', // computed compared to Day Master
      napAm: NAP_AM[`${stem} ${branch}`] || ''
    };
  });
}

export function calculateMonthlyPillars(
  year: number,
  _timezone: number = 7
): EmpiricalMonthlyPillar[] {
  // Can Chi của 12 tháng theo Ngũ Hổ Độn
  const yearCanIdx = (year - 4) % 10 < 0 ? (year - 4) % 10 + 10 : (year - 4) % 10;
  const yearCan = CAN[yearCanIdx];

  const firstMonthStemMap: Record<string, string> = {
    'Giáp': 'Bính', 'Kỷ': 'Bính',
    'Ất': 'Mậu', 'Canh': 'Mậu',
    'Bính': 'Canh', 'Tân': 'Canh',
    'Đinh': 'Nhâm', 'Nhâm': 'Nhâm',
    'Mậu': 'Giáp', 'Quý': 'Giáp'
  };

  const startStem = firstMonthStemMap[yearCan] || 'Bính';
  const startStemIdx = CAN.indexOf(startStem as CanType);
  const startBranchIdx = CHI.indexOf('Dần'); // Tháng 1 luôn là Dần

  const months: EmpiricalMonthlyPillar[] = [];
  const solarTermNames = [
    'Lập Xuân', 'Kinh Trập', 'Thanh Minh', 'Lập Hạ',
    'Mang Chủng', 'Tiểu Thử', 'Lập Thu', 'Bạch Lộ',
    'Hàn Lộ', 'Lập Đông', 'Đại Tuyết', 'Tiểu Hàn'
  ];

  for (let i = 0; i < 12; i++) {
    const sIdx = (startStemIdx + i) % 10;
    const bIdx = (startBranchIdx + i) % 12;
    const stem = CAN[sIdx];
    const branch = CHI[bIdx];

    months.push({
      monthIndex: i + 1,
      monthName: `Tháng ${i + 1}`,
      stem,
      branch,
      tenGod: '',
      napAm: NAP_AM[`${stem} ${branch}`] || '',
      solarTermName: solarTermNames[i] || '',
      solarTermDate: `${year}`
    });
  }

  return months;
}

// Storage Helper
export const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('safeStorage setItem error', e);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('safeStorage removeItem error', e);
    }
  }
};
