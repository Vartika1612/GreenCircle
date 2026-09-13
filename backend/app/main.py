"""
main.py — FastAPI application factory.

Startup sequence:
  1. Create all DB tables (if they don't exist)
  2. Seed demo data (SQLite / empty DB only)
  3. Register routers and CORS middleware
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.exceptions import register_exception_handlers
from app.routers import auth, farmer, orders, products
from app.seed import run_seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ───────────────────────────────────────────────────────────────
    # Create tables (safe no-op if they already exist in MySQL)
    Base.metadata.create_all(bind=engine)

    # Seed demo data for local SQLite dev
    if settings.db_url.startswith("sqlite"):
        db = SessionLocal()
        try:
            run_seed(db)
        finally:
            db.close()

    yield
    # ── Shutdown (nothing to clean up) ────────────────────────────────────────


app = FastAPI(
    title="GreenCircle API",
    description="Farm-to-table marketplace backend — FastAPI edition",
    version="2.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ── Exception Handlers ────────────────────────────────────────────────────────
register_exception_handlers(app)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(farmer.router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "service": "greencircle-api"}
