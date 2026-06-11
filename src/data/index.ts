import tipsData from './tips.json';
import type { Tip } from './types';

export type { Tip } from './types';

const tips: Tip[] = tipsData.map((tip, index) => ({
  ...tip,
  excerpt: tip.excerpt || tip.content.substring(0, 120) + '...',
}));

export const TIPS_PER_PAGE = 10;
export const TOTAL_TIPS = tips.length;
export const TOTAL_PAGES = Math.ceil(TOTAL_TIPS / TIPS_PER_PAGE);

export function getTipsForPage(page: number): Tip[] {
  const start = (page - 1) * TIPS_PER_PAGE;
  return tips.slice(start, start + TIPS_PER_PAGE);
}

export function getAllTips(): Tip[] {
  return tips;
}
