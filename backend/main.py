from fastapi import FastAPI
from api.sensor import sensor_router
from api.medicao import medicao_router
from database import init_db

app = FastAPI(
    title="API de Telemetria",
    version="1.0.0"
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(sensor_router)
app.include_router(medicao_router)