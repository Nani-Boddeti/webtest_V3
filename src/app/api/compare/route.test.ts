// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import appleData from '../../../lib/fixtures/apple-watch-series-10.json';
import garminData from '../../../lib/fixtures/garmin-forerunner-265.json';
import { POST } from './route';

const EQUAL_WEIGHTS = {
  price: 1,
  batteryLife: 1,
  sleepTracking: 1,
  durability: 1,
  subscriptionFree: 1,
};

const mockFetch = vi.fn();

function jsonRequest(body: unknown): Request {
  return { json: async () => body } as unknown as Request;
}

beforeEach(() => {
  vi.stubEnv('SERPER_API_KEY', 'test-key');
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
  mockFetch.mockImplementation(async (_url: string, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body ?? '{}')) as { q?: string };
    const query = body.q ?? '';
    const data = query.toLowerCase().includes('apple') ? appleData : garminData;
    return { ok: true, status: 200, json: async () => data };
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('POST /api/compare', () => {
  it('validates that at least two watches are provided', async () => {
    const response = await POST(
      jsonRequest({ watches: ['Apple Watch Series 10'], weights: EQUAL_WEIGHTS }),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('at least two');
  });

  it('validates that a weights object is provided', async () => {
    const response = await POST(
      jsonRequest({ watches: ['Apple Watch Series 10', 'Garmin Forerunner 265'] }),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('weights');
  });

  it('returns 400 for invalid JSON bodies', async () => {
    const badRequest = {
      json: async () => {
        throw new Error('invalid json');
      },
    } as unknown as Request;

    const response = await POST(badRequest);
    expect(response.status).toBe(400);
  });

  it('returns 500 when SERPER_API_KEY is missing', async () => {
    vi.stubEnv('SERPER_API_KEY', '');

    const response = await POST(
      jsonRequest({
        watches: ['Apple Watch Series 10', 'Garmin Forerunner 265'],
        weights: EQUAL_WEIGHTS,
      }),
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toContain('SERPER_API_KEY');
  });

  it('returns comparison results and a verdict', async () => {
    const response = await POST(
      jsonRequest({
        watches: ['Apple Watch Series 10', 'Garmin Forerunner 265'],
        weights: EQUAL_WEIGHTS,
        purpose: 'running and hiking',
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();

    expect(body.results).toHaveLength(2);
    expect(body.results[0].name).toBe('Apple Watch Series 10');
    expect(body.results[1].name).toBe('Garmin Forerunner 265');
    expect(body.results[0].scores).toHaveLength(5);
    expect(body.verdict.winner).toBeTruthy();
    expect(JSON.stringify(body)).not.toContain('test-key');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('deduplicates watch names case-insensitively', async () => {
    const response = await POST(
      jsonRequest({
        watches: ['Apple Watch Series 10', 'apple watch series 10', 'Garmin Forerunner 265'],
        weights: EQUAL_WEIGHTS,
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.results).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('returns warnings instead of omitting a watch whose query fails', async () => {
    mockFetch.mockImplementation(async () => {
      return { ok: false, status: 500, json: async () => ({}) };
    });

    const response = await POST(
      jsonRequest({
        watches: ['Apple Watch Series 10', 'Garmin Forerunner 265'],
        weights: EQUAL_WEIGHTS,
      }),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.results).toHaveLength(2);
    for (const result of body.results) {
      expect(result.warnings.length).toBeGreaterThan(0);
    }
  });
});
