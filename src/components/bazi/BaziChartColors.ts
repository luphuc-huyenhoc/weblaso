import { STEM_ELEMENTS, BRANCH_ELEMENTS } from '@/domain/bazi';
import { ThienCan, DiaChi } from '@/domain/calendar';

export type FiveElement = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export const ELEMENT_COLORS: Record<FiveElement, string> = {
  Kim: '#707070',  // Medium slate gray
  Mộc: '#138808',  // Traditional rich emerald green
  Thủy: '#0a1c8f', // Deep navy indigo blue
  Hỏa: '#d32f2f',  // Bright vermilion cinnabar red
  Thổ: '#8c451a',  // Warm ochre earth brown
};

/** Get hex color for any Ngũ Hành element */
export function getElementColor(element?: string): string {
  if (!element) return '#112244';
  return ELEMENT_COLORS[element as FiveElement] || '#112244';
}

/** Get hex color for any Heavenly Stem */
export function getStemColor(stem?: string): string {
  if (!stem) return '#112244';
  const elem = (STEM_ELEMENTS as Record<string, string>)[stem];
  return elem ? getElementColor(elem) : '#112244';
}

/** Get hex color for any Earthly Branch */
export function getBranchColor(branch?: string): string {
  if (!branch) return '#112244';
  const elem = (BRANCH_ELEMENTS as Record<string, string>)[branch];
  return elem ? getElementColor(elem) : '#112244';
}

/** Detect element of Na Yin string (e.g., 'Đại Lâm Mộc' -> 'Mộc') */
export function getNaYinColor(naYin?: string): string {
  if (!naYin) return '#112244';
  if (naYin.endsWith('Kim')) return ELEMENT_COLORS.Kim;
  if (naYin.endsWith('Mộc')) return ELEMENT_COLORS.Mộc;
  if (naYin.endsWith('Thủy')) return ELEMENT_COLORS.Thủy;
  if (naYin.endsWith('Hỏa')) return ELEMENT_COLORS.Hỏa;
  if (naYin.endsWith('Thổ')) return ELEMENT_COLORS.Thổ;
  return '#112244';
}
