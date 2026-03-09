import logging
import time
from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.models import table_registry
from app.settings import Settings

logger = logging.getLogger(__name__)


@lru_cache
def get_settings():
    return Settings()


@lru_cache
def get_engine():
    settings = get_settings()
    return create_engine(settings.DATABASE_URL)


def init_db():
    engine = get_engine()
    retries = 5

    while retries > 0:
        try:
            table_registry.metadata.create_all(engine, checkfirst=True)
            logger.info('Database synchronized successfully!')
            break
        except OperationalError:
            retries -= 1
            logger.warning(
                f'Database unavailable. Trying again...'
                f' ({retries} attempts remaining)'
            )
            time.sleep(3)

    if retries == 0:
        logger.error(
            'Fatal failure: Could not connect to the'
            ' database after multiple attempts.'
        )
        raise ConnectionError('he database did not respond in time.')


def get_session():
    engine = get_engine()
    with Session(engine) as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise
