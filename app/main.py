import time
from contextlib import asynccontextmanager
import fastapi
from sqlalchemy import text

from app.core.database import engine, Base
from app.api.endpoints import router as series_router

@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    # Cria as tabelas do banco de dados, se elas ainda não existirem
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        # Torna a tabela 'series_data' em hypertable
        hypertable_sql = text("""
            SELECT create_hypertable(
                'series_data', 
                'timestamp', 
                if_not_exists => TRUE
            );
        """)
        await conn.execute(hypertable_sql)
        print("Banco de dados e Hypertable criados.")
    
    yield
    
    # Quando desligar o servidor, fechamos a conexão com o banco de forma limpa
    await engine.dispose()
    print("Conexão com o banco de dados encerrada.")

app = fastapi.FastAPI(
    title="Dynamox Time Series API", 
    description="API de avaliação para o desafio de desenvolvedor back-end.",
    version="1.0.0",
    lifespan=lifespan
)

@app.middleware("http")
async def add_process_time_header(request: fastapi.Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # Injetando o tempo de processamento em milissegundos
    response.headers["X-Process-Time-ms"] = str(round(process_time * 1000, 2))
    return response

@app.get("/", include_in_schema=False)
def health_check():
    """Rota raiz apenas para confirmar que a API está viva."""
    return fastapi.responses.HTMLResponse(content="<h1>API ativa.</h1><p>Acesse <a href='/docs'>/docs</a> para o Swagger.</p>")

app.include_router(series_router, prefix="/api")