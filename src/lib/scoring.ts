/**
 * Weighted scoring and verdict generation for the smartwatch comparison.
 *
 * Scoring is deterministic. Attributes with missing data receive a neutral
 * score and a warning so a watch is never silently punished for unavailable
 * data. Watches whose search query failed entirely receive a zero score and a
 * prominent warning so they cannot win the comparison by accident.
 */

import {
  ATTRIBUTE_KEYS,
  ATTRIBUTE_LABELS,
  type AttributeKey,
  type AttributeScore,
  type AttributeWeights,
  type Verdict,
  type WatchResult,
} from './types';
import type { AttributeEvidence, ExtractedAttributes } from './extraction';

/** Neutral score assigned when an attribute's value is unknown. */
export const NEUTRAL_SCORE = 50;
/** Score assigned to every attribute when a watch's query failed entirely. */
export const FAILED_SCORE = 0;

/** One watch's extraction result, including total failures. */
export interface WatchExtraction {
  name: string;
  /** `null` when the watch query failed entirely. */
  extracted: ExtractedAttributes | null;
  /** Optional failure reason for total failures. */
  error?: string;
}

/**
 * Normalize weights so they sum to one. Negative/NaN values are treated as
 * zero, and an all-zero weight set falls back to equal weights.
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

/** Score price relative to the cheapest watch (lower price scores higher). */
export function scorePrice(value: number | null, minPrice: number | null): number {
  if (value === null || minPrice === null || minPrice <= 0) return NEUTRAL_SCORE;
  return Math.round((minPrice / value) * 100);
}

/** Score battery life relative to the longest-lived watch (more hours scores higher). */
export function scoreBattery(value: number | null, maxHours: number | null): number {
  if (value === null || maxHours === null || maxHours <= 0) return NEUTRAL_SCORE;
  return Math.min(100, Math.round((value / maxHours) * 100));
}

/** Score sleep tracking support (100 supported, 0 unsupported, neutral unknown). */
export function scoreSleep(value: number | null): number {
  if (value === null) return NEUTRAL_SCORE;
  return value > 0 ? 100 : 0;
}

/** Score durability using the extracted 0-100 index. */
export function scoreDurability(value: number | null): number {
  if (value === null) return NEUTRAL_SCORE;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** Score subscription-free operation (100 free, 0 required, neutral unknown). */
export function scoreSubscription(value: number | null): number {
  if (value === null) return NEUTRAL_SCORE;
  return value > 0 ? 100 : 0;
}

function minNonNull(values: (number | null)[]): number | null {
  const present = values.filter((value): value is number => value !== null);
  return present.length > 0 ? Math.min(...present) : null;
}

function maxNonNull(values: (number | null)[]): number | null {
  const present = values.filter((value): value is number => value !== null);
  return present.length > 0 ? Math.max(...present) : null;
}

function evidenceFor(key: AttributeKey, extracted: ExtractedAttributes): AttributeEvidence {
  switch (key) {
    case 'price':
      return extracted.price;
    case 'batteryLife':
      return extracted.batteryLife;
    case 'sleepTracking':
      return extracted.sleepTracking;
    case 'durability':
      return extracted.durability;
    case 'subscriptionFree':
      return extracted.subscriptionFree;
  }
}

function buildWarnings(name: string, extracted: ExtractedAttributes): string[] {
  const warnings: string[] = [];
  for (const key of ATTRIBUTE_KEYS) {
    const evidence = evidenceFor(key, extracted);
    if (evidence.value === null) {
      warnings.push(`No ${ATTRIBUTE_LABELS[key].toLowerCase()} data found for ${name}.`);
    } else if (evidence.confidence === 'low') {
      warnings.push(`${ATTRIBUTE_LABELS[key]} for ${name} is based on low-confidence data.`);
    }
  }
  return warnings;
}

/**
 * Compute per-watch results, including attribute scores, warnings, and the
 * weighted total score. Price and battery life are scored relative to the
 * other watches in the comparison.
 */
export function computeResults(
  entries: WatchExtraction[],
  weights: AttributeWeights,
): WatchResult[] {
  const normalized = normalizeWeights(weights);
  const minPrice = minNonNull(entries.map((entry) => entry.extracted?.price.value ?? null));
  const maxHours = maxNonNull(entries.map((entry) => entry.extracted?.batteryLife.value ?? null));

  return entries.map((entry) => {
    if (entry.extracted === null) {
      return {
        name: entry.name,
        scores: ATTRIBUTE_KEYS.map((key) => ({
          attribute: key,
          label: ATTRIBUTE_LABELS[key],
          score: FAILED_SCORE,
          detail: 'Not available',
        })),
        warnings: [entry.error ?? `Could not retrieve data for ${entry.name}.`],
        totalScore: FAILED_SCORE,
      };
    }

    const extracted = entry.extracted;
    const scoreByKey: Record<AttributeKey, number> = {
      price: scorePrice(extracted.price.value, minPrice),
      batteryLife: scoreBattery(extracted.batteryLife.value, maxHours),
      sleepTracking: scoreSleep(extracted.sleepTracking.value),
      durability: scoreDurability(extracted.durability.value),
      subscriptionFree: scoreSubscription(extracted.subscriptionFree.value),
    };

    const scores: AttributeScore[] = ATTRIBUTE_KEYS.map((key) => ({
      attribute: key,
      label: ATTRIBUTE_LABELS[key],
      score: scoreByKey[key],
      detail: evidenceFor(key, extracted).display,
    }));

    const totalScore = Math.round(
      ATTRIBUTE_KEYS.reduce((sum, key) => sum + scoreByKey[key] * normalized[key], 0),
    );

    return {
      name: entry.name,
      scores,
      warnings: buildWarnings(entry.name, extracted),
      totalScore,
    };
  });
}

/** Build the verdict from computed results, optionally referencing a purpose. */
export function buildVerdict(results: WatchResult[], purpose?: string): Verdict {
  if (results.length === 0) {
    return {
      winner: '',
      summary: 'No comparison results available.',
      justification: 'Provide at least two watches to compare.',
    };
  }

  const winner = results.reduce(
    (best, current) => (current.totalScore > best.totalScore ? current : best),
    results[0],
  );

  const runnerUp = results
    .filter((result) => result !== winner)
    .reduce((best, current) => {
      if (best === undefined || current.totalScore > best.totalScore) return current;
      return best;
    }, undefined as WatchResult | undefined);

  const topAttributes = [...winner.scores].sort((a, b) => b.score - a.score).slice(0, 2);
  const strengths = topAttributes
    .map((score) => `${score.label.toLowerCase()} (${score.detail})`)
    .join(' and ');

  const summary = `${winner.name} offers the best value${purpose ? ` for ${purpose}` : ''}.`;
  const justification = [
    `${winner.name} earned a weighted score of ${winner.totalScore}, led by ${strengths}.`,
    runnerUp
      ? `It outscored ${runnerUp.name} (${winner.totalScore} vs ${runnerUp.totalScore}).`
      : '',
    purpose ? `The weighted comparison is tailored to your stated purpose: "${purpose}".` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return { winner: winner.name, summary, justification };
}
