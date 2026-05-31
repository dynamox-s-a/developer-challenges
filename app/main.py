from fastapi import FastAPI
from app.api.timeseries import router as timeseries_router
from app.database.base import Base
from app.database.engine import engine

app = FastAPI(title="TimeSeries API")

Base.metadata.create_all(bind=engine)

app.include_router(timeseries_router)

# app/main.py

@app.get("/health")
def health_check():
    return {"status": "ok"}