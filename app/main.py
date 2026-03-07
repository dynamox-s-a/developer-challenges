import time
import logging

from fastapi import FastAPI

from app.api.timeseries import router as timeseries_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

app = FastAPI(
    title="Timeseries API",
    version="0.1.0",
)

@app.middleware("http")
async def log_requests(request, call_next):
    start = time.perf_counter()

    response = await call_next(request)

    duration = time.perf_counter() - start

    logger.info(
        "%s %s -> %s (%.3fs)",
        request.method,
        request.url.path,
        response.status_code,
        duration,
    )

    return response

app.include_router(timeseries_router)

@app.get("/health")
async def health():
    return {"status": "ok"}