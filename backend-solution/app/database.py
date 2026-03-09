from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.models import table_registry
from app.settings import Settings


@lru_cache
def get_settings():
    return Settings()


@lru_cache
def get_engine():
    settings = get_settings()
    return create_engine(settings.DATABASE_URL)


def init_db():
    engine = get_engine()
    table_registry.metadata.create_all(engine)


def get_session():
    engine = get_engine()
    with Session(engine) as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise
