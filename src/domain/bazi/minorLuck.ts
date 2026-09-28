import { THIEN_CAN, DIA_CHI, ThienCan, DiaChi, NguhanhType } from '../calendar/index';
import { STEM_ELEMENTS, STEM_YANG, TenGod, getTenGod } from './index';

export const TEN_GOD_FULL_NAME: Record<TenGod, string> = {
  'Tỷ': 'Tỷ Kiên',
  'Kiếp': 'Kiếp Tài',
  'Thực': 'Thực Thần',
  'Thương': 'Thương Quan',
  'Tài': 'Chính Tài',
  'T.Tài': 'Thiên Tài',
  'Quan': 'Chính Quan',
  'Sát': 'Thất Sát',
  'Ấn': 'Chính Ấn',
  'Kiêu': 'Thiên Ấn',
  'NHẬT CHỦ': 'Nhật Chủ',
};

export interface MinorLuckItem {
  age: number;
  year: number;
  stem: ThienCan;
  branch: DiaChi;
  canChi: string;
  tenGod: TenGod;
  tenGodFullName: string;
  element: NguhanhType;
}

export interface MinorLuckResult {
  direction: 'Thuận' | 'Nghịch';
  directionValue: 1 | -1;
  ruleDescription: string;
  baseHourPillar: {
    stem: ThienCan;
    branch: DiaChi;
    canChi: string;
  };
  currentAge: number;
  currentYear: number;
  current: MinorLuckItem;
  table: MinorLuckItem[];
}

export interface CalculateMinorLuckParams {
  gender: boolean; // true = Male, false = Female
  yearStem: ThienCan;
  hourStem: ThienCan;
  hourBranch: DiaChi;
  dayMaster: ThienCan;
  birthYear: number;
  focusYear?: number;
  maxAge?: number;
}

/**
 * Tính Tiểu Vận Bát Tự theo phương pháp lấy Trụ Giờ làm mốc.
 *
 * Quy tắc:
 * 1. Dương Nam hoặc Âm Nữ: chiều thuận (direction = +1)
 * 2. Âm Nam hoặc Dương Nữ: chiều nghịch (direction = -1)
 * 3. canResultIndex = (canIndex + direction * n) mod 10
 * 4. chiResultIndex = (chiIndex + direction * n) mod 12
 * 5. Tuổi 0 chính là Trụ Giờ. Sau 60 năm quay lại đúng Can Chi Trụ Giờ.
 */
export function calculateMinorLuck({
  gender,
  yearStem,
  hourStem,
  hourBranch,
  dayMaster,
  birthYear,
  focusYear,
  maxAge = 80,
}: CalculateMinorLuckParams): MinorLuckResult {
  const isYangYear = STEM_YANG[yearStem];
  const isMale = gender;

  // Xác định chiều:
  // Dương Nam hoặc Âm Nữ: Thuận (+1)
  // Âm Nam hoặc Dương Nữ: Nghịch (-1)
  const isForward = (isMale && isYangYear) || (!isMale && !isYangYear);
  const direction: 'Thuận' | 'Nghịch' = isForward ? 'Thuận' : 'Nghịch';
  const directionValue: 1 | -1 = isForward ? 1 : -1;

  const genderYangText = isMale
    ? (isYangYear ? 'Dương Nam' : 'Âm Nam')
    : (isYangYear ? 'Dương Nữ' : 'Âm Nữ');

  const ruleDescription = `${genderYangText} ➔ Khởi Trụ Giờ đi ${direction.toLowerCase()} (${directionValue > 0 ? '+1' : '-1'})`;

  const canIndex = THIEN_CAN.indexOf(hourStem);
  const chiIndex = DIA_CHI.indexOf(hourBranch);

  const curYear = focusYear ?? new Date().getFullYear();
  const curAge = Math.max(0, curYear - birthYear + 1);

  function getAtAge(age: number): MinorLuckItem {
    const cIdx = ((canIndex + directionValue * age) % 10 + 10) % 10;
    const bIdx = ((chiIndex + directionValue * age) % 12 + 12) % 12;
    const stem = THIEN_CAN[cIdx];
    const branch = DIA_CHI[bIdx];
    const tenGod = getTenGod(dayMaster, stem);
    const tenGodFullName = TEN_GOD_FULL_NAME[tenGod] || tenGod;
    const year = age === 0 ? birthYear : birthYear + age - 1;

    return {
      age,
      year,
      stem,
      branch,
      canChi: `${stem} ${branch}`,
      tenGod,
      tenGodFullName,
      element: STEM_ELEMENTS[stem],
    };
  }

  const table: MinorLuckItem[] = [];
  for (let a = 0; a <= maxAge; a++) {
    table.push(getAtAge(a));
  }

  const current = getAtAge(curAge);

  return {
    direction,
    directionValue,
    ruleDescription,
    baseHourPillar: {
      stem: hourStem,
      branch: hourBranch,
      canChi: `${hourStem} ${hourBranch}`,
    },
    currentAge: curAge,
    currentYear: curYear,
    current,
    table,
  };
}
