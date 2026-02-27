from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

DATABASE_URL = "postgresql+asyncpg://dynamox_user:dynamox_password@localhost:5432/timeseries_db"

# Criação da engine asincrona do banco de dados
engine = create_async_engine(DATABASE_URL, echo=False, future=True)

# Configuração das transações do banco
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# A classe base que será herdada pelos modelos
Base = declarative_base()

# Função auxiliar para injetar a sessão do banco nas rotas do FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session