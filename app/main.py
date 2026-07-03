"""
FastAPI application entry point.

Serves the static frontend and exposes the /generate endpoint that
accepts a topic, performs a (mock) web search and LLM pass, and returns
a .docx file as a download.
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.config import APP_TITLE, APP_VERSION
from app.services import search_service, llm_service
from app.docx_builder import build_docx

app = FastAPI(title=APP_TITLE, version=APP_VERSION)

# --- CORS (local dev) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=500)


@app.post("/generate")
async def generate(request: GenerateRequest):
    """Accept a topic, run mock search + LLM, and return a .docx download."""
    try:
        search_results = await search_service(request.topic)
        document_text = await llm_service(request.topic, search_results)
        docx_bytes = build_docx(request.topic, document_text)

        safe_filename = _sanitise_filename(request.topic)

        return StreamingResponse(
            content=iter([docx_bytes]),
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "wordprocessingml.document"
            ),
            headers={
                "Content-Disposition": (
                    f"attachment; filename*=UTF-8''{safe_filename}.docx"
                )
            },
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/health")
async def health():
    """Liveness check."""
    return {"status": "ok"}


def _sanitise_filename(topic: str) -> str:
    """Return a safe, filesystem-friendly name derived from *topic*."""
    safe = "".join(c if c.isalnum() or c in " _-" else "_" for c in topic).strip()
    return safe[:60] or "report"


# --- Static files (frontend) — MUST be last ---
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
