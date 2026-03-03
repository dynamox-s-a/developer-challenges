"""FastAPI application entry point and exception handlers."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import engine, Base
from app.api.exceptions import AppException
from app.api.v1 import timeseries as timeseries_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create DB tables on startup (for dev; use migrations in production)."""
    Base.metadata.create_all(bind=engine)
    yield
    # shutdown cleanup if needed


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
)

# Register exception handler for custom app exceptions
@app.exception_handler(AppException)
async def app_exception_handler(request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )

# Include API routers
app.include_router(
    timeseries_router.router,
    prefix=settings.api_v1_prefix,
    tags=["timeseries"],
)


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}
