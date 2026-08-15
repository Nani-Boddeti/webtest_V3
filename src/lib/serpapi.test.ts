// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { fetchSerpApiResults, SerpApiError } from './serpapi';

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as unknown as Response;
}

describe('fetchSerpApiResults', () => {
  it('calls SerpAPI with the expected query parameters and returns JSON', async () => {
    const fetcher = vi.fn(async () => jsonResponse({ search_metadata: { status: 'Success' } }));

    const data = await fetchSerpApiResults('Apple Watch Series 10', 'test-key', fetcher);

    expect(data.search_metadata?.status).toBe('Success');
    expect(fetcher).toHaveBeenCalledTimes(1);
    const url = new URL(fetcher.mock.calls[0][0] as string);
    expect(url.origin + url.pathname).toBe('https://serpapi.com/search.json');
    expect(url.searchParams.get('engine')).toBe('google');
    expect(url.searchParams.get('q')).toBe('Apple Watch Series 10');
    expect(url.searchParams.get('api_key')).toBe('test-key');
  });

  it('retries once when the first attempt returns 500', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, 500))
      .mockResolvedValueOnce(jsonResponse({ search_metadata: { status: 'Success' } }));

    const data = await fetchSerpApiResults('query', 'test-key', fetcher);

    expect(data.search_metadata?.status).toBe('Success');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('throws without retrying on a 401 and never exposes the key', async () => {
    const fetcher = vi.fn(async () => jsonResponse({ error: 'Invalid API key' }, 401));

    let caught: unknown;
    try {
      await fetchSerpApiResults('query', 'super-secret-key', fetcher);
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(SerpApiError);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(String(caught)).not.toContain('super-secret-key');
  });
});
