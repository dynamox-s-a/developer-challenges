from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import create_db
from app.modules.auth.router import router as auth_router
from app.modules.machines.router import router as machines_router
from app.modules.monitoring_points.router import router as points_router
from app.modules.sensors.router import router as sensor_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield

app = FastAPI(title="Dynamox API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(machines_router, prefix="/machines", tags=["Machines"])
app.include_router(points_router, tags=["MonitoringPoints"])
app.include_router(sensor_router, prefix="/sensors", tags=["Sensors"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Backend rodando"}