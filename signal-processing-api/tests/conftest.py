import os
import pytest
from sqlmodel import SQLModel, create_engine, Session
from fastapi.testclient import TestClient

# Forcing database URL to SQLite before api import
# otherwise runs PostgreSQL
TEST_DATABASE_URL = "sqlite:///tests/test.db"
os.environ["DATABASE_URL"] = TEST_DATABASE_URL

from app.main import app
from app.config.database import get_session

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})

@pytest.fixture(name='session', autouse=True)
def session_fixture():
    """Fixture that defines """
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        yield session


@pytest.fixture(name='client')
def client_fixture(session: Session):
    """Testclient fixture, overrides for a while api settings,
        in the end, clear all changes"""

    def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()

@pytest.fixture()
def sample_data():
    """Sample data to insert"""

    return {
            "sensor": "SENS_3452",
            "created_at": "2025-01-01T00:00:00",
            "id":1,
            "measurements": [
                    { "timestamp": "2025-01-01T00:00:00","air_humidity": 78},
                    { "timestamp": "2025-01-01T01:00:00","air_humidity": 78},
                    { "timestamp": "2025-01-01T02:00:00","air_humidity": 79},
                    { "timestamp": "2025-01-01T03:00:00","air_humidity": 85},
                    { "timestamp": "2025-01-01T04:00:00","air_humidity": 84},
                    { "timestamp": "2025-01-01T05:00:00","air_humidity": 83},
                    { "timestamp": "2025-01-01T06:00:00","air_humidity": 82},
                    { "timestamp": "2025-01-01T07:00:00","air_humidity": 84},
                    { "timestamp": "2025-01-01T08:00:00","air_humidity": 85},
                    { "timestamp": "2025-01-01T09:00:00","air_humidity": 87}
                ]
            }