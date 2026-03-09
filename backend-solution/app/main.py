from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import init_db
from app.routers import time_series


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title='Signal Processing API',
    description='API para armazenamento e análise de séries temporais',
    version='1.0.0',
    lifespan=lifespan,
)

app.include_router(time_series.router)


@app.get('/')
def read_root():
    return {'message': 'Signal Processing API'}
