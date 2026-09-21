import {
  THIEN_CAN,
  DIA_CHI,
  ThienCan,
  DiaChi,
  NguhanhType,
  solarToLunar,
  getCanChiYear,
} from '../calendar/index';
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

export interface ZiWeiCalculationResult {
  personal: {
    fullName: string;
    genderLabel: string;
    solarDateStr: string;
    lunarDateStr: string;
    cuc: string; // e.g. "Thổ Ngũ Cục"
    menhElement: string;
    thanCungName: CungType;
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
  const placeStar = (starName: string, bIdx: number, type: 'Chánh Tinh' | 'Cát Tinh') => {
    const p = palaces.find(x => DIA_CHI.indexOf(x.branch) === bIdx);
    if (p) {
      p.mainStars.push({
        name: starName,
        type,
        element: MAIN_STAR_ELEMENTS[starName] ?? 'Kim',
        brightness: 'Vượng',
      });
    }
  };

  // Group Tử Vi
  placeStar('Tử Vi', tuViBranchIdx, 'Chánh Tinh');
  placeStar('Thiên Cơ', (tuViBranchIdx - 1 + 12) % 12, 'Chánh Tinh');
  placeStar('Thái Dương', (tuViBranchIdx - 3 + 12) % 12, 'Chánh Tinh');
  placeStar('Vũ Khúc', (tuViBranchIdx - 4 + 12) % 12, 'Chánh Tinh');
  placeStar('Thiên Đồng', (tuViBranchIdx - 5 + 12) % 12, 'Chánh Tinh');
  placeStar('Liêm Trinh', (tuViBranchIdx - 8 + 12) % 12, 'Chánh Tinh');

  // Group Thiên Phủ (symmetric across Dần - Thân axis: sum = 4)
  const thienPhuBranchIdx = (4 - tuViBranchIdx + 12) % 12;
  placeStar('Thiên Phủ', thienPhuBranchIdx, 'Chánh Tinh');
  placeStar('Thái Âm', (thienPhuBranchIdx + 1) % 12, 'Chánh Tinh');
  placeStar('Tham Lang', (thienPhuBranchIdx + 2) % 12, 'Chánh Tinh');
  placeStar('Cự Môn', (thienPhuBranchIdx + 3) % 12, 'Chánh Tinh');
  placeStar('Thiên Tướng', (thienPhuBranchIdx + 4) % 12, 'Chánh Tinh');
  placeStar('Thiên Lương', (thienPhuBranchIdx + 5) % 12, 'Chánh Tinh');
  placeStar('Thất Sát', (thienPhuBranchIdx + 6) % 12, 'Chánh Tinh');
  placeStar('Phá Quân', (thienPhuBranchIdx + 10) % 12, 'Chánh Tinh');

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
    });
  }

  // 6. Than Cung Name
  const thanPalace = palaces.find(p => p.isThan);
  const thanCungName = thanPalace ? thanPalace.cungName : 'Mệnh';

  const pad = (n: number) => n.toString().padStart(2, '0');
  const inputHash = crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');

  const calculation: ZiWeiCalculationResult = {
    personal: {
      fullName: fullName.toUpperCase(),
      genderLabel: gender ? 'Nam Mạng' : 'Nữ Mạng',
      solarDateStr: `${pad(day)}/${pad(month)}/${year} ${pad(hour)}:${pad(minute)}`,
      lunarDateStr: `${pad(lunar.day)}/${pad(lunar.month)}/${lunar.year}${lunar.isLeap ? ' (Nhuận)' : ''}`,
      cuc: cucName,
      menhElement: 'Kim Tứ Cục',
      thanCungName,
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
