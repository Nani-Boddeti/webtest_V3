# Smartwatch Comparison

A minimalist, responsive web app for comparing smartwatches side by side across five
attributes: **price, battery life, sleep tracking, durability, and subscription-free
operation**. Users can adjust the importance of each attribute before generating a verdict.

The app includes a responsive client form (`src/app/page.tsx` and components under
`src/components`) for entering two or more watch names, adjusting the five importance
weight sliders, and adding an optional purpose. On submit it calls the backend comparison
API (`POST /api/compare`), which uses the SerpAPI client, attribute extraction, and
weighted scoring, then renders a side-by-side comparison table, per-watch warnings, and a
final verdict.

## Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- npm 10+

## Install

```bash
npm install
```

## Environment setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and set `SERPAPI_API_KEY` to your SerpAPI key (required by the
comparison API). Never commit a real key to source control.

## Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The dev server
listens on port 3000 by default.

## Lint

```bash
npm run lint
```

## Test

Run the full test suite:

```bash
npm test
```

Run only the component tests:

```bash
npm test -- src/components
```

## Build for production

```bash
npm run build
```

## Start the production server

```bash
npm start
```

## Project structure

- `src/app` — App Router pages, API route, global layout, and global styles
- `src/components` — form, weight controls, results table, and verdict panel
- `src/lib` — shared types, weight normalization, SerpAPI client, extraction, and scoring
- `.env.example` — required environment variables (no real secrets)

## Environment variables

| Variable          | Required | Description                                              |
| ----------------- | -------- | -------------------------------------------------------- |
| `SERPAPI_API_KEY` | Yes      | SerpAPI key used by the `/api/compare` route            |
