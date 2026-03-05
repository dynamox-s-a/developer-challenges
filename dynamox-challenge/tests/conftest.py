
import os
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

import app.models  # noqa: F401 — registers Timeseries + TimeseriesData with Base
from app.api.dependencies import get_db_session
from app.database import Base
from app.main import app
from tests.fixtures.sample_data import VALID_PAYLOAD_5_POINTS

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/dynamox_timeseries_test",
)

# ---------------------------------------------------------------------------
# Engine and session factory pointing at the test database
# ---------------------------------------------------------------------------

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ---------------------------------------------------------------------------
# Dependency override — every request during tests uses the test database
# ---------------------------------------------------------------------------

def override_get_db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db_session] = override_get_db_session


# ---------------------------------------------------------------------------
# Session-scoped setup: create DB + tables + TimescaleDB hypertable
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session", autouse=True)
def setup_database() -> Iterator[None]:
    _create_test_database_if_missing()
    Base.metadata.create_all(bind=engine)
    _promote_to_hypertable()
    yield
    Base.metadata.drop_all(bind=engine)


def _create_test_database_if_missing() -> None:
    base_url = TEST_DATABASE_URL.rsplit("/", 1)[0]
    test_db_name = TEST_DATABASE_URL.rsplit("/", 1)[-1]
    admin_engine = create_engine(f"{base_url}/postgres", isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :name"),
            {"name": test_db_name},
        ).fetchone()
        if not exists:
            conn.execute(text(f'CREATE DATABASE "{test_db_name}"'))
    admin_engine.dispose()


def _promote_to_hypertable() -> None:
    sql = "SELECT create_hypertable('timeseries_data', 'timestamp', if_not_exists => TRUE);"
    with engine.begin() as conn:
        try:
            conn.execute(text(sql))
        except Exception:
            pass  # plain PostgreSQL without TimescaleDB extension — that's fine


# ---------------------------------------------------------------------------
# Function-scoped cleanup: wipe rows between every test
# ---------------------------------------------------------------------------

@pytest.fixture(autouse=True)
def clean_db() -> Iterator[None]:
    yield
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM timeseries"))


# ---------------------------------------------------------------------------
# Shared test fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(scope="module")
def client() -> Iterator[TestClient]:
    with TestClient(app) as c:
        yield c


@pytest.fixture
def sample_timeseries_data() -> dict:
    return dict(VALID_PAYLOAD_5_POINTS)


@pytest.fixture
def created_timeseries_id(client: TestClient) -> str:
    response = client.post("/api/v1/timeseries", json=VALID_PAYLOAD_5_POINTS)
    assert response.status_code == 201
    return response.json()["id"]
