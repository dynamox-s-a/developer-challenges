import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.infra.database import Base, engine
from app.routes.v1 import v1_router

# Garante que os modelos SQLAlchemy sejam registrados no Base.metadata
import app.infra.time_series  # noqa: F401

logger = logging.getLogger(__name__)


def create_app(testing: bool = False) -> FastAPI:

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        """Cria as tabelas no banco na inicialização, se ainda não existirem.

        Usa CREATE TABLE IF NOT EXISTS do PostgreSQL — operação atômica e segura
        Isso aqui nao escala muito bem aparentemente (duas instancias podem subir ao mesmo tempo e tentar criar a tabela), mas é suficiente para o que foi implementado do teste. Em produção, eu usaria uma ferramenta de migração como Alembic.
        """
        # Modo de teste: nao cria tabelas, pois o repositório é 100% mockado e nao precisa de um banco real.
        # Para um teste de integracao com banco real, bastaria criar um conftest que cria o app com testing=False e um banco de teste configurado, e nao mockar o repositorio. Assim, as tabelas seriam criadas normalmente e o teste usaria um banco real, mas isolado do ambiente de desenvolvimento/produção.
        if not testing:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
        yield
        if not testing:
            await engine.dispose()

    app = FastAPI(
        title="Signal Processing API",
        version="1.0.0",
        lifespan=lifespan,
    )
    app.include_router(v1_router, prefix="/api/v1")

    # Assegura que o FastAPI nao vaze campo padrao que mostre os dados de entrada do payload, que pode conter dados sensiveis.
    # O RequestValidationError é o erro lançado pelo FastAPI quando o payload nao bate com o modelo Pydantic esperado.
    # Alem de seguranca, isso torna a resposta mais leve, dado que o payload pode ser grande (pontos da serie).
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "detail": [
                    {
                        "type": error["type"],
                        "loc": error["loc"],
                        "msg": error["msg"],
                    }
                    for error in exc.errors()
                ]
            },
        )

    # Assegura que erros nao tratados sejam convertidos em respostas JSON genéricas, sem vazar detalhes do erro ou dados de entrada.
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception("Erro não tratado: %s", exc)
        return JSONResponse(
            status_code=500,
            content={"detail": "Erro interno do servidor."},
        )

    return app