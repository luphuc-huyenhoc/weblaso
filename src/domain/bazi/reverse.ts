import {
  THIEN_CAN,
  DIA_CHI,
  ThienCan,
  DiaChi,
  gregorianToJdn,
  jdnToGregorian,
  getCanChiDay,
} from '../calendar';
import { calculateBazi } from './index';

export interface ReverseBaziSearchParams {
  thienCanYear: number; // 1 = Giáp .. 10 = Quý
  diaChiYear: number;   // 1 = Tý .. 12 = Hợi
  diaChiMonth: number;  // 1 = Dần .. 12 = Sửu (or 1=Tý .. 12=Hợi)
  thienCanDay: number;  // 1 = Giáp .. 10 = Quý
  diaChiDay: number;    // 1 = Tý .. 12 = Hợi
  diaChiHour: number;   // 1 = Tý .. 12 = Hợi
  startYear?: number;
  endYear?: number;
}

export interface ReverseBaziMatch {
  solarDateStr: string; // e.g., "11/12/1924 24:00"
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  viewUrlMale: string;
  viewUrlFemale: string;
}

/** Reverse Bazi Search: Find matching Gregorian dates within range */
export function searchBaziByPillars(params: ReverseBaziSearchParams): ReverseBaziMatch[] {
  const {
    thienCanYear,
    diaChiYear,
    diaChiMonth,
    thienCanDay,
    diaChiDay,
    diaChiHour,
    startYear = 1900,
    endYear = 2150,
  } = params;

  const targetYearStem = THIEN_CAN[thienCanYear - 1];
  const targetYearBranch = DIA_CHI[diaChiYear - 1];
  const targetDayStem = THIEN_CAN[thienCanDay - 1];
  const targetDayBranch = DIA_CHI[diaChiDay - 1];
  const targetHourBranch = DIA_CHI[diaChiHour - 1];

  // Map month index (1 = Dần, 2 = Mão, ..., 12 = Sửu)
  const monthBranches: DiaChi[] = [
    'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi',
    'Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu'
  ];
  const targetMonthBranch = monthBranches[(diaChiMonth - 1) % 12];

  const matches: ReverseBaziMatch[] = [];

  // 1. Filter matching astrological years (60-year cycle)
  for (let y = startYear; y <= endYear; y++) {
    const yCan = THIEN_CAN[(y + 6) % 10];
    const yChi = DIA_CHI[(y + 8) % 12];
    if (yCan !== targetYearStem || yChi !== targetYearBranch) {
      continue;
    }

    // 2. In this matching year, check days
    // Standard month approximations for the branch:
    // Dần ~ Feb, Mão ~ Mar, Thìn ~ Apr, Tỵ ~ May, Ngọ ~ Jun, Mùi ~ Jul,
    // Thân ~ Aug, Dậu ~ Sep, Tuất ~ Oct, Hợi ~ Nov, Tý ~ Dec, Sửu ~ Jan
    const approxMonth = ((diaChiMonth + 0) % 12) + 1;
    const testMonths = [
      approxMonth === 1 ? 12 : approxMonth - 1,
      approxMonth,
      (approxMonth % 12) + 1,
    ];

    for (const m of testMonths) {
      const daysInMonth = new Date(y, m, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const jdn = gregorianToJdn(y, m, d);
        const dayCanChi = getCanChiDay(jdn);
        const [dCan, dChi] = dayCanChi.split(' ');

        if (dCan === targetDayStem && dChi === targetDayBranch) {
          // Hour branch matching
          const hBranchIdx = DIA_CHI.indexOf(targetHourBranch);
          const hour = (hBranchIdx * 2 + 23) % 24; // Representative hour for this branch

          // Run complete Bazi validation to confirm exact month branch solar term
          const calc = calculateBazi({
            fullName: 'Ẩn danh',
            gender: true,
            year: y,
            month: m,
            day: d,
            hour,
            minute: 0,
          });

          if (
            calc.calculation.pillars.year.stem === targetYearStem &&
            calc.calculation.pillars.year.branch === targetYearBranch &&
            calc.calculation.pillars.month.branch === targetMonthBranch &&
            calc.calculation.pillars.day.stem === targetDayStem &&
            calc.calculation.pillars.day.branch === targetDayBranch &&
            calc.calculation.pillars.hour.branch === targetHourBranch
          ) {
            const pad = (n: number) => n.toString().padStart(2, '0');
            const dateStr = `${pad(d)}/${pad(m)}/${y} ${pad(hour)}:00`;
            const qMale = new URLSearchParams({
              Fullname: 'Khách Nam',
              Gender: 'true',
              Day: `${d}`,
              Month: `${m}`,
              Year: `${y}`,
              Hour: `${hour}`,
              Minutes: '0',
            }).toString();
            const qFemale = new URLSearchParams({
              Fullname: 'Khách Nữ',
              Gender: 'false',
              Day: `${d}`,
              Month: `${m}`,
              Year: `${y}`,
              Hour: `${hour}`,
              Minutes: '0',
            }).toString();

            matches.push({
              solarDateStr: dateStr,
              year: y,
              month: m,
              day: d,
              hour,
              minute: 0,
              viewUrlMale: `/la-so-bat-tu?${qMale}`,
              viewUrlFemale: `/la-so-bat-tu?${qFemale}`,
            });
          }
        }
      }
    }
  }

  return matches;
}
