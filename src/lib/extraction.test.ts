import { describe, expect, it } from 'vitest';
import { extractAttributes } from './extraction';
import appleData from './fixtures/apple-watch-series-10.json';
import garminData from './fixtures/garmin-forerunner-265.json';

describe('extractAttributes', () => {
  it('extracts price from shopping_results', () => {
    const extracted = extractAttributes(appleData);

    expect(extracted.price.value).toBe(399);
    expect(extracted.price.display).toBe('$399.00');
    expect(extracted.price.confidence).toBe('high');
    expect(extracted.price.source).toBe('shopping_results');
  });

  it('extracts battery life in hours, converting days to hours', () => {
    expect(extractAttributes(appleData).batteryLife.value).toBe(18);
    expect(extractAttributes(garminData).batteryLife.value).toBe(312);
  });

  it('detects sleep tracking support', () => {
    expect(extractAttributes(appleData).sleepTracking.value).toBe(100);
    expect(extractAttributes(garminData).sleepTracking.value).toBe(100);
  });

  it('detects durability signals', () => {
    expect(extractAttributes(appleData).durability.value).toBe(30);
    expect(extractAttributes(garminData).durability.value).toBe(30);
    expect(extractAttributes(garminData).durability.display).toContain('5 ATM');
  });

  it('detects subscription-free operation', () => {
    const garmin = extractAttributes(garminData);
    expect(garmin.subscriptionFree.value).toBe(100);
    expect(garmin.subscriptionFree.confidence).toBe('high');
  });

  it('returns null values for attributes that cannot be found', () => {
    const extracted = extractAttributes({ search_metadata: { status: 'Success' } });

    expect(extracted.price.value).toBeNull();
    expect(extracted.batteryLife.value).toBeNull();
    expect(extracted.sleepTracking.value).toBeNull();
    expect(extracted.durability.value).toBeNull();
    expect(extracted.subscriptionFree.value).toBeNull();
  });
});
