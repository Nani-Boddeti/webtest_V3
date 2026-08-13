import { describe, expect, it } from 'vitest';
import { extractAttributes } from './extraction';
import appleData from './fixtures/apple-watch-series-10.json';
import garminData from './fixtures/garmin-forerunner-265.json';
import {
  buildVerdict,
  computeResults,
  normalizeWeights,
  scoreBattery,
  scorePrice,
} from './scoring';

const EQUAL_WEIGHTS = {
  price: 1,
  batteryLife: 1,
  sleepTracking: 1,
  durability: 1,
  subscriptionFree: 1,
};

describe('normalizeWeights', () => {
  it('normalizes weights so they sum to one', () => {
    const normalized = normalizeWeights({ ...EQUAL_WEIGHTS, price: 2 });

    const total = Object.values(normalized).reduce((sum, value) => sum + value, 0);
    expect(total).toBeCloseTo(1);
    expect(normalized.price).toBeCloseTo(2 / 6);
  });

  it('falls back to equal weights when all weights are zero', () => {
    const normalized = normalizeWeights({
      price: 0,
      batteryLife: 0,
      sleepTracking: 0,
      durability: 0,
      subscriptionFree: 0,
    });

    expect(normalized.price).toBeCloseTo(0.2);
    expect(normalized.subscriptionFree).toBeCloseTo(0.2);
  });
});

describe('score helpers', () => {
  it('scores lower prices higher relative to the cheapest watch', () => {
    expect(scorePrice(399, 399)).toBe(100);
    expect(scorePrice(449.99, 399)).toBeLessThan(100);
    expect(scorePrice(null, 399)).toBe(50);
  });

  it('scores longer battery life higher relative to the longest-lived watch', () => {
    expect(scoreBattery(312, 312)).toBe(100);
    expect(scoreBattery(18, 312)).toBeLessThan(100);
    expect(scoreBattery(null, 312)).toBe(50);
  });
});

describe('computeResults', () => {
  it('computes weighted totals and prefers the watch with stronger battery life', () => {
    const results = computeResults(
      [
        { name: 'Apple Watch Series 10', extracted: extractAttributes(appleData) },
        { name: 'Garmin Forerunner 265', extracted: extractAttributes(garminData) },
      ],
      EQUAL_WEIGHTS,
    );

    expect(results).toHaveLength(2);
    expect(results[0].scores).toHaveLength(5);

    const garmin = results.find((result) => result.name === 'Garmin Forerunner 265');
    const apple = results.find((result) => result.name === 'Apple Watch Series 10');
    if (!garmin || !apple) throw new Error('expected both watch results');

    expect(garmin.totalScore).toBeGreaterThan(apple.totalScore);
  });

  it('assigns a failed watch a zero score and a warning', () => {
    const results = computeResults(
      [
        { name: 'Apple Watch Series 10', extracted: extractAttributes(appleData) },
        {
          name: 'Unknown Watch',
          extracted: null,
          error: 'Could not retrieve search results for Unknown Watch.',
        },
      ],
      EQUAL_WEIGHTS,
    );

    const failed = results.find((result) => result.name === 'Unknown Watch');
    if (!failed) throw new Error('expected failed watch result');

    expect(failed.totalScore).toBe(0);
    expect(failed.warnings.length).toBeGreaterThan(0);
  });

  it('adds warnings for missing attributes', () => {
    const sparse = extractAttributes({ search_metadata: { status: 'Success' } });
    const results = computeResults(
      [
        { name: 'Sparse Watch', extracted: sparse },
        { name: 'Apple Watch Series 10', extracted: extractAttributes(appleData) },
      ],
      EQUAL_WEIGHTS,
    );

    const sparseResult = results.find((result) => result.name === 'Sparse Watch');
    if (!sparseResult) throw new Error('expected sparse watch result');

    expect(sparseResult.warnings.length).toBe(5);
  });
});

describe('buildVerdict', () => {
  it('picks a winner and references the purpose when provided', () => {
    const results = computeResults(
      [
        { name: 'Apple Watch Series 10', extracted: extractAttributes(appleData) },
        { name: 'Garmin Forerunner 265', extracted: extractAttributes(garminData) },
      ],
      EQUAL_WEIGHTS,
    );

    const verdict = buildVerdict(results, 'marathon training');

    expect(verdict.winner).toBe('Garmin Forerunner 265');
    expect(verdict.summary).toContain('Garmin Forerunner 265');
    expect(verdict.justification).toContain('marathon training');
    expect(verdict.justification).toContain('battery life');
  });
});
