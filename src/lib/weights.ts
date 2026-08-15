/**
 * Client-side weight handling for the smartwatch comparison form.
 *
 * The five sliders each range from 0 to 100. Before a comparison request is
 * sent, their raw values are normalized into proportions that sum to one so
 * the backend receives a clean, comparable weighting regardless of how the
 * user has moved the sliders.
 */

import { ATTRIBUTE_KEYS, type AttributeKey, type AttributeWeights } from './types';

/** Equal default importance across all five attributes (sums to 100). */
export const DEFAULT_WEIGHTS: AttributeWeights = {
  price: 20,
  batteryLife: 20,
  sleepTracking: 20,
  durability: 20,
  subscriptionFree: 20,
};

/**
 * Normalize slider values (0-100 each) so they sum to one.
 *
 * Negative and non-numeric values are treated as zero. An all-zero weight set
 * falls back to equal weights so the form never sends a request with no
 * meaningful weighting.
 */
export function normalizeWeights(weights: AttributeWeights): AttributeWeights {
  const total = ATTRIBUTE_KEYS.reduce(
    (sum, key) => sum + Math.max(0, Number(weights[key]) || 0),
    0,
  );

  const result = {} as Record<AttributeKey, number>;
  if (total <= 0) {
    const equal = 1 / ATTRIBUTE_KEYS.length;
    for (const key of ATTRIBUTE_KEYS) result[key] = equal;
    return result;
  }

  for (const key of ATTRIBUTE_KEYS) {
    result[key] = Math.max(0, Number(weights[key]) || 0) / total;
  }
  return result;
}

/** True when at least two non-empty watch names are present. */
export function isValidWatchList(watches: string[]): boolean {
  return watches.filter((watch) => watch.trim().length > 0).length >= 2;
}
