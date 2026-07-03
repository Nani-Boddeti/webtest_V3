"""Tests for the /generate and /health endpoints."""

import pytest
from httpx import AsyncClient
from io import BytesIO
from docx import Document


@pytest.mark.anyio
async def test_health(client: AsyncClient):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


@pytest.mark.anyio
async def test_generate_returns_docx(client: AsyncClient):
    resp = await client.post("/generate", json={"topic": "AI website maintenance agent"})
    assert resp.status_code == 200
    assert (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        in resp.headers["content-type"]
    )
    assert "attachment" in resp.headers["content-disposition"]


@pytest.mark.anyio
async def test_generate_docx_content_valid(client: AsyncClient):
    resp = await client.post("/generate", json={"topic": "Test topic"})
    assert resp.status_code == 200

    doc = Document(BytesIO(resp.content))
    paragraphs = [p.text for p in doc.paragraphs]
    full_text = "\n".join(paragraphs)

    assert "Test topic" in full_text
    assert "Executive Summary" in full_text
    assert "Key Findings" in full_text


@pytest.mark.anyio
async def test_generate_rejects_empty_topic(client: AsyncClient):
    resp = await client.post("/generate", json={"topic": ""})
    assert resp.status_code == 422


@pytest.mark.anyio
async def test_generate_rejects_missing_topic(client: AsyncClient):
    resp = await client.post("/generate", json={})
    assert resp.status_code == 422
