"""
Application configuration.

All secrets use placeholder values; replace them with real keys via
environment variables or a dedicated Orca config task.
"""

import os

# --- Search API ---
SEARCH_API_KEY: str = os.environ.get("SEARCH_API_KEY", "<to be replaced>")
SEARCH_API_URL: str = os.environ.get(
    "SEARCH_API_URL", "<to be replaced>"
)

# --- LLM API ---
LLM_API_KEY: str = os.environ.get("LLM_API_KEY", "<to be replaced>")
LLM_API_URL: str = os.environ.get(
    "LLM_API_URL", "<to be replaced>"
)

# --- Application ---
APP_TITLE: str = "Research Document Generator"
APP_VERSION: str = "0.1.0"
