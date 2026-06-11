import { Tip } from "@/types/tip";
import tipsData from "./tips.json";

export const tips: Tip[] = tipsData as Tip[];

export function getTipById(id: string): Tip | undefined {
  return tips.find((tip) => tip.id === id);
}

export function getTipsByCategory(category: string): Tip[] {
  return tips.filter(
    (tip) => tip.category.toLowerCase() === category.toLowerCase()
  );
}

export function getCategories(): string[] {
  const categorySet = new Set(tips.map((tip) => tip.category));
  return Array.from(categorySet).sort();
}

export function getFeaturedTips(): Tip[] {
  return tips.slice(0, 6);
}
