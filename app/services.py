"""
Mock service functions for web search and LLM-backed document generation.

These stubs return dummy data so the backend can be developed and tested
before integrating real external APIs.  Each function contains a commented‑out
production code template that references environment variables with
``<to be replaced>`` placeholders — replace those when real keys are available.
"""

from typing import Any


async def search_service(topic: str) -> list[dict[str, Any]]:
    """Mock web search — returns canned results for any topic.

    In production this will call a real search API (e.g. SerpAPI, Brave, or
    Google Custom Search) and return structured results.

    .. code-block:: python  # production template (uncomment & replace placeholders)

        import httpx
        SEARCH_API_KEY = os.environ["SEARCH_API_KEY"]      # <to be replaced>
        SEARCH_API_URL = os.environ["SEARCH_API_URL"]      # <to be replaced>

        async def search_service(topic: str) -> list[dict[str, Any]]:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    SEARCH_API_URL,
                    params={"q": topic, "api_key": SEARCH_API_KEY},
                    timeout=15.0,
                )
                resp.raise_for_status()
                return resp.json()["results"]
    """
    return [
        {
            "title": f"Understanding {topic} — An Overview",
            "url": "https://example.com/overview",
            "snippet": (
                f"A comprehensive introduction to {topic} covering key "
                "concepts, historical context, and current trends."
            ),
        },
        {
            "title": f"Latest Developments in {topic} (2024)",
            "url": "https://example.com/latest",
            "snippet": (
                f"Recent breakthroughs and emerging best practices related "
                f"to {topic} that every professional should know."
            ),
        },
        {
            "title": f"{topic} — Practical Implementation Guide",
            "url": "https://example.com/guide",
            "snippet": (
                "A step-by-step walkthrough for implementing solutions, "
                "including code samples and architectural patterns."
            ),
        },
        {
            "title": f"Challenges and Risks in {topic}",
            "url": "https://example.com/challenges",
            "snippet": (
                "Common pitfalls, security considerations, and risk-mitigation "
                "strategies drawn from real-world deployments."
            ),
        },
        {
            "title": f"Future Outlook for {topic}",
            "url": "https://example.com/future",
            "snippet": (
                "Expert predictions and analyst commentary on where the field "
                "is heading over the next 3–5 years."
            ),
        },
    ]


async def llm_service(topic: str, search_results: list[dict[str, Any]]) -> str:
    """Mock LLM document generation — returns structured content with the five
    required sections: 5-Point Summary, Challenges, Optimal Model, Model
    Guardrails, and Implementation Guidelines.

    In production this will call an LLM API (e.g. OpenAI, Anthropic) with a
    prompt that incorporates the search results to produce a polished document.

    .. code-block:: python  # production template (uncomment & replace placeholders)

        import httpx
        LLM_API_KEY = os.environ["LLM_API_KEY"]      # <to be replaced>
        LLM_API_URL = os.environ["LLM_API_URL"]      # <to be replaced>

        async def llm_service(topic: str, search_results: list[dict[str, Any]]) -> str:
            async with httpx.AsyncClient() as client:
                resp = await client.post(
                    LLM_API_URL,
                    json={
                        "model": "gpt-4",
                        "messages": [
                            {"role": "system", "content": "You are a research analyst…"},
                            {"role": "user", "content": f"Topic: {topic}\\nSources: {search_results}"},
                        ],
                    },
                    headers={"Authorization": f"Bearer {LLM_API_KEY}"},
                    timeout=60.0,
                )
                resp.raise_for_status()
                return resp.json()["choices"][0]["message"]["content"]
    """
    joined_snippets = "\n".join(
        f"- {r['title']}: {r['snippet']}" for r in search_results
    )

    return (
        f"Research Report: {topic}\n"
        f"{'=' * (len(topic) + 17)}\n\n"
        # ── Section 1: 5‑Point Summary ──
        f"## 5-Point Summary\n\n"
        f"1. **Overview** — {topic} represents a rapidly evolving domain with "
        f"significant implications for technology, business, and society.\n\n"
        f"2. **Current State** — Recent developments point toward increased "
        f"adoption of AI-driven approaches, with key players investing heavily "
        f"in research and tooling.\n\n"
        f"3. **Market Trends** — Industry analysts forecast continued growth, "
        f"driven by demand for automation, personalisation, and data-driven "
        f"decision making.\n\n"
        f"4. **Key Enablers** — Advances in model architectures, cloud "
        f"infrastructure, and open-source ecosystems are lowering barriers to "
        f"entry for organisations of all sizes.\n\n"
        f"5. **Outlook** — The next 2–3 years will likely see convergence "
        f"around standards, more robust evaluation frameworks, and tighter "
        f"integration with existing enterprise workflows.\n\n"
        # ── Section 2: Challenges to Resolve ──
        f"## Challenges to Resolve\n\n"
        f"1. **Data Quality & Availability** — High-quality, domain-specific "
        f"datasets remain scarce. Addressing gaps requires investment in data "
        f"curation, labelling, and privacy-preserving collection methods.\n\n"
        f"2. **Regulatory Compliance** — Evolving frameworks (GDPR, EU AI Act, "
        f"etc.) impose constraints on data handling, model transparency, and "
        f"auditability that must be baked into the solution from day one.\n\n"
        f"3. **Talent & Expertise** — The shortage of skilled practitioners "
        f"familiar with both the domain and modern AI techniques can slow "
        f"adoption and increase project risk.\n\n"
        f"4. **Integration Complexity** — Connecting AI components with legacy "
        f"systems, existing CI/CD pipelines, and monitoring infrastructure "
        f"often proves more challenging than model development itself.\n\n"
        f"5. **Cost Management** — Inference costs at scale, especially for "
        f"large models, require careful architectural planning, caching "
        f"strategies, and possibly fine-tuned smaller models for high-volume "
        f"paths.\n\n"
        # ── Section 3: Optimal Model ──
        f"## Optimal Model Recommendation\n\n"
        f"Based on the research gathered for '{topic}', the optimal approach "
        f"involves a **hybrid architecture**:\n\n"
        f"- **Primary model**: A state-of-the-art large language model (e.g. "
        f"GPT-4o, Claude 3.5 Sonnet, or Gemini 2.0) for high-quality reasoning "
        f"and content generation tasks.\n\n"
        f"- **Supporting models**: Smaller, fine-tuned models (e.g. Llama 3, "
        f"Mistral) for latency-sensitive or high-throughput sub-tasks such as "
        f"classification, entity extraction, and routing.\n\n"
        f"- **Retrieval-Augmented Generation (RAG)**: A RAG pipeline backed by "
        f"a vector store (e.g. Pinecone, Weaviate, pgvector) ensures the "
        f"system stays grounded in up-to-date, verifiable information.\n\n"
        f"- **Orchestration**: Use a lightweight agent framework or custom "
        f"orchestrator to manage task decomposition, tool use, and fallback "
        f"logic.\n\n"
        # ── Section 4: Model Guardrails ──
        f"## Model Guardrails\n\n"
        f"1. **Content Filtering** — Deploy input and output guardrails to "
        f"detect and block harmful, biased, or off-topic content. Use "
        f"established libraries (e.g. Guardrails AI, NVIDIA NeMo Guardrails) "
        f"or custom rule-based filters.\n\n"
        f"2. **Prompt Injection Defence** — Sanitise user inputs, employ "
        f"instruction hierarchy patterns, and never pass raw user text directly "
        f"into system-level prompts without validation.\n\n"
        f"3. **Hallucination Mitigation** — Require the model to cite sources "
        f"from the RAG pipeline and flag claims that cannot be verified against "
        f"the retrieved corpus.\n\n"
        f"4. **Rate Limiting & Quotas** — Protect the system from abuse and "
        f"runaway costs with per-user and per-session rate limits enforced at "
        f"the API gateway.\n\n"
        f"5. **Human-in-the-Loop** — For high-stakes decisions, route outputs "
        f"through a review queue before they are actioned or shown to end "
        f"users.\n\n"
        f"6. **Monitoring & Observability** — Log all model inputs, outputs, "
        f"and intermediate steps. Set up dashboards and alerts for drift, "
        f"anomalous usage patterns, and toxicity scores.\n\n"
        # ── Section 5: Implementation Guidelines ──
        f"## Implementation Guidelines\n\n"
        f"1. **Phase 1 — Discovery (Weeks 1–2)**\n"
        f"   - Audit existing data sources and identify gaps.\n"
        f"   - Define success metrics and acceptance criteria.\n"
        f"   - Select model providers and negotiate access.\n\n"
        f"2. **Phase 2 — Prototype (Weeks 3–5)**\n"
        f"   - Stand up a minimal RAG pipeline with a small curated corpus.\n"
        f"   - Build a thin API layer and a simple UI for internal testing.\n"
        f"   - Validate output quality with domain experts.\n\n"
        f"3. **Phase 3 — Hardening (Weeks 6–8)**\n"
        f"   - Add guardrails, monitoring, and error handling.\n"
        f"   - Run load tests and optimise cold-start / inference latency.\n"
        f"   - Conduct a security review (OWASP LLM Top 10).\n\n"
        f"4. **Phase 4 — Pilot (Weeks 9–10)**\n"
        f"   - Roll out to a limited user group with a feedback loop.\n"
        f"   - Tune prompts, chunking strategy, and embedding model based on "
        f"real-world queries.\n\n"
        f"5. **Phase 5 — Production (Week 11+)**\n"
        f"   - Deploy behind an API gateway with authentication, rate limiting, "
        f"and canary releases.\n"
        f"   - Establish an ongoing evaluation pipeline with automated "
        f"regression tests for response quality.\n\n"
        f"---\n"
        f"*Generated automatically — verify facts before using in production.*\n"
    )
