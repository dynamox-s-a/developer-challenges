from fastapi import FastAPI

from app.api.timeseries import router as timeseries_router


app = FastAPI(
    title="Timeseries API",
    version="0.1.0",
)

app.include_router(timeseries_router)

@app.get("/health")
async def health():
    return {"status": "ok"}