import os

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/booking_system")
    OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434")
    ADMIN_PASSWORD_HASH: str = os.getenv("ADMIN_PASSWORD_HASH", "")
    AI_CONFIDENCE_THRESHOLD: float = float(os.getenv("AI_CONFIDENCE_THRESHOLD", "0.7"))
    AI_FALLBACK_THRESHOLD: int = int(os.getenv("AI_FALLBACK_THRESHOLD", "2"))
    MAX_ADVANCE_DAYS: int = int(os.getenv("MAX_ADVANCE_DAYS", "30"))
    MIN_LEAD_TIME_MINUTES: int = int(os.getenv("MIN_LEAD_TIME_MINUTES", "60"))
    DEFAULT_SLOT_DURATION_MINUTES: int = 30

settings = Settings()
