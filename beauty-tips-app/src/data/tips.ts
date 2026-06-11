import { Tip } from "@/types/tip";
import tipsData from "./tips.json";

export const tips: Tip[] = tipsData as Tip[];

export function getFeaturedTips(): Tip[] {
  return tips.slice(0, 6);
}

export function getTipById(id: number): Tip | undefined {
  return tips.find((tip) => tip.id === id);
}

export function getTipsByCategory(category: string): Tip[] {
  return tips.filter(
    (tip) => tip.category.toLowerCase() === category.toLowerCase()
  );
}

export function getCategories(): string[] {
  const categories = new Set(tips.map((tip) => tip.category));
  return Array.from(categories);
}

export function getPaginatedTips(page: number, pageSize: number = 10): {
  tips: Tip[];
  totalPages: number;
  total: number;
} {
  const total = tips.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    tips: tips.slice(start, end),
    totalPages,
    total,
  };
}
