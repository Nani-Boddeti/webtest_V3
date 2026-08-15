/**
 * Minimal SerpAPI client for the smartwatch comparison app.
 *
 * The API key is passed in explicitly by the caller (the `/api/compare` route
 * reads it from `process.env.SERPAPI_API_KEY`) so this module never touches the
 * environment or logs the key. Tests inject a fake `fetch` to avoid network
 * calls; the key is never surfaced in error messages.
 */

/** A single organic search result returned by SerpAPI. */
export interface SerpApiOrganicResult {
  position?: number;
  title?: string;
  link?: string;
  snippet?: string;
  [key: string]: unknown;
}

/** A single shopping result returned by SerpAPI. */
export interface SerpApiShoppingResult {
  position?: number;
  title?: string;
  link?: string;
  source?: string;
  price?: string;
  extracted_price?: number;
  rating?: number;
  reviews?: number;
  [key: string]: unknown;
}

/** The knowledge graph block returned by SerpAPI. */
export interface SerpApiKnowledgeGraph {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

/** The featured snippet / answer box returned by SerpAPI. */
export interface SerpApiAnswerBox {
  type?: string;
  title?: string;
  snippet?: string;
  answer?: string;
  [key: string]: unknown;
}

/** Top-level SerpAPI JSON response. */
export interface SerpApiResponse {
  search_metadata?: { status?: string; [key: string]: unknown };
  organic_results?: SerpApiOrganicResult[];
  shopping_results?: SerpApiShoppingResult[];
  knowledge_graph?: SerpApiKnowledgeGraph;
  answer_box?: SerpApiAnswerBox;
  [key: string]: unknown;
}

/** Error raised when SerpAPI cannot return a usable response. */
export class SerpApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'SerpApiError';
    this.status = status;
  }
}

const SERPAPI_ENDPOINT = 'https://serpapi.com/search.json';
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 2;

type Fetcher = typeof fetch;

function buildUrl(query: string, apiKey: string): string {
  const url = new URL(SERPAPI_ENDPOINT);
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', apiKey);
  return url.toString();
}

function isRetriableStatus(status: number): boolean {
  return status >= 500 || status === 408 || status === 429;
}

async function fetchOnce(url: string, fetcher: Fetcher): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetcher(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch SerpAPI results for a single search query.
 *
 * Retries once on transient failures (network errors, timeouts, HTTP 408/429,
 * or any 5xx). Non-transient HTTP errors (e.g. 401 for an invalid key) are
 * thrown immediately. Error messages never include the API key.
 */
export async function fetchSerpApiResults(
  query: string,
  apiKey: string,
  fetcher: Fetcher = fetch,
): Promise<SerpApiResponse> {
  const url = buildUrl(query, apiKey);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchOnce(url, fetcher);
      if (response.ok) {
        return (await response.json()) as SerpApiResponse;
      }

      const statusError = new SerpApiError(
        `SerpAPI request failed with status ${response.status}`,
        response.status,
      );
      if (!isRetriableStatus(response.status) || attempt === MAX_ATTEMPTS) {
        throw statusError;
      }
    } catch (error) {
      if (error instanceof SerpApiError) {
        throw error;
      }
      if (attempt === MAX_ATTEMPTS) {
        break;
      }
    }
  }

  throw new SerpApiError('SerpAPI request failed: network error or timeout');
}
