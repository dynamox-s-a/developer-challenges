import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from tortoise import Tortoise
from app.main import app

TEST_DATABASE_URL = "sqlite://:memory:"

@pytest_asyncio.fixture(scope="function")
async def client():
    await Tortoise.init(
        db_url=TEST_DATABASE_URL,
        modules={"models": ["app.models.models"]},
    )
    await Tortoise.generate_schemas()

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac

    await Tortoise.close_connections()