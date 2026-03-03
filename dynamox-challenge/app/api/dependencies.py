"""FastAPI dependencies (e.g. DB session injection)."""
from typing import Generator

from sqlalchemy.orm import Session

from app.database import SessionLocal


def get_db_session() -> Generator[Session, None, None]:
    """Yield a database session for request lifecycle."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
