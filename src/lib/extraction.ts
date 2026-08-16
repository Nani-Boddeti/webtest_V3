/**
 * Deterministic attribute extraction from Serper.dev search results.
 *
 * The extractor pulls candidate values from `shopping`, `knowledgeGraph`,
 * `answerBox`, and `organic`. Serper.dev result formats vary, so extraction is
 * best-effort: when a value cannot be found the returned evidence has
 * `value: null` and `confidence: 'none'`, which callers turn into a warning
 * for that watch.
 */

import type { SerperResponse } from './serper';

export type Confidence = 'high' | 'medium' | 'low' | 'none';

/** Evidence extracted for a single attribute. */
export interface AttributeEvidence {
  /** Primary numeric signal used for scoring. `null` means unknown. */
  value: number | null;
  /** Human-readable display value. */
  display: string;
  /** Where the value came from (e.g. "shopping", "knowledgeGraph"). */
  source: string;
  /** Confidence in the extracted value. */
  confidence: Confidence;
}

/** Extracted evidence for all five comparison attributes. */
export interface ExtractedAttributes {
  price: AttributeEvidence;
  batteryLife: AttributeEvidence;
  sleepTracking: AttributeEvidence;
  durability: AttributeEvidence;
  subscriptionFree: AttributeEvidence;
}

interface TextChunk {
  source: string;
  text: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/** Gather candidate text from every Serper.dev block we know how to read. */
function collectTextChunks(data: SerperResponse): TextChunk[] {
  const chunks: TextChunk[] = [];

  if (data.knowledgeGraph) {
    if (isNonEmptyString(data.knowledgeGraph.title)) {
      chunks.push({ source: 'knowledgeGraph', text: data.knowledgeGraph.title });
    }
    if (isNonEmptyString(data.knowledgeGraph.description)) {
      chunks.push({ source: 'knowledgeGraph', text: data.knowledgeGraph.description });
    }
  }

  if (data.answerBox) {
    if (isNonEmptyString(data.answerBox.title)) {
      chunks.push({ source: 'answerBox', text: data.answerBox.title });
    }
    if (isNonEmptyString(data.answerBox.snippet)) {
      chunks.push({ source: 'answerBox', text: data.answerBox.snippet });
    }
    if (isNonEmptyString(data.answerBox.answer)) {
      chunks.push({ source: 'answerBox', text: data.answerBox.answer });
    }
  }

  for (const result of data.organic ?? []) {
    const parts = [result.title, result.snippet].filter(isNonEmptyString);
    if (parts.length > 0) {
      chunks.push({ source: 'organic', text: parts.join('. ') });
    }
  }

  for (const result of data.shopping ?? []) {
    if (isNonEmptyString(result.title)) {
      chunks.push({ source: 'shopping', text: result.title });
    }
  }

  return chunks;
}

const SOURCE_PRIORITY: Record<string, number> = {
  answerBox: 0,
  knowledgeGraph: 1,
  organic: 2,
  shopping: 3,
};

function sourcePriority(source: string): number {
  return SOURCE_PRIORITY[source] ?? 4;
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

function parseMoney(text: string): number | null {
  const match = text.match(/\$\s?([\d,]+(?:\.\d+)?)/);
  if (!match) return null;
  const cleaned = match[1].replace(/,/g, '');
  const value = Number(cleaned);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function parseHours(text: string): number | null {
  const dayMatch = text.match(/(\d+(?:\.\d+)?)\s*[-– ]?\s*days?\b/i);
  if (dayMatch) return Number(dayMatch[1]) * 24;

  const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*[-– ]?\s*(?:hours?|hrs?)\b/i);
  if (hourMatch) return Number(hourMatch[1]);

  return null;
}

function extractPrice(data: SerperResponse): AttributeEvidence {
  for (const result of data.shopping ?? []) {
    // Prefer the raw price string to preserve the retailer's formatting.
    if (isNonEmptyString(result.price)) {
      const parsed = parseMoney(result.price);
      if (parsed !== null) {
        return {
          value: parsed,
          display: result.price.trim(),
          source: 'shopping',
          confidence: 'high',
        };
      }
    }
  }

  // Fallback: first currency amount found in any text block.
  for (const chunk of collectTextChunks(data)) {
    const parsed = parseMoney(chunk.text);
    if (parsed !== null) {
      return { value: parsed, display: formatMoney(parsed), source: chunk.source, confidence: 'low' };
    }
  }

  return { value: null, display: 'Not available', source: 'none', confidence: 'none' };
}

function extractBatteryLife(data: SerperResponse): AttributeEvidence {
  const chunks = [...collectTextChunks(data)].sort(
    (a, b) => sourcePriority(a.source) - sourcePriority(b.source),
  );

  for (const chunk of chunks) {
    if (!/\bbattery\b/i.test(chunk.text)) continue;
    const hours = parseHours(chunk.text);
    if (hours !== null && hours > 0) {
      return {
        value: hours,
        display: `${hours} hours`,
        source: chunk.source,
        confidence: 'medium',
      };
    }
  }

  return { value: null, display: 'Not available', source: 'none', confidence: 'none' };
}

function extractSleepTracking(data: SerperResponse): AttributeEvidence {
  const text = collectTextChunks(data)
    .map((chunk) => chunk.text)
    .join(' \n ');

  const supported =
    /\bsleep\s*(?:tracking|monitoring|score|stages?|insights?)\b|\btracks?\s+sleep\b/i.test(text);
  if (supported) {
    return { value: 100, display: 'Supported', source: 'text', confidence: 'medium' };
  }

  const notSupported = /\bno\s+sleep\s+tracking\b|\blacks?\s+sleep\s+tracking\b/i.test(text);
  if (notSupported) {
    return { value: 0, display: 'Not supported', source: 'text', confidence: 'medium' };
  }

  return { value: null, display: 'Not available', source: 'none', confidence: 'none' };
}

function extractDurability(data: SerperResponse): AttributeEvidence {
  const text = collectTextChunks(data)
    .map((chunk) => chunk.text)
    .join(' \n ');

  const waterSignals: { pattern: RegExp; label: string; points: number }[] = [
    { pattern: /\b10\s*atm\b|100\s*m(?:eters)?\b/i, label: '10 ATM water resistance', points: 35 },
    { pattern: /\b5\s*atm\b|50\s*m(?:eters)?\b/i, label: '5 ATM water resistance', points: 30 },
    { pattern: /\bip68\b/i, label: 'IP68 rating', points: 25 },
    { pattern: /\bip6[0-7]\b/i, label: 'IP6X rating', points: 15 },
    { pattern: /water[- ]?resist(?:ant)?/i, label: 'Water resistant', points: 20 },
  ];

  const bonusSignals: { pattern: RegExp; label: string; points: number }[] = [
    { pattern: /mil-std-810/i, label: 'MIL-STD-810 certified', points: 25 },
    { pattern: /\bsapphire\b/i, label: 'Sapphire crystal', points: 20 },
    { pattern: /\btitanium\b/i, label: 'Titanium case', points: 15 },
    { pattern: /gorilla glass/i, label: 'Gorilla Glass', points: 10 },
  ];

  const found: string[] = [];
  let score = 0;

  const bestWater = waterSignals.find((signal) => signal.pattern.test(text));
  if (bestWater) {
    score += bestWater.points;
    found.push(bestWater.label);
  }

  for (const signal of bonusSignals) {
    if (signal.pattern.test(text)) {
      score += signal.points;
      found.push(signal.label);
    }
  }

  if (score === 0) {
    return { value: null, display: 'No durability signals found', source: 'none', confidence: 'none' };
  }

  return {
    value: Math.min(score, 100),
    display: found.join(', '),
    source: 'text',
    confidence: 'medium',
  };
}

function extractSubscriptionFree(data: SerperResponse): AttributeEvidence {
  const text = collectTextChunks(data)
    .map((chunk) => chunk.text)
    .join(' \n ');

  // Negated forms must be checked first so "no subscription required" is not
  // mistaken for a required subscription.
  const free =
    /subscription[- ]free|no\s+(?:paid\s+|monthly\s+)?subscription|no\s+monthly\s+fee|without\s+(?:a\s+|any\s+)?subscription/i.test(
      text,
    );
  if (free) {
    return { value: 100, display: 'No subscription required', source: 'text', confidence: 'high' };
  }

  const required =
    /requires?\s+(?:a\s+)?(?:paid\s+)?(?:monthly\s+)?subscription|subscription\s+(?:is\s+)?required|mandatory\s+subscription|requires?\s+premium/i.test(
      text,
    );
  if (required) {
    return { value: 0, display: 'Requires a subscription', source: 'text', confidence: 'medium' };
  }

  const optional =
    /optional\s+(?:premium\s+)?subscription|subscription\s+(?:is\s+)?optional/i.test(text);
  if (optional) {
    return {
      value: 100,
      display: 'Core features subscription-free',
      source: 'text',
      confidence: 'low',
    };
  }

  return { value: null, display: 'Not available', source: 'none', confidence: 'none' };
}

/** Extract evidence for all five attributes from a Serper.dev response. */
export function extractAttributes(data: SerperResponse): ExtractedAttributes {
  return {
    price: extractPrice(data),
    batteryLife: extractBatteryLife(data),
    sleepTracking: extractSleepTracking(data),
    durability: extractDurability(data),
    subscriptionFree: extractSubscriptionFree(data),
  };
}
