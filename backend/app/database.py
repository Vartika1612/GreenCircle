"""
database.py — SQLAlchemy engine, session factory, and Base declarative class.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

# connect_args is required for SQLite to allow multi-threaded access
connect_args = {"check_same_thread": False} if settings.db_url.startswith("sqlite") else {}

engine = create_engine(
    settings.db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a DB session and ensures it's closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
