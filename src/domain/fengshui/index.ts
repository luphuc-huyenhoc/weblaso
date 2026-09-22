import { NguhanhType } from '../calendar/index';

export * from './flyingStars';

export type QuaiMenh =
  | 'Khảm'
  | 'Ly'
  | 'Cấn'
  | 'Đoài'
  | 'Càn'
  | 'Khôn'
  | 'Tốn'
  | 'Chấn';

export type Direction8 =
  | 'Bắc'
  | 'Đông Bắc'
  | 'Đông'
  | 'Đông Nam'
  | 'Nam'
  | 'Tây Nam'
  | 'Tây'
  | 'Tây Bắc';

export type BatTrachStar =
  | 'Sinh Khí'
  | 'Thiên Y'
  | 'Diên Niên'
  | 'Phục Vị'
  | 'Tuyệt Mệnh'
  | 'Ngũ Quỷ'
  | 'Lục Sát'
  | 'Họa Hại';

export interface DirectionEvaluation {
  direction: Direction8;
  degreesRange: string;
  star: BatTrachStar;
  nature: 'Cát' | 'Hung';
  score: number;
  description: string;
}

export interface Mountain24Detail {
  mountain: string; // e.g. "Tý", "Quý", "Sửu", ...
  direction: Direction8;
  startDegree: number;
  endDegree: number;
  quaiMenhStar: BatTrachStar;
  nature: 'Cát' | 'Hung';
}

export interface BatTrachResult {
  birthYear: number;
  gender: boolean;
  quaiMenh: QuaiMenh;
  quaiNumber: number;
  quaiElement: NguhanhType;
  group: 'Đông Tứ Mệnh' | 'Tây Tứ Mệnh';
  directions: DirectionEvaluation[];
  mountain24: Mountain24Detail[];
}

// 24 Sơn Hướng list in clockwise order starting from North (337.5° to 352.5° = Nhâm)
export const MOUNTAINS_24 = [
  { name: 'Nhâm', start: 337.5, end: 352.5, dir: 'Bắc' as Direction8 },
  { name: 'Tý',   start: 352.5, end: 7.5,   dir: 'Bắc' as Direction8 },
  { name: 'Quý',  start: 7.5,   end: 22.5,  dir: 'Bắc' as Direction8 },
  { name: 'Sửu',  start: 22.5,  end: 37.5,  dir: 'Đông Bắc' as Direction8 },
  { name: 'Cấn',  start: 37.5,  end: 52.5,  dir: 'Đông Bắc' as Direction8 },
  { name: 'Dần',  start: 52.5,  end: 67.5,  dir: 'Đông Bắc' as Direction8 },
  { name: 'Giáp', start: 67.5,  end: 82.5,  dir: 'Đông' as Direction8 },
  { name: 'Mão',  start: 82.5,  end: 97.5,  dir: 'Đông' as Direction8 },
  { name: 'Ất',   start: 97.5,  end: 112.5, dir: 'Đông' as Direction8 },
  { name: 'Thìn', start: 112.5, end: 127.5, dir: 'Đông Nam' as Direction8 },
  { name: 'Tốn',  start: 127.5, end: 142.5, dir: 'Đông Nam' as Direction8 },
  { name: 'Tỵ',   start: 142.5, end: 157.5, dir: 'Đông Nam' as Direction8 },
  { name: 'Bính', start: 157.5, end: 172.5, dir: 'Nam' as Direction8 },
  { name: 'Ngọ',  start: 172.5, end: 187.5, dir: 'Nam' as Direction8 },
  { name: 'Đinh', start: 187.5, end: 202.5, dir: 'Nam' as Direction8 },
  { name: 'Mùi',  start: 202.5, end: 217.5, dir: 'Tây Nam' as Direction8 },
  { name: 'Khôn', start: 217.5, end: 232.5, dir: 'Tây Nam' as Direction8 },
  { name: 'Thân', start: 232.5, end: 247.5, dir: 'Tây Nam' as Direction8 },
  { name: 'Canh', start: 247.5, end: 262.5, dir: 'Tây' as Direction8 },
  { name: 'Dậu',  start: 262.5, end: 277.5, dir: 'Tây' as Direction8 },
  { name: 'Tân',  start: 277.5, end: 292.5, dir: 'Tây' as Direction8 },
  { name: 'Tuất', start: 292.5, end: 307.5, dir: 'Tây Bắc' as Direction8 },
  { name: 'Càn',  start: 307.5, end: 322.5, dir: 'Tây Bắc' as Direction8 },
  { name: 'Hợi',  start: 322.5, end: 337.5, dir: 'Tây Bắc' as Direction8 },
];

/** Direction matrix for each Quái Mệnh */
export const BAT_TRACH_MAP: Record<QuaiMenh, Record<Direction8, BatTrachStar>> = {
  Khảm: {
    'Bắc': 'Phục Vị',
    'Đông Bắc': 'Ngũ Quỷ',
    'Đông': 'Thiên Y',
    'Đông Nam': 'Sinh Khí',
    'Nam': 'Diên Niên',
    'Tây Nam': 'Tuyệt Mệnh',
    'Tây': 'Họa Hại',
    'Tây Bắc': 'Lục Sát',
  },
  Ly: {
    'Bắc': 'Diên Niên',
    'Đông Bắc': 'Họa Hại',
    'Đông': 'Sinh Khí',
    'Đông Nam': 'Thiên Y',
    'Nam': 'Phục Vị',
    'Tây Nam': 'Lục Sát',
    'Tây': 'Ngũ Quỷ',
    'Tây Bắc': 'Tuyệt Mệnh',
  },
  Cấn: {
    'Bắc': 'Ngũ Quỷ',
    'Đông Bắc': 'Phục Vị',
    'Đông': 'Lục Sát',
    'Đông Nam': 'Tuyệt Mệnh',
    'Nam': 'Họa Hại',
    'Tây Nam': 'Sinh Khí',
    'Tây': 'Diên Niên',
    'Tây Bắc': 'Thiên Y',
  },
  Đoài: {
    'Bắc': 'Họa Hại',
    'Đông Bắc': 'Diên Niên',
    'Đông': 'Tuyệt Mệnh',
    'Đông Nam': 'Lục Sát',
    'Nam': 'Ngũ Quỷ',
    'Tây Nam': 'Thiên Y',
    'Tây': 'Phục Vị',
    'Tây Bắc': 'Sinh Khí',
  },
  Càn: {
    'Bắc': 'Lục Sát',
    'Đông Bắc': 'Thiên Y',
    'Đông': 'Ngũ Quỷ',
    'Đông Nam': 'Họa Hại',
    'Nam': 'Tuyệt Mệnh',
    'Tây Nam': 'Diên Niên',
    'Tây': 'Sinh Khí',
    'Tây Bắc': 'Phục Vị',
  },
  Khôn: {
    'Bắc': 'Tuyệt Mệnh',
    'Đông Bắc': 'Sinh Khí',
    'Đông': 'Họa Hại',
    'Đông Nam': 'Ngũ Quỷ',
    'Nam': 'Lục Sát',
    'Tây Nam': 'Phục Vị',
    'Tây': 'Thiên Y',
    'Tây Bắc': 'Diên Niên',
  },
  Tốn: {
    'Bắc': 'Sinh Khí',
    'Đông Bắc': 'Tuyệt Mệnh',
    'Đông': 'Diên Niên',
    'Đông Nam': 'Phục Vị',
    'Nam': 'Thiên Y',
    'Tây Nam': 'Ngũ Quỷ',
    'Tây': 'Lục Sát',
    'Tây Bắc': 'Họa Hại',
  },
  Chấn: {
    'Bắc': 'Thiên Y',
    'Đông Bắc': 'Lục Sát',
    'Đông': 'Phục Vị',
    'Đông Nam': 'Diên Niên',
    'Nam': 'Sinh Khí',
    'Tây Nam': 'Họa Hại',
    'Tây': 'Tuyệt Mệnh',
    'Tây Bắc': 'Ngũ Quỷ',
  },
};

export const STAR_DETAILS: Record<BatTrachStar, { nature: 'Cát' | 'Hung'; score: number; desc: string }> = {
  'Sinh Khí': { nature: 'Cát', score: 10, desc: 'Thu hút tài lộc, danh tiếng, thăng quan phát tài, sinh khí dồi dào.' },
  'Thiên Y': { nature: 'Cát', score: 9, desc: 'Cải thiện sức khỏe, trường thọ, tiêu trừ bệnh tật, quý nhân trợ mệnh.' },
  'Diên Niên': { nature: 'Cát', score: 8, desc: 'Củng cố các mối quan hệ tình cảm gia đạo, hòa thuận bền lâu.' },
  'Phục Vị': { nature: 'Cát', score: 7, desc: 'Củng cố sức mạnh tinh thần, thi cử tiến bộ, may mắn bản thân.' },
  'Tuyệt Mệnh': { nature: 'Hung', score: 1, desc: 'Đại hung, phá sản, bệnh tật hiểm nghèo, tổn hại nhân đinh.' },
  'Ngũ Quỷ': { nature: 'Hung', score: 2, desc: 'Hao hụt tài sản, hỏa hoạn, thị phi tranh chấp, mất nguồn thu nhập.' },
  'Lục Sát': { nature: 'Hung', score: 3, desc: 'Xáo trộn quan hệ, tai nạn, kiện tụng thị phi, lục đục bất hòa.' },
  'Họa Hại': { nature: 'Hung', score: 4, desc: 'Hung hại nhỏ, thất bại việc nhỏ, khẩu thiệt hao tài vặt.' },
};

/** Calculate Quái Mệnh from birth year and gender */
export function calculateQuaiMenh(birthYear: number, gender: boolean): { quai: QuaiMenh; num: number } {
  // Sum digits of year
  const sumDigits = birthYear
    .toString()
    .split('')
    .reduce((a, b) => a + parseInt(b, 10), 0);
  let rem = sumDigits % 9;
  if (rem === 0) rem = 9;

  let quaiNum: number;
  if (birthYear < 2000) {
    quaiNum = gender ? 10 - rem : (rem + 5) % 9;
    if (!gender && quaiNum === 0) quaiNum = 9;
  } else {
    quaiNum = gender ? 9 - rem : (6 + rem) % 9;
    if (gender && quaiNum === 0) quaiNum = 9;
    if (!gender && quaiNum === 0) quaiNum = 9;
  }

  // Handle center (5): Male -> Khôn (2), Female -> Cấn (8)
  if (quaiNum === 5) {
    quaiNum = gender ? 2 : 8;
  }

  const quaiMap: Record<number, QuaiMenh> = {
    1: 'Khảm',
    2: 'Khôn',
    3: 'Chấn',
    4: 'Tốn',
    6: 'Càn',
    7: 'Đoài',
    8: 'Cấn',
    9: 'Ly',
  };

  return { quai: quaiMap[quaiNum] ?? 'Khảm', num: quaiNum };
}

/** Calculate Complete Bát Trạch & 24 Sơn Hướng */
export function calculateBatTrach(birthYear: number, gender: boolean): BatTrachResult {
  const { quai, num } = calculateQuaiMenh(birthYear, gender);

  const quaiElements: Record<QuaiMenh, NguhanhType> = {
    Khảm: 'Thủy', Ly: 'Hỏa', Chấn: 'Mộc', Tốn: 'Mộc',
    Càn: 'Kim', Đoài: 'Kim', Khôn: 'Thổ', Cấn: 'Thổ',
  };

  const isDongTu = ['Khảm', 'Ly', 'Chấn', 'Tốn'].includes(quai);
  const group = isDongTu ? 'Đông Tứ Mệnh' : 'Tây Tứ Mệnh';

  const dirMap = BAT_TRACH_MAP[quai];
  const directionsList: Direction8[] = [
    'Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'
  ];

  const degreesRangeMap: Record<Direction8, string> = {
    'Bắc': '337.5° - 22.5°',
    'Đông Bắc': '22.5° - 67.5°',
    'Đông': '67.5° - 112.5°',
    'Đông Nam': '112.5° - 157.5°',
    'Nam': '157.5° - 202.5°',
    'Tây Nam': '202.5° - 247.5°',
    'Tây': '247.5° - 292.5°',
    'Tây Bắc': '292.5° - 337.5°',
  };

  const directions: DirectionEvaluation[] = directionsList.map(dir => {
    const star = dirMap[dir];
    const meta = STAR_DETAILS[star];
    return {
      direction: dir,
      degreesRange: degreesRangeMap[dir],
      star,
      nature: meta.nature,
      score: meta.score,
      description: meta.desc,
    };
  });

  const mountain24: Mountain24Detail[] = MOUNTAINS_24.map(m => {
    const star = dirMap[m.dir];
    const meta = STAR_DETAILS[star];
    return {
      mountain: m.name,
      direction: m.dir,
      startDegree: m.start,
      endDegree: m.end,
      quaiMenhStar: star,
      nature: meta.nature,
    };
  });

  return {
    birthYear,
    gender,
    quaiMenh: quai,
    quaiNumber: num,
    quaiElement: quaiElements[quai],
    group,
    directions,
    mountain24,
  };
}

/** Get 24 Mountain by exact compass degree (0° to 359.999°) */
export function getMountainByDegree(degree: number, quaiMenh?: QuaiMenh): Mountain24Detail | undefined {
  const norm = ((degree % 360) + 360) % 360;
  let match = MOUNTAINS_24.find(m => {
    if (m.name === 'Tý') {
      return norm >= 352.5 || norm < 7.5;
    }
    return norm >= m.start && norm < m.end;
  });

  if (!match) {
    match = MOUNTAINS_24.find(m => m.name === 'Tý')!;
  }

  let star: BatTrachStar = 'Phục Vị';
  let nature: 'Cát' | 'Hung' = 'Cát';
  if (quaiMenh && BAT_TRACH_MAP[quaiMenh]) {
    star = BAT_TRACH_MAP[quaiMenh][match.dir];
    nature = STAR_DETAILS[star].nature;
  }

  return {
    mountain: match.name,
    direction: match.dir,
    startDegree: match.start,
    endDegree: match.end,
    quaiMenhStar: star,
    nature,
  };
}

/** Evaluate degree boundary and check for Đại / Tiểu Không Vong */
export function evaluateMountainDegree(degree: number, quaiMenh?: QuaiMenh): {
  degree: number;
  mountain: string;
  direction: string;
  quaiMenhStar?: BatTrachStar;
  nature?: 'Cát' | 'Hung';
  status: 'An Toàn' | 'Đại Không Vong' | 'Tiểu Không Vong';
  warning?: string;
} {
  const norm = Math.round((((degree % 360) + 360) % 360) * 10) / 10;
  const m = getMountainByDegree(norm, quaiMenh);
  const mountainName = m ? m.mountain : 'Tý';
  const directionName = m ? m.direction : 'Bắc';
  const star = m?.quaiMenhStar;
  const nature = m?.nature;

  // Đại Không Vong boundaries
  const daiBoundaries = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  for (const b of daiBoundaries) {
    if (Math.abs(norm - b) <= 1.5) {
      return {
        degree: norm,
        mountain: mountainName,
        direction: directionName,
        status: 'Đại Không Vong',
        warning: `Tọa độ ${norm}° phạm tuyến phân kim Đại Không Vong (ranh giới 2 quẻ ${b}°). Khí trường hỗn loạn, cực kỳ hung hiểm.`,
      };
    }
  }

  // Tiểu Không Vong boundaries
  for (let b = 7.5; b < 360; b += 15) {
    if (daiBoundaries.includes(b)) continue;
    if (Math.abs(norm - b) <= 1.0) {
      return {
        degree: norm,
        mountain: mountainName,
        direction: directionName,
        status: 'Tiểu Không Vong',
        warning: `Tọa độ ${norm}° phạm tuyến phân kim Tiểu Không Vong (ranh giới 2 sơn ${b}°). Dễ sinh bất hòa, khẩu thiệt.`,
      };
    }
  }

  return {
    degree: norm,
    mountain: mountainName,
    direction: directionName,
    status: 'An Toàn',
  };
}
