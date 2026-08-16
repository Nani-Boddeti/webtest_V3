/**
 * POST /api/compare
 *
 * Accepts two or more watch names plus optional importance weights and a
 * purpose, fetches Serper.dev results for each watch server-side, extracts the
 * five comparison attributes, and returns weighted scores plus a verdict.
 *
 * The Serper.dev key is read from `process.env.SERPER_API_KEY` and is never
 * returned to the client or included in error messages.
 */

import { NextResponse } from 'next/server';
import { extractAttributes } from '../../../lib/extraction';
import { buildVerdict, computeResults, type WatchExtraction } from '../../../lib/scoring';
import { fetchSerperResults } from '../../../lib/serper';
import {
  ATTRIBUTE_KEYS,
  type AttributeKey,
  type AttributeWeights,
  type CompareResponse,
} from '../../../lib/types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function error(status: number, message: string): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/** Parse and dedupe watch names (case-insensitive), preserving first casing. */
function parseWatches(body: unknown): string[] | null {
  if (!isRecord(body) || !Array.isArray(body.watches)) return null;

  const seen = new Set<string>();
  const watches: string[] = [];
  for (const item of body.watches) {
    if (typeof item !== 'string') continue;
    const trimmed = item.trim();
    if (trimmed.length === 0) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    watches.push(trimmed);
  }
  return watches;
}

/** Validate that all five attribute weights are present as finite numbers. */
function parseWeights(body: unknown): AttributeWeights | null {
  if (!isRecord(body) || !isRecord(body.weights)) return null;

  const parsed = {} as Record<AttributeKey, number>;
  for (const key of ATTRIBUTE_KEYS) {
    const value = body.weights[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    parsed[key] = value;
  }
  return parsed;
}

function parsePurpose(body: unknown): string | undefined {
  if (!isRecord(body)) return undefined;
  return typeof body.purpose === 'string' && body.purpose.trim().length > 0
    ? body.purpose.trim()
    : undefined;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error(400, 'Request body must be valid JSON.');
  }

  const watches = parseWatches(body);
  if (watches === null || watches.length < 2) {
    return error(400, 'Provide at least two watch names to compare.');
  }

  const weights = parseWeights(body);
  if (weights === null) {
    return error(400, 'Provide numeric weights for all five comparison attributes.');
  }

  const purpose = parsePurpose(body);

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return error(500, 'Server is missing the SERPER_API_KEY environment variable.');
  }

  const entries: WatchExtraction[] = [];
  for (const name of watches) {
    try {
      const data = await fetchSerperResults(name, apiKey);
      entries.push({ name, extracted: extractAttributes(data) });
    } catch {
      entries.push({ name, extracted: null, error: `Could not retrieve search results for ${name}.` });
    }
  }

  const results = computeResults(entries, weights);
  const verdict = buildVerdict(results, purpose);

  const response: CompareResponse = { results, verdict };
  return NextResponse.json(response);
}
