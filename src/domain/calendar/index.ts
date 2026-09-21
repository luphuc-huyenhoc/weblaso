/**
 * Vietnamese Lunar Calendar & Astronomical Solar Terms Domain Engine
 * Standardized for UTC+07:00 (Indochina Time, 105°E)
 * Canonical Ho Ngoc Duc Algorithm + Jean Meeus Solar Longitude Formulae
 */

export const THIEN_CAN = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'
] as const;

export const DIA_CHI = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'
] as const;

export const NGU_HANH = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'] as const;

export type ThienCan = (typeof THIEN_CAN)[number];
export type DiaChi = (typeof DIA_CHI)[number];
export type NguhanhType = (typeof NGU_HANH)[number];

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
}

export interface SolarTermPeriod {
  currentTerm: string;
  currentTermStart: string;
  nextTerm: string;
  nextTermStart: string;
  daysToNextTerm: number;
  daysFromPrevTerm: number;
}

export const SOLAR_TERMS_NAMES = [
  'Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng',
  'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ',
  'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết',
  'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'
] as const;

const TIMEZONE_OFFSET = 7.0;

/** Convert Gregorian date to Julian Day Number */
export function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Convert Julian Day Number to Gregorian Date */
export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

/** Astronomical New Moon JDN calculation */
function getNewMoonDay(k: number, timeZone = TIMEZONE_OFFSET): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  const C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
    0.0021 * Math.sin(2 * dr * M) -
    0.4068 * Math.sin(Mpr * dr) +
    0.0161 * Math.sin(2 * dr * Mpr) -
    0.0004 * Math.sin(3 * dr * Mpr) +
    0.0104 * Math.sin(2 * dr * F) -
    0.0051 * Math.sin((M + Mpr) * dr) -
    0.0074 * Math.sin((M - Mpr) * dr) +
    0.0004 * Math.sin((2 * F + M) * dr) -
    0.0004 * Math.sin((2 * F - M) * dr) -
    0.0006 * Math.sin((2 * F + Mpr) * dr) +
    0.001 * Math.sin((2 * F - Mpr) * dr) +
    0.0005 * Math.sin((2 * Mpr + M) * dr);

  const deltat = T < -0.1 ? -0.00002 : (0.00005 + 0.00016 * T);
  const Jd = Jd1 + C1 - deltat;
  return Math.floor(Jd + 0.5 + timeZone / 24);
}

/** Sun True Ecliptic Longitude in UTC */
export function getSunLongitude(jdnUTC: number): number {
  const T = (jdnUTC - 2451545.0) / 36525.0;
  const dr = Math.PI / 180;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * dr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) +
    0.000289 * Math.sin(3 * M * dr);
  let L = L0 + C;
  L = L - 360 * Math.floor(L / 360);
  return L;
}

function getLunarMonth11(yy: number, timeZone = TIMEZONE_OFFSET): number {
  const off = gregorianToJdn(yy, 12, 31);
  const k = Math.floor((off - 2415021.0769986) / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm - 0.5 - timeZone / 24);
  if (sunLong >= 270) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone = TIMEZONE_OFFSET): number {
  const k = Math.floor((a11 - 2415021.0769986) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone) - 0.5 - timeZone / 24);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone) - 0.5 - timeZone / 24);
  } while (Math.floor(arc / 30) !== Math.floor(last / 30) && i < 14);
  return i - 1;
}

/** Solar to Lunar conversion (Canonical Ho Ngoc Duc Algorithm) */
export function solarToLunar(
  solarYear: number,
  solarMonth: number,
  solarDay: number
): LunarDate {
  const dayNumber = gregorianToJdn(solarYear, solarMonth, solarDay);
  const k = Math.floor((dayNumber - 2415021.0769986) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k);
  }
  let a11 = getLunarMonth11(solarYear);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = solarYear;
    a11 = getLunarMonth11(solarYear - 1);
  } else {
    lunarYear = solarYear + 1;
    b11 = getLunarMonth11(solarYear + 1);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  const canChiDay = getCanChiDay(dayNumber);
  const canChiYear = getCanChiYear(lunarYear);
  const canChiMonth = getCanChiMonth(lunarYear, lunarMonth);

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeap: lunarLeap,
    canChiDay,
    canChiMonth,
    canChiYear,
  };
}

/** Lunar to Solar conversion (Canonical Ho Ngoc Duc Algorithm) */
export function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeap: boolean = false
): { year: number; month: number; day: number } {
  let a11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1);
  } else {
    a11 = getLunarMonth11(lunarYear);
  }
  const b11 = getLunarMonth11(lunarYear);
  const k = Math.floor((a11 - 2415021.0769986) / 29.530588853 + 0.5);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (isLeap && lunarMonth === leapMonth) {
      off = leapOff;
    } else if (off >= leapOff) {
      off += 1;
    }
  }
  const monthStart = getNewMoonDay(k + off);
  return jdnToGregorian(monthStart + lunarDay - 1);
}

/** Can Chi derivations */
export function getCanChiYear(year: number): string {
  const can = THIEN_CAN[(year + 6) % 10];
  const chi = DIA_CHI[(year + 8) % 12];
  return `${can} ${chi}`;
}

export function getCanChiMonth(year: number, lunarMonth: number): string {
  const canYearIndex = (year + 6) % 10;
  const startCanIndex = ((canYearIndex % 5) * 2 + 2) % 10;
  const monthCan = THIEN_CAN[(startCanIndex + (lunarMonth - 1)) % 10];
  const monthChi = DIA_CHI[(lunarMonth + 1) % 12];
  return `${monthCan} ${monthChi}`;
}

export function getCanChiDay(jdn: number): string {
  const can = THIEN_CAN[(jdn + 9) % 10];
  const chi = DIA_CHI[(jdn + 1) % 12];
  return `${can} ${chi}`;
}

export function getCanChiHour(dayCanIndex: number, hourBranchIndex: number): string {
  const startCanIndex = ((dayCanIndex % 5) * 2) % 10;
  const hourCan = THIEN_CAN[(startCanIndex + hourBranchIndex) % 10];
  const hourChi = DIA_CHI[hourBranchIndex];
  return `${hourCan} ${hourChi}`;
}

export function findSolarTermInstant(approxYear: number, targetLongitudeDeg: number): number {
  let dayApprox = Math.floor(((targetLongitudeDeg + 80) % 360) * 1.014);
  let jdn = gregorianToJdn(approxYear, 1, 1) + dayApprox;

  let low = jdn - 5;
  let high = jdn + 5;
  for (let iter = 0; iter < 40; iter++) {
    const mid = (low + high) / 2;
    let l = getSunLongitude(mid);
    let diff = l - targetLongitudeDeg;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < 0.00001) {
      return mid;
    }
    if (diff < 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

export function getSurroundingSolarTerms(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  hour: number,
  minute: number
): SolarTermPeriod {
  const currentJdn = gregorianToJdn(solarYear, solarMonth, solarDay) + (hour + minute / 60 - TIMEZONE_OFFSET) / 24;
  const sunLong = getSunLongitude(currentJdn);
  
  const currentTermIdx = Math.floor(sunLong / 15);
  const nextTermIdx = (currentTermIdx + 1) % 24;

  const currentTermName = SOLAR_TERMS_NAMES[currentTermIdx];
  const nextTermName = SOLAR_TERMS_NAMES[nextTermIdx];

  const targetCurLong = currentTermIdx * 15;
  const targetNextLong = nextTermIdx * 15;

  const curJdnInstant = findSolarTermInstant(solarYear, targetCurLong);
  const nextJdnInstant = findSolarTermInstant(solarYear, targetNextLong);

  const daysToNextTerm = Math.max(0, nextJdnInstant - currentJdn);
  const daysFromPrevTerm = Math.max(0, currentJdn - curJdnInstant);

  const curDate = jdnToGregorian(Math.floor(curJdnInstant));
  const curTime = (curJdnInstant - Math.floor(curJdnInstant) + TIMEZONE_OFFSET / 24) * 24;
  const curH = Math.floor(curTime) % 24;
  const curM = Math.floor((curTime - Math.floor(curTime)) * 60);

  const nextDate = jdnToGregorian(Math.floor(nextJdnInstant));
  const nextTime = (nextJdnInstant - Math.floor(nextJdnInstant) + TIMEZONE_OFFSET / 24) * 24;
  const nextH = Math.floor(nextTime) % 24;
  const nextM = Math.floor((nextTime - Math.floor(nextTime)) * 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return {
    currentTerm: currentTermName,
    currentTermStart: `${curDate.year}-${pad(curDate.month)}-${pad(curDate.day)}T${pad(curH)}:${pad(curM)}:00+07:00`,
    nextTerm: nextTermName,
    nextTermStart: `${nextDate.year}-${pad(nextDate.month)}-${pad(nextDate.day)}T${pad(nextH)}:${pad(nextM)}:00+07:00`,
    daysToNextTerm,
    daysFromPrevTerm,
  };
}

export function getSolarTerm(jdn: number): string {
  const sunLong = getSunLongitude(jdn);
  const termIdx = Math.floor(sunLong / 15);
  return SOLAR_TERMS_NAMES[termIdx % 24];
}
