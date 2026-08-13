# Smartwatch Comparison

A minimalist, responsive web app for comparing smartwatches side by side across five
attributes: **price, battery life, sleep tracking, durability, and subscription-free
operation**. Users can adjust the importance of each attribute before generating a verdict.

This repository currently contains the project scaffold (Next.js App Router, TypeScript,
Tailwind CSS, ESLint, Vitest + React Testing Library). The comparison form and the
`/api/compare` route are implemented in later steps.

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
comparison API, implemented in a later step). Never commit a real key to source control.

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

```bash
npm test
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

- `src/app` — App Router pages, global layout, and global styles
- `src/lib` — shared TypeScript types (request/response contracts)
- `.env.example` — required environment variables (no real secrets)

## Environment variables

| Variable          | Required | Description                                              |
| ----------------- | -------- | -------------------------------------------------------- |
| `SERPAPI_API_KEY` | Yes      | SerpAPI key used by the `/api/compare` route (later step) |
