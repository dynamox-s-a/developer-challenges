from routes.sensor import sensor_router
from routes.monitoring_point import monitoring_point_router
from routes.machine import machine_router
from routes.auth import auth_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(machine_router)
app.include_router(monitoring_point_router)
app.include_router(sensor_router)
