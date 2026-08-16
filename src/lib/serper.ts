/**
 * Minimal Serper.dev client for the smartwatch comparison app.
 *
 * The API key is passed in explicitly by the caller (the `/api/compare` route
 * reads it from `process.env.SERPER_API_KEY`) so this module never touches the
 * environment or logs the key. Tests inject a fake `fetch` to avoid network
 * calls; the key is never surfaced in error messages.
 */

/** A single organic search result returned by Serper.dev. */
export interface SerperOrganicResult {
  position?: number;
  title?: string;
  link?: string;
  snippet?: string;
  [key: string]: unknown;
}

/** A single shopping result returned by Serper.dev. */
export interface SerperShoppingResult {
  position?: number;
  title?: string;
  link?: string;
  source?: string;
  price?: string;
  rating?: number;
  ratingCount?: number;
  [key: string]: unknown;
}

/** The knowledge graph block returned by Serper.dev. */
export interface SerperKnowledgeGraph {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

/** The featured snippet / answer box returned by Serper.dev. */
export interface SerperAnswerBox {
  title?: string;
  snippet?: string;
  answer?: string;
  [key: string]: unknown;
}

/** Top-level Serper.dev JSON response. */
export interface SerperResponse {
  searchParameters?: { q?: string; type?: string; engine?: string; [key: string]: unknown };
  organic?: SerperOrganicResult[];
  shopping?: SerperShoppingResult[];
  knowledgeGraph?: SerperKnowledgeGraph;
  answerBox?: SerperAnswerBox;
  [key: string]: unknown;
}

/** Error raised when Serper.dev cannot return a usable response. */
export class SerperError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'SerperError';
    this.status = status;
  }
}

const SERPER_ENDPOINT = 'https://google.serper.dev/search';
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 2;

type Fetcher = typeof fetch;

function buildRequest(query: string, apiKey: string): { url: string; init: RequestInit } {
  return {
    url: SERPER_ENDPOINT,
    init: {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query }),
    },
  };
}

function isRetriableStatus(status: number): boolean {
  return status >= 500 || status === 408 || status === 429;
}

async function fetchOnce(
  url: string,
  init: RequestInit,
  fetcher: Fetcher,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetcher(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch Serper.dev results for a single search query.
 *
 * Retries once on transient failures (network errors, timeouts, HTTP 408/429,
 * or any 5xx). Non-transient HTTP errors (e.g. 401 for an invalid key) are
 * thrown immediately. Error messages never include the API key.
 */
export async function fetchSerperResults(
  query: string,
  apiKey: string,
  fetcher: Fetcher = fetch,
): Promise<SerperResponse> {
  const { url, init } = buildRequest(query, apiKey);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetchOnce(url, init, fetcher);
      if (response.ok) {
        return (await response.json()) as SerperResponse;
      }

      const statusError = new SerperError(
        `Serper request failed with status ${response.status}`,
        response.status,
      );
      if (!isRetriableStatus(response.status) || attempt === MAX_ATTEMPTS) {
        throw statusError;
      }
    } catch (error) {
      if (error instanceof SerperError) {
        throw error;
      }
      if (attempt === MAX_ATTEMPTS) {
        break;
      }
    }
  }

  throw new SerperError('Serper request failed: network error or timeout');
}
