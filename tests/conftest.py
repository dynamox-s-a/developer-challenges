import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from app.main import app
from app.db.base import Base
from app.db.session import get_db

TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5433/timeseries_test"

engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def override_get_db():
    async with SessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

# Create tables once for the test session
@pytest.fixture(scope="session", autouse=True)
def prepare_database():
    import asyncio
    async def _setup():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    asyncio.run(_setup())

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(autouse=True)
def clean_db():
    import asyncio

    async def _clean():
        async with engine.begin() as conn:
            for table in reversed(Base.metadata.sorted_tables):
                await conn.execute(table.delete())

    asyncio.run(_clean())

@pytest.fixture
def mock_uuid():
    return "00000000-0000-0000-0000-000000000000"