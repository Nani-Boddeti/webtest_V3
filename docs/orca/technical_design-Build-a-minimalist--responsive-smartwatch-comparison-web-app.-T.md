# technical_design: Build a minimalist, responsive smartwatch comparison web app. The frontend accepts two or more watch names and adjustabl

Status: draft

## riskNotes

- SerpAPI result formats and snippets vary, so deterministic extraction may miss attributes; return explicit warnings and provide a best-effort value. External API rate limits/outages can cause partial failures; handle per-watch errors gracefully. Weight normalization must handle all-zero totals. Keep bundle client-side free of secrets.

## backendPlan

- Single Next.js API route. No database. Use fetch with AbortController timeout and retry once. Keep API key server-side only. src/lib/serpapi.ts constructs query and returns parsed SerpAPI JSON. src/lib/extraction.ts pulls candidate values from organic_results, shopping_results, knowledge_graph, answer_box. Unit tests use fixture files under src/lib/fixtures. If SERPAPI_API_KEY is missing, return 500 with a clear error; never include key in errors/logs. If a watch query fails or yields no usable data, return warnings for that watch.

## agentHandoff

- Agents must not hardcode or expose SERPAPI_API_KEY. Use src/lib/types.ts for the compare request/response contract. Backend tests must mock fetch and cover extraction edge cases. Frontend tests must cover validation, loading/error states, and verdict rendering. Reviewers will run npm run lint, npm test, and npm run build; no browser-based visual verification is allowed.

## databasePlan

- None. This MVP is stateless; no database, migrations, or persistence are required.

## frontendPlan

- Client component at src/app/page.tsx holds watches input, weight sliders (0-100, normalized before request), optional purpose textarea, and submit button. Validation requires >=2 watches and shows inline errors. On submit, POST to /api/compare and render compare cards for five attributes, per-watch warnings, and verdict panel. Tailwind CSS for clean responsive design; no client-side API key usage.

## testStrategy

- Run npm run lint, npm test, and npm run build. Backend unit tests cover extraction and scoring with fixture SerpAPI JSON. API route test mocks global fetch and verifies request validation, key handling, and response shape. Frontend component tests use React Testing Library/jsdom to verify validation, weight normalization, loading/error states, and verdict rendering. Reviewer executes shell commands only; no visual browser checks.

## dependencyPlan

- SerpAPI is the only external integration. It is blocked until the user chooses mock vs actual credentials. Backend implementation uses SERPAPI_API_KEY from env and unit tests use local fixtures, so coding can proceed before credentials are available. The configuration task will set the Project Secret SERPAPI_API_KEY (actual) or a mock placeholder with <to be replaced>.

## lowLevelDesign

- Next.js (App Router, TypeScript, Tailwind CSS) single-page app. POST /api/compare accepts JSON body: { watches: string[], weights: { price: number, batteryLife: number, sleepTracking: number, durability: number, subscriptionFree: number }, purpose?: string }. Server reads SERPAPI_API_KEY from process.env and, for each watch, calls SerpAPI Google search endpoint with a spec-focused query, parses organic/shopping/knowledge graph snippets in src/lib/serpapi.ts and src/lib/extraction.ts. Deterministic regex/heuristics extract price (lower is better), battery life (higher is better), sleep tracking (yes/no/unknown), durability (score from keywords/reviews), and subscription-free (yes/no/unknown). Missing/unknown attributes produce warnings, not silent omission. src/lib/scoring.ts normalizes weights and attributes and picks the better-value watch with reasoning. Response shape: { watches: [{ name, attributes: { price?: string, batteryLife?: string, sleepTracking?: string, durability?: string, subscriptionFree?: string }, warnings: string[] }], verdict: { winner: string, reasoning: string } }. All code self-hostable; SerpAPI is the single external SaaS integration.

## blockedOnIntegrations

- SerpAPI

## implementationRoadmap

- Step 1: Scaffold Next.js TypeScript/Tailwind app with env example and shared types. Step 2: Implement POST /api/compare, SerpAPI client, extraction, scoring, and backend tests. Step 3: Implement frontend form, weight controls, results, warnings, verdict, and component tests. Step 4: Unblock SerpAPI integration by setting SERPAPI_API_KEY or a mock value.

## implementationApproach

- Scaffold first, then build the server API with deterministic extraction and tests, then build the frontend against the API contract. SerpAPI credentials are a blocked integration decision: Orca will create a configuration task for the user to choose a mock placeholder or provide an actual key in Project Secrets.
