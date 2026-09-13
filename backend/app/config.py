"""
config.py — Application settings via pydantic-settings.
All values can be overridden via environment variables.
"""
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # ── Database ──────────────────────────────────────────────────────────────
    # Defaults to SQLite (zero-setup local dev).
    # For MySQL use: mysql+pymysql://user:pass@host:3306/dbname
    db_url: str = Field(
        default="sqlite:///./greencircle.db",
        alias="DB_URL",
    )

    # ── JWT ───────────────────────────────────────────────────────────────────
    jwt_secret: str = Field(
        default="dev-secret-key-please-change-in-production-min-32-chars",
        alias="JWT_SECRET",
    )
    jwt_expiration_ms: int = Field(
        default=86_400_000,   # 24 h
        alias="JWT_EXPIRATION_MS",
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    allowed_origin: str = Field(
        default="http://localhost:5173",
        alias="ALLOWED_ORIGIN",
    )

    # ── Server ────────────────────────────────────────────────────────────────
    port: int = Field(default=8080, alias="PORT")

    model_config = {"populate_by_name": True, "env_file": ".env", "extra": "ignore"}


settings = Settings()
