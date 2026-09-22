import {
  THIEN_CAN,
  DIA_CHI,
  ThienCan,
  DiaChi,
  gregorianToJdn,
  solarToLunar,
  getCanChiDay,
  getCanChiMonth,
  getCanChiYear,
  getCanChiHour,
  getSolarTerm,
  jdnToGregorian,
} from '../calendar/index';

export type DayQuality = 'TỐT' | 'XẤU' | 'THƯỜNG';
export type TrucQuality = 'Cát' | 'Hung' | 'Bình';

export interface ZodiacHourDetail {
  branch: DiaChi;
  branchIndex: number;
  timeRange: string;
  canChi: string;
  isZodiac: boolean; // true = Hoàng Đạo
  deityName: string;
}

export interface AlmanacDaySummary {
  solarDateStr: string; // YYYY-MM-DD
  day: number;
  month: number;
  year: number;
  dayOfWeek: string; // Thứ Hai, Thứ Ba...
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  isLeapMonth: boolean;
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
  solarTerm: string;

  // Evaluation
  dayQuality: DayQuality;
  isHoangDao: boolean;
  hoangDaoType: 'Hoàng Đạo' | 'Hắc Đạo';
  hoangDaoDeity: string;
  truc: string; // Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế
  trucQuality: TrucQuality;

  // Zodiac hours
  zodiacHours: ZodiacHourDetail[];
  goodHourBranches: DiaChi[];

  // Detailed Guidance
  favorableActivities: string[];
  unfavorableActivities: string[];
  clashingAges: string[];
  harmoniousAges: string[];
  departureDirections: {
    hyThan: string;
    taiThan: string;
    hacThan: string;
  };
  specialDays: string[];
}

export const TRUC_NAMES = [
  'Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp',
  'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'
] as const;

export const HOANG_DAO_DEITIES = [
  { name: 'Thanh Long', isGood: true },
  { name: 'Minh Đường', isGood: true },
  { name: 'Thiên Hình', isGood: false },
  { name: 'Chu Tước', isGood: false },
  { name: 'Kim Quỹ', isGood: true },
  { name: 'Thiên Đức', isGood: true },
  { name: 'Bạch Hổ', isGood: false },
  { name: 'Ngọc Đường', isGood: true },
  { name: 'Thiên Lao', isGood: false },
  { name: 'Huyền Vũ', isGood: false },
  { name: 'Tư Mệnh', isGood: true },
  { name: 'Câu Trần', isGood: false },
] as const;

export const HOUR_TIME_RANGES: Record<DiaChi, string> = {
  Tý: '23:00 - 01:00',
  Sửu: '01:00 - 03:00',
  Dần: '03:00 - 05:00',
  Mão: '05:00 - 07:00',
  Thìn: '07:00 - 09:00',
  Tỵ: '09:00 - 11:00',
  Ngọ: '11:00 - 13:00',
  Mùi: '13:00 - 15:00',
  Thân: '15:00 - 17:00',
  Dậu: '17:00 - 19:00',
  Tuất: '19:00 - 21:00',
  Hợi: '21:00 - 23:00',
};

// 12 Branch Zodiac hours start table by day branch
// Tý/Ngọ start Tý; Sửu/Mùi start Dần; Dần/Thân start Thìn; Mão/Dậu start Ngọ; Thìn/Tuất start Thân; Tỵ/Hợi start Tuất
const ZODIAC_HOUR_START_MAP: Record<DiaChi, number> = {
  Tý: 0, Ngọ: 0,
  Sửu: 2, Mùi: 2,
  Dần: 4, Thân: 4,
  Mão: 6, Dậu: 6,
  Thìn: 8, Tuất: 8,
  Tỵ: 10, Hợi: 10,
};

// Trực qualities and recommendations
const TRUC_INFO: Record<
  string,
  { quality: TrucQuality; favorable: string[]; unfavorable: string[] }
> = {
  Kiến: {
    quality: 'Cát',
    favorable: ['Xuất hành', 'Đính hôn', 'Ăn hỏi', 'Cưới gả', 'Khai trương', 'Cầu tài lộc'],
    unfavorable: ['Động thổ', 'Đào móng', 'Chôn cất'],
  },
  Trừ: {
    quality: 'Cát',
    favorable: ['Tắm gội', 'Chữa bệnh', 'Cắt tóc', 'Giải oan', 'Trừ phục', 'Xả tang'],
    unfavorable: ['Cưới hỏi', 'Khai trương', 'Ký hợp đồng', 'Xuất hành'],
  },
  Mãn: {
    quality: 'Cát',
    favorable: ['Cầu tài', 'Khai trương', 'Giao dịch', 'Mở kho', 'Nhập kho', 'Đính hôn'],
    unfavorable: ['Chữa bệnh', 'Kiện tụng', 'An táng'],
  },
  Bình: {
    quality: 'Cát',
    favorable: ['Lắp cửa', 'Sửa chữa', 'Xây dựng', 'Khai trương', 'Đi thuyền', 'Bình phục'],
    unfavorable: ['Đào giếng', 'Kiện tụng', 'Tranh chấp'],
  },
  Định: {
    quality: 'Cát',
    favorable: ['Động thổ', 'Nhập trạch', 'Lên chức', 'Khai trương', 'Ký kết hợp đồng'],
    unfavorable: ['Kiện tụng', 'Đi xa', 'Chữa bệnh mắt'],
  },
  Chấp: {
    quality: 'Bình',
    favorable: ['Bắt đầu công việc mới', 'Gieo trồng', 'Tu sửa nhỏ', 'Bắt trộm cướp'],
    unfavorable: ['Mở kho', 'Xuất tiền', 'Đi xa', 'Chuyển nhà'],
  },
  Phá: {
    quality: 'Hung',
    favorable: ['Phá dỡ nhà cũ', 'Dẹp bỏ tàn tích', 'Trừ tà', 'Trừ uế'],
    unfavorable: ['Khai trương', 'Cưới hỏi', 'Động thổ', 'Giao dịch', 'Ký hợp đồng'],
  },
  Nguy: {
    quality: 'Hung',
    favorable: ['Cầu an', 'Cúng tế', 'Lễ bái thần Phật'],
    unfavorable: ['Đi thuyền bè', 'Leo núi', 'Khởi công lớn', 'Cưới gả'],
  },
  Thành: {
    quality: 'Cát',
    favorable: ['Nhập trạch', 'Khai trương', 'Cưới hỏi', 'Cầu tài', 'Hợp tác làm ăn'],
    unfavorable: ['Kiện tụng', 'Tranh chấp pháp lý'],
  },
  Thu: {
    quality: 'Bình',
    favorable: ['Thu tiền', 'Đòi nợ', 'Gặt hái', 'Mua sắm tích trữ', 'Gieo hạt'],
    unfavorable: ['Tang lễ', 'Chôn cất', 'Chữa bệnh', 'Xuất hàng hóa'],
  },
  Khai: {
    quality: 'Cát',
    favorable: ['Khai trương', 'Xuất hành', 'Động thổ', 'Cưới hỏi', 'Giao dịch', 'Cầu tài'],
    unfavorable: ['An táng', 'Chôn cất', 'Phá dỡ'],
  },
  Bế: {
    quality: 'Hung',
    favorable: ['Xây đắp đê điều', 'Lấp hố rãnh', 'Bít lối', 'Tu bổ hầm chứa'],
    unfavorable: ['Khai trương', 'Cưới hỏi', 'Động thổ', 'Chữa bệnh', 'Đi xa'],
  },
};

// Tam Hợp / Lục Hợp
const TAM_HOP: Record<DiaChi, DiaChi[]> = {
  Thân: ['Tý', 'Thìn'], Tý: ['Thân', 'Thìn'], Thìn: ['Thân', 'Tý'],
  Dần: ['Ngọ', 'Tuất'], Ngọ: ['Dần', 'Tuất'], Tuất: ['Dần', 'Ngọ'],
  Tỵ: ['Dậu', 'Sửu'], Dậu: ['Tỵ', 'Sửu'], Sửu: ['Tỵ', 'Dậu'],
  Hợi: ['Mão', 'Mùi'], Mão: ['Hợi', 'Mùi'], Mùi: ['Hợi', 'Mão'],
};

const LUC_HOP: Record<DiaChi, DiaChi> = {
  Tý: 'Sửu', Sửu: 'Tý', Dần: 'Hợi', Hợi: 'Dần',
  Mão: 'Tuất', Tuất: 'Mão', Thìn: 'Dậu', Dậu: 'Thìn',
  Tỵ: 'Thân', Thân: 'Tỵ', Ngọ: 'Mùi', Mùi: 'Ngọ',
};

// Lục Xung
const LUC_XUNG: Record<DiaChi, DiaChi> = {
  Tý: 'Ngọ', Ngọ: 'Tý', Sửu: 'Mùi', Mùi: 'Sửu',
  Dần: 'Thân', Thân: 'Dần', Mão: 'Dậu', Dậu: 'Mão',
  Thìn: 'Tuất', Tuất: 'Thìn', Tỵ: 'Hợi', Hợi: 'Tỵ',
};

// Departure directions
const HY_THAN_MAP: Record<ThienCan, string> = {
  Giáp: 'Đông Bắc', Ất: 'Tây Bắc', Bính: 'Tây Nam', Đinh: 'Chính Nam', Mậu: 'Đông Nam',
  Kỷ: 'Đông Bắc', Canh: 'Tây Bắc', Tân: 'Tây Nam', Nhâm: 'Chính Nam', Quý: 'Đông Nam',
};

const TAI_THAN_MAP: Record<ThienCan, string> = {
  Giáp: 'Đông Nam', Ất: 'Đông Nam', Bính: 'Chính Đông', Đinh: 'Chính Đông', Mậu: 'Chính Bắc',
  Kỷ: 'Chính Nam', Canh: 'Chính Nam', Tân: 'Chính Nam', Nhâm: 'Chính Tây', Quý: 'Chính Bắc',
};

/** Special Day checks: Tam Nương, Nguyệt Kỵ, Dương Công Kỵ */
export function checkSpecialDays(lunarDay: number, lunarMonth: number): string[] {
  const specials: string[] = [];

  // Tam Nương: ngày 3, 7, 13, 18, 22, 27 âm lịch
  if ([3, 7, 13, 18, 22, 27].includes(lunarDay)) {
    specials.push('Tam Nương (Tránh cưới hỏi, khởi công, xuất hành lớn)');
  }

  // Nguyệt Kỵ: mùng 5, 14, 23 âm lịch ("Nửa đời nửa đoạn đi chơi cũng lỗ")
  if ([5, 14, 23].includes(lunarDay)) {
    specials.push('Nguyệt Kỵ (Tránh xuất hành, khai trương, ký hợp đồng)');
  }

  // Dương Công Kỵ
  const duongCongMap: Record<number, number> = {
    1: 13, 2: 11, 3: 9, 4: 7, 5: 5, 6: 3,
    7: 1, 8: 29, 9: 27, 10: 25, 11: 23, 12: 21
  };
  if (duongCongMap[lunarMonth] === lunarDay) {
    specials.push('Dương Công Kỵ (Tránh việc trọng đại trăm năm)');
  }

  return specials;
}

/** Compute comprehensive Almanac Day evaluation */
export function calculateAlmanacDay(year: number, month: number, day: number): AlmanacDaySummary {
  const jdn = gregorianToJdn(year, month, day);
  const lunar = solarToLunar(year, month, day);
  const canChiDayStr = getCanChiDay(jdn);
  const [dayStem, dayBranch] = canChiDayStr.split(' ') as [ThienCan, DiaChi];
  const canChiMonthStr = getCanChiMonth(year, lunar.month);
  const [, monthBranch] = canChiMonthStr.split(' ') as [ThienCan, DiaChi];
  const canChiYearStr = getCanChiYear(lunar.year);
  const solarTerm = getSolarTerm(jdn);

  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayOfWeek = daysOfWeek[new Date(year, month - 1, day).getDay()];

  const dayBranchIdx = DIA_CHI.indexOf(dayBranch);
  const dayStemIdx = THIEN_CAN.indexOf(dayStem);

  // 1. Trực calculation (12 Trực)
  // Month 1 starts at Dần (idx 2), Month 2 at Mão (idx 3)... Month 11 at Tý (idx 0), Month 12 at Sửu (idx 1)
  const monthBranchIdx = (lunar.month + 1) % 12;
  const trucOffset = (dayBranchIdx - monthBranchIdx + 12) % 12;
  const truc = TRUC_NAMES[trucOffset];
  const trucMeta = TRUC_INFO[truc] ?? { quality: 'Bình', favorable: [], unfavorable: [] };

  // 2. Hoàng Đạo / Hắc Đạo of Day
  // Months 1 & 7 start at Tý (0); 2 & 8 start at Dần (2); 3 & 9 start at Thìn (4); 4 & 10 start at Ngọ (6); 5 & 11 start at Thân (8); 6 & 12 start at Tuất (10)
  const hoangDaoStartBranchIdx = ((lunar.month - 1) % 6) * 2;
  const hoangDaoDeityIdx = (dayBranchIdx - hoangDaoStartBranchIdx + 12) % 12;
  const hoangDaoDeityMeta = HOANG_DAO_DEITIES[hoangDaoDeityIdx];
  const isHoangDao = hoangDaoDeityMeta.isGood;
  const hoangDaoType: 'Hoàng Đạo' | 'Hắc Đạo' = isHoangDao ? 'Hoàng Đạo' : 'Hắc Đạo';

  // 3. Special taboos
  const specialDays = checkSpecialDays(lunar.day, lunar.month);

  // 4. Overall Day Quality classification (TỐT / XẤU / THƯỜNG)
  let dayQuality: DayQuality = 'THƯỜNG';
  if (specialDays.length > 0 || truc === 'Phá' || truc === 'Bế' || (!isHoangDao && trucMeta.quality === 'Hung')) {
    dayQuality = 'XẤU';
  } else if (isHoangDao && (trucMeta.quality === 'Cát' || trucMeta.quality === 'Bình')) {
    dayQuality = 'TỐT';
  } else if (!isHoangDao && trucMeta.quality === 'Cát') {
    dayQuality = 'THƯỜNG';
  } else {
    dayQuality = 'THƯỜNG';
  }

  // 5. 12 Zodiac Hours of Day
  const hourStartIdx = ZODIAC_HOUR_START_MAP[dayBranch];
  const zodiacHours: ZodiacHourDetail[] = [];
  const goodHourBranches: DiaChi[] = [];

  for (let hIdx = 0; hIdx < 12; hIdx++) {
    const branch = DIA_CHI[hIdx];
    const deityIdx = (hIdx - hourStartIdx + 12) % 12;
    const deity = HOANG_DAO_DEITIES[deityIdx];
    const isZodiac = deity.isGood;
    if (isZodiac) {
      goodHourBranches.push(branch);
    }
    const hourCanChi = getCanChiHour(dayStemIdx, hIdx);

    zodiacHours.push({
      branch,
      branchIndex: hIdx,
      timeRange: HOUR_TIME_RANGES[branch],
      canChi: hourCanChi,
      isZodiac,
      deityName: deity.name,
    });
  }

  // 6. Age clash & harmony
  const clashingBranch = LUC_XUNG[dayBranch];
  const clashingAges = [
    `Tuổi ${clashingBranch}`,
    `Các tuổi khắc nạp âm với ngày ${canChiDayStr}`,
  ];

  const tamHopList = TAM_HOP[dayBranch] || [];
  const lucHopBranch = LUC_HOP[dayBranch];
  const harmoniousAges = [
    ...tamHopList.map((b) => `Tuổi ${b} (Tam hợp)`),
    `Tuổi ${lucHopBranch} (Lục hợp)`,
  ];

  // 7. Directions
  const departureDirections = {
    hyThan: HY_THAN_MAP[dayStem] || 'Chính Nam',
    taiThan: TAI_THAN_MAP[dayStem] || 'Chính Đông',
    hacThan: 'Tây Bắc',
  };

  const pad = (n: number) => n.toString().padStart(2, '0');
  const solarDateStr = `${year}-${pad(month)}-${pad(day)}`;

  return {
    solarDateStr,
    day,
    month,
    year,
    dayOfWeek,
    lunarDay: lunar.day,
    lunarMonth: lunar.month,
    lunarYear: lunar.year,
    isLeapMonth: lunar.isLeap,
    canChiDay: canChiDayStr,
    canChiMonth: canChiMonthStr,
    canChiYear: canChiYearStr,
    solarTerm,
    dayQuality,
    isHoangDao,
    hoangDaoType,
    hoangDaoDeity: hoangDaoDeityMeta.name,
    truc,
    trucQuality: trucMeta.quality,
    zodiacHours,
    goodHourBranches,
    favorableActivities: trucMeta.favorable,
    unfavorableActivities: trucMeta.unfavorable,
    clashingAges,
    harmoniousAges,
    departureDirections,
    specialDays,
  };
}

/** Search good days for a specific purpose in a date range [from, to] */
export type ActivityPurpose =
  | 'Cưới hỏi'
  | 'Khai trương'
  | 'Động thổ'
  | 'Nhập trạch'
  | 'Mua nhà'
  | 'Sửa nhà'
  | 'Xuất hành'
  | 'Ký hợp đồng'
  | 'Mua xe'
  | 'An táng'
  | 'Cầu tài'
  | 'Khác';

export function searchGoodDaysForPurpose(
  startDate: { year: number; month: number; day: number },
  endDate: { year: number; month: number; day: number },
  purpose: ActivityPurpose
): Array<AlmanacDaySummary & { matchedReasons: string[] }> {
  const startJdn = gregorianToJdn(startDate.year, startDate.month, startDate.day);
  const endJdn = gregorianToJdn(endDate.year, endDate.month, endDate.day);

  // Maximum search range: 90 days to prevent CPU overload
  const maxDays = Math.min(90, Math.max(0, endJdn - startJdn + 1));
  const results: Array<AlmanacDaySummary & { matchedReasons: string[] }> = [];

  for (let i = 0; i < maxDays; i++) {
    const curJdn = startJdn + i;
    const curDate = jdnToGregorian(curJdn);
    const daySummary = calculateAlmanacDay(curDate.year, curDate.month, curDate.day);

    const reasons: string[] = [];

    // Rule-based criteria for each purpose
    if (daySummary.specialDays.length > 0) {
      // Skip major taboo days for big events
      continue;
    }

    if (purpose === 'Cưới hỏi') {
      if (['Định', 'Thành', 'Kiến'].includes(daySummary.truc) && daySummary.isHoangDao) {
        reasons.push(`Ngày Hoàng Đạo (${daySummary.hoangDaoDeity})`);
        reasons.push(`Trực ${daySummary.truc} rất cát lợi cho việc kết hôn, gắn kết nhân duyên`);
      }
    } else if (purpose === 'Khai trương' || purpose === 'Ký hợp đồng' || purpose === 'Cầu tài') {
      if (['Khai', 'Thành', 'Mãn', 'Định'].includes(daySummary.truc) && daySummary.dayQuality !== 'XẤU') {
        reasons.push(`Trực ${daySummary.truc} chủ về phát tài, vạn sự hanh thông`);
        if (daySummary.isHoangDao) reasons.push(`Ngày Hoàng Đạo (${daySummary.hoangDaoDeity})`);
      }
    } else if (purpose === 'Động thổ' || purpose === 'Mua nhà' || purpose === 'Sửa nhà') {
      if (['Kiến', 'Định', 'Thành', 'Khai'].includes(daySummary.truc) && daySummary.isHoangDao) {
        reasons.push(`Trực ${daySummary.truc} đại cát để an nền, đặt móng vững vàng`);
        reasons.push('Không phạm Tam Nương, Nguyệt Kỵ');
      }
    } else if (purpose === 'Nhập trạch') {
      if (['Thành', 'Khai', 'Định'].includes(daySummary.truc) && daySummary.dayQuality !== 'XẤU') {
        reasons.push(`Trực ${daySummary.truc} rước vượng khí vào nhà mới`);
        if (daySummary.isHoangDao) reasons.push(`Ngày Hoàng Đạo (${daySummary.hoangDaoDeity})`);
      }
    } else if (purpose === 'Xuất hành' || purpose === 'Mua xe') {
      if (['Khai', 'Kiến', 'Thành', 'Bình'].includes(daySummary.truc) && daySummary.dayQuality !== 'XẤU') {
        reasons.push(`Trực ${daySummary.truc} thông suốt vạn lý bình an`);
        reasons.push(`Hỷ Thần ngự hướng ${daySummary.departureDirections.hyThan}, Tài Thần ngự hướng ${daySummary.departureDirections.taiThan}`);
      }
    } else if (purpose === 'An táng') {
      if (['Trừ', 'Định', 'Chấp'].includes(daySummary.truc) && !daySummary.specialDays.some((s) => s.includes('Tam Nương'))) {
        reasons.push(`Trực ${daySummary.truc} thích hợp việc tang lễ, an nghỉ vĩnh hằng`);
      }
    } else {
      // 'Khác' -> mọi ngày tốt
      if (daySummary.dayQuality === 'TỐT') {
        reasons.push('Ngày cát tường, thích hợp tiến hành bách sự');
      }
    }

    if (reasons.length > 0) {
      results.push({ ...daySummary, matchedReasons: reasons });
    }
  }

  return results;
}
