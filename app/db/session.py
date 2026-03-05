from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import get_db_url


engine = create_async_engine(get_db_url(), echo=True)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
