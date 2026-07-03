# Research Document Generator

A FastAPI web application that accepts a topic, performs web search and LLM-backed
analysis, and returns a structured `.docx` report as a downloadable file.

## Overview

1. The user opens the single-page frontend, enters a topic, and clicks **Generate**.
2. The backend performs a live web search (mock in dev), feeds results to an LLM
   (mock in dev), assembles a styled Word document, and streams it back.
3. The browser automatically downloads the `.docx` file.

The generated document contains five sections:

- **5-Point Summary** — Concise overview of the topic
- **Challenges to Resolve** — Key obstacles and risks
- **Optimal Model Recommendation** — Suggested AI/ML architecture
- **Model Guardrails** — Safety and compliance measures
- **Implementation Guidelines** — Phased rollout plan

## Prerequisites

- Python 3.10+
- pip

## Install

```bash
pip install -r requirements.txt
```

## Environment

Copy the example file and fill in real keys when available:

```bash
cp .env.example .env   # edit .env with your keys
```

Environment variables (see `.env.example` for template):

| Variable          | Purpose                   |
|-------------------|---------------------------|
| `SEARCH_API_KEY`  | Web search provider key   |
| `SEARCH_API_URL`  | Web search endpoint URL   |
| `LLM_API_KEY`     | LLM provider key          |
| `LLM_API_URL`     | LLM endpoint URL          |

All variables default to `<to be replaced>` placeholders — the application runs
with mock services until real credentials are supplied.

## Run (development)

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The frontend is served at **http://localhost:8000** and the generate endpoint at
**POST /generate**.

CORS is configured for local development origins: `http://localhost:3000`,
`http://localhost:5173`, and `http://localhost:8000`.

## Tests

```bash
pytest tests/ -v
```

Tests validate:

- Health check endpoint returns `{"status": "ok"}`
- `/generate` returns a valid `.docx` with correct headers
- Document contains the topic and all five required sections
- Input validation rejects empty or missing topics
- Structural checks for headings and body content

### Manual smoke test

```bash
curl -X POST http://localhost:8000/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "AI website maintenance agent"}' \
  -o research_report.docx
```

## API

### `POST /generate`

Request:

```json
{ "topic": "AI website maintenance agent" }
```

Response: binary `.docx` file with `Content-Disposition: attachment`.

Status codes:

| Code | Meaning                        |
|------|--------------------------------|
| 200  | Document generated and returned |
| 422  | Invalid or missing topic field  |
| 500  | Internal server error           |

### `GET /health`

Returns `{"status": "ok"}`.

## Project structure

```
.
├── app/
│   ├── __init__.py
│   ├── config.py          # Env-var configuration with placeholders
│   ├── docx_builder.py    # python-docx document assembly
│   ├── main.py            # FastAPI application & routes
│   ├── services.py        # Mock search + LLM services
│   └── static/            # Frontend (SPA)
├── tests/
│   ├── __init__.py
│   ├── conftest.py        # Pytest fixtures (async client)
│   └── test_main.py       # Endpoint tests
├── .env.example           # Environment variable template
├── requirements.txt       # Python dependencies
└── README.md
```

## Mock → Production

The services in `app/services.py` return canned data. Each function includes a
commented-out production code template showing exactly how to wire a real API
(httpx calls with env‑var credentials). Search for `<to be replaced>` across the
codebase to find every placeholder that needs a real value.
