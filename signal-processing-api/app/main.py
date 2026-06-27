from fastapi import FastAPI

from app.api.time_series_routes import router as time_series_router
from app.core.config import settings
from app.database.base import Base
from app.database.session import engine

# Import required so SQLAlchemy registers the models.
from app.models import time_series  


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "application": settings.app_name,
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


app.include_router(time_series_router)