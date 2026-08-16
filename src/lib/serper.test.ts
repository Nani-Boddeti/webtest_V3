// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { fetchSerperResults, SerperError } from './serper';

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as unknown as Response;
}

describe('fetchSerperResults', () => {
  it('POSTs to Serper.dev with the expected headers and JSON body', async () => {
    const fetcher = vi.fn(async () => jsonResponse({ searchParameters: { q: 'Apple Watch Series 10' } }));

    const data = await fetchSerperResults('Apple Watch Series 10', 'test-key', fetcher);

    expect(data.searchParameters?.q).toBe('Apple Watch Series 10');
    expect(fetcher).toHaveBeenCalledTimes(1);

    const [url, init] = fetcher.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://google.serper.dev/search');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['X-API-KEY']).toBe('test-key');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect(JSON.parse(String(init.body))).toEqual({ q: 'Apple Watch Series 10' });
  });

  it('retries once when the first attempt returns 500', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, 500))
      .mockResolvedValueOnce(jsonResponse({ searchParameters: { q: 'query' } }));

    const data = await fetchSerperResults('query', 'test-key', fetcher);

    expect(data.searchParameters?.q).toBe('query');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('throws without retrying on a 401 and never exposes the key', async () => {
    const fetcher = vi.fn(async () => jsonResponse({ message: 'Invalid API key' }, 401));

    let caught: unknown;
    try {
      await fetchSerperResults('query', 'super-secret-key', fetcher);
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(SerperError);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(String(caught)).not.toContain('super-secret-key');
  });
});
