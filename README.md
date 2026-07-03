# Research Document Generator

A FastAPI web application that accepts a topic, performs web search and LLM-backed
analysis, and returns a structured `.docx` report as a downloadable file.

## Overview

1. The user opens the single-page frontend, enters a topic, and clicks **Generate**.
2. The backend performs a live web search (mock in dev), feeds results to an LLM
   (mock in dev), assembles a styled Word document, and streams it back.
3. The browser automatically downloads the `.docx` file.

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

## Run (development)

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The frontend is served at **http://localhost:8000** and the generate endpoint at
**POST /generate**.

## Tests

```bash
pytest tests/ -v
```

## API

### `POST /generate`

Request:

```json
{ "topic": "AI website maintenance agent" }
```

Response: binary `.docx` file with `Content-Disposition: attachment`.

### `GET /health`

Returns `{"status": "ok"}`.
