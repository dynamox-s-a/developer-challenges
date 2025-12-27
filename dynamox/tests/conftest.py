import os
import pytest
from fastapi.testclient import TestClient

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.base import Base
from app.database.session import get_db
from app.main import app


@pytest.fixture(scope="session")
def engine():
    """
    Create a dedicated SQLite database for the test session.

    Why a separate DB?
    - Tests must be isolated from the developer's local database (app.db).
    - Tests must be repeatable and deterministic.

    We create a small SQLite file (test.db) and remove it at the end.
    """
    test_db_url = "sqlite:///./test.db"

    # Ensure a clean state when the test session starts.
    if os.path.exists("./test.db"):
        os.remove("./test.db")

    engine = create_engine(test_db_url, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine

    # Cleanup after all tests finish.
    engine.dispose()
    if os.path.exists("./test.db"):
        os.remove("./test.db")


@pytest.fixture()
def client(engine):
    """
    Provide a FastAPI TestClient with a database dependency override.

    Key idea:
    - Production code uses get_db() to connect to the real DB.
    - During tests, we override get_db() so requests use the test DB session.

    This ensures:
    - HTTP-level tests exercise the real API routes
    - while keeping data isolated in the test database.
    """
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    # Override the application's DB dependency only for the duration of this test.
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    # Remove overrides to avoid leaking state between tests.
    app.dependency_overrides.clear()
