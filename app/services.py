"""
Mock service functions for web search and LLM-backed document generation.

These stubs return dummy data so the backend can be developed and tested
before integrating real external APIs.
"""

from typing import Any


async def search_web(topic: str) -> list[dict[str, Any]]:
    """Mock web search — returns canned results for any topic.

    In production this will call a real search API (e.g. SerpAPI, Brave, or
    Google Custom Search) and return structured results.
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


async def generate_document_text(topic: str, search_results: list[dict[str, Any]]) -> str:
    """Mock LLM document generation — returns a structured plain-text report.

    In production this will call an LLM API (e.g. OpenAI, Anthropic) with a
    prompt that incorporates the search results to produce a polished document.
    """
    joined_snippets = "\n\n".join(
        f"- {r['title']}: {r['snippet']}" for r in search_results
    )

    return (
        f"Research Report: {topic}\n"
        f"{'=' * (len(topic) + 17)}\n\n"
        f"## Executive Summary\n\n"
        f"This report presents a structured analysis of '{topic}', drawing on "
        f"the latest available information. The following sections summarise "
        f"key findings, practical implications, and future directions.\n\n"
        f"## Key Findings\n\n"
        f"{joined_snippets}\n\n"
        f"## Recommendations\n\n"
        f"1. Stay informed about regulatory and technological changes affecting {topic}.\n"
        f"2. Invest in continuous learning and upskilling in related tools and frameworks.\n"
        f"3. Pilot small-scale implementations before committing to organisation-wide rollouts.\n\n"
        f"## Conclusion\n\n"
        f"The landscape around {topic} is evolving rapidly. Organisations that "
        f"proactively adapt their strategies will be best positioned to capture "
        f"emerging opportunities and mitigate associated risks.\n\n"
        f"---\n"
        f"*Generated automatically — verify facts before using in production.*\n"
    )
