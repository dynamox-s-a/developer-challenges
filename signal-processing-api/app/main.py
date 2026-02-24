from fastapi import FastAPI
from app.core.database import engine
from app.models import machine, signal, metrics
from app.core.database import Base

from app.routes.machine_routes import router as machine_router
from app.routes.signal_routes import router as signal_router
from app.routes.metric_routes import router as metric_router

app = FastAPI(
    title="Signal Processing API",
    description="Industrial Signal Processing API Backend Challenge",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "Signal Processing API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

app.include_router(machine_router)
app.include_router(signal_router)
app.include_router(metric_router)