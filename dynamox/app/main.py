from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.database.base import Base
from app.database.session import engine
from app.api.routes import router as timeseries_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.

    This function defines what should happen during the application lifecycle:
    - before the API starts handling requests (startup)
    - after the API stops (shutdown)

    In this project, the lifespan startup phase is used to ensure that
    all database tables are created before any HTTP request is processed.

    Design considerations:
    - Using lifespan is the modern and recommended approach in FastAPI,
      replacing the older @app.on_event("startup") mechanism.
    - Database tables are created automatically to simplify execution
      and avoid requiring a separate migration step for this project.

    Note:
    In larger or production-grade systems, schema evolution would typically
    be managed via database migrations (e.g., Alembic), rather than automatic
    table creation at startup.
    """
    # Startup logic: create database tables if they do not exist.
    Base.metadata.create_all(bind=engine)

    # Yield control back to FastAPI.
    # The application will run and handle requests after this point.
    yield

    # Shutdown logic could be placed here if needed
    # (e.g., closing external resources, flushing buffers, etc.).


# Create the FastAPI application instance.
#
# This object represents the ASGI application itself.
# It contains:
# - application configuration (title, version)
# - routing table (registered endpoints)
# - lifecycle management (via the lifespan handler)
#
# IMPORTANT:
# This object does NOT start a web server on its own.
# It must be executed by an ASGI server such as Uvicorn.
#
# Typical execution command:
#   uvicorn app.main:app --host 0.0.0.0 --port 8000
#
# In this command:
# - "app.main" refers to this file (app/main.py)
# - "app" refers to the FastAPI instance defined below
app = FastAPI(
    title="Signal Processing API",
    version="1.0.0",
    lifespan=lifespan,
)


# Register (mount) all routes related to time series handling.
#
# The router defines endpoints under the "/timeseries" prefix,
# including creation, listing, retrieval, metric computation,
# and deletion of time series data.
#
# Keeping routes in a separate module improves modularity
# and keeps the application entry point clean and readable.
app.include_router(timeseries_router)


@app.get("/health")
def health():
    """
    Lightweight health-check endpoint.

    Purpose:
    - Provide a fast way to verify that the application process is running.
    - Serve as a probe endpoint for monitoring systems, load balancers,
      or container orchestration tools.

    Design principles:
    - Must be extremely fast.
    - Must not depend on external resources such as the database.
    - Should return a simple and predictable response.

    If this endpoint returns HTTP 200, it indicates that:
    - The ASGI server (e.g., Uvicorn) is running.
    - The FastAPI application is loaded and able to respond to requests.
    """
    return {"status": "ok"}
