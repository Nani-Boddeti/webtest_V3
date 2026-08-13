/**
 * Shared type contracts for the smartwatch comparison app.
 *
 * These types define the shape of data exchanged between the client form and
 * the `/api/compare` route. They are shared by both the frontend and backend.
 */

/** The five comparison attributes the app scores watches on. */
export type AttributeKey =
  | 'price'
  | 'batteryLife'
  | 'sleepTracking'
  | 'durability'
  | 'subscriptionFree';

/** User-adjustable importance weights, one entry per attribute. */
export type AttributeWeights = Record<AttributeKey, number>;

/** Canonical ordering of the five compared attributes. */
export const ATTRIBUTE_KEYS = [
  'price',
  'batteryLife',
  'sleepTracking',
  'durability',
  'subscriptionFree',
] as const;

/** Human-readable labels for the five compared attributes. */
export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  price: 'Price',
  batteryLife: 'Battery Life',
  sleepTracking: 'Sleep Tracking',
  durability: 'Durability',
  subscriptionFree: 'Subscription-Free',
};

/** Request body for POST /api/compare. */
export interface CompareRequest {
  /** Watch names to compare. Must contain at least two entries. */
  watches: string[];
  /** Importance weights for each attribute. Client normalizes these before sending. */
  weights: AttributeWeights;
  /** Optional free-text use case the user cares about (e.g. "running and hiking"). */
  purpose?: string;
}

/** A single attribute's score for one watch. */
export interface AttributeScore {
  /** The attribute this score belongs to. */
  attribute: AttributeKey;
  /** Human-readable label for the attribute. */
  label: string;
  /** 0-100 score; higher is better. */
  score: number;
  /** Short human-readable evidence/summary behind the score. */
  detail: string;
}

/** Comparison result for a single watch. */
export interface WatchResult {
  /** The watch name exactly as provided in the request. */
  name: string;
  /** Per-attribute scores for the five compared attributes. */
  scores: AttributeScore[];
  /** Non-fatal warnings surfaced to the user (e.g. missing or low-confidence data). */
  warnings: string[];
  /** Weighted total score (0-100). */
  totalScore: number;
}

/** Final verdict panel content. */
export interface Verdict {
  /** Name of the winning watch. */
  winner: string;
  /** One-line headline for the verdict. */
  summary: string;
  /** Longer explanation of why the winner was chosen. */
  justification: string;
}

/** Response body for POST /api/compare. */
export interface CompareResponse {
  /** Comparison results, one entry per requested watch. */
  results: WatchResult[];
  /** Computed verdict with the winning watch and rationale. */
  verdict: Verdict;
}
