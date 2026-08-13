import { describe, expect, it } from 'vitest';
import { DEFAULT_WEIGHTS, isValidWatchList, normalizeWeights } from './weights';

const allKeys = {
  price: 0,
  batteryLife: 0,
  sleepTracking: 0,
  durability: 0,
  subscriptionFree: 0,
};

function sum(values: Record<string, number>): number {
  return Object.values(values).reduce((total, value) => total + value, 0);
}

describe('normalizeWeights', () => {
  it('normalizes slider values so they sum to one', () => {
    const normalized = normalizeWeights({ ...DEFAULT_WEIGHTS });

    expect(sum(normalized)).toBeCloseTo(1);
    expect(normalized.price).toBeCloseTo(0.2);
  });

  it('scales uneven weights proportionally', () => {
    const normalized = normalizeWeights({ ...allKeys, price: 50, batteryLife: 50 });

    expect(sum(normalized)).toBeCloseTo(1);
    expect(normalized.price).toBeCloseTo(0.5);
    expect(normalized.batteryLife).toBeCloseTo(0.5);
    expect(normalized.durability).toBe(0);
  });

  it('falls back to equal weights when every slider is zero', () => {
    const normalized = normalizeWeights(allKeys);

    expect(normalized.price).toBeCloseTo(0.2);
    expect(normalized.subscriptionFree).toBeCloseTo(0.2);
  });

  it('treats negative values as zero', () => {
    const normalized = normalizeWeights({ ...allKeys, price: -10, batteryLife: 30 });

    expect(sum(normalized)).toBeCloseTo(1);
    expect(normalized.price).toBe(0);
    expect(normalized.batteryLife).toBeCloseTo(1);
  });
});

describe('isValidWatchList', () => {
  it('requires at least two non-empty watch names', () => {
    expect(isValidWatchList(['', ''])).toBe(false);
    expect(isValidWatchList(['Apple Watch Series 10', ''])).toBe(false);
    expect(isValidWatchList(['Apple Watch Series 10', '  ', 'Garmin Forerunner 265'])).toBe(true);
  });

  it('ignores whitespace-only entries', () => {
    expect(isValidWatchList(['   ', 'Garmin Forerunner 265'])).toBe(false);
  });
});

describe('DEFAULT_WEIGHTS', () => {
  it('sums to 100 across the five attributes', () => {
    expect(sum(DEFAULT_WEIGHTS)).toBe(100);
  });
});
