from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from models.sensor import Sensor as SensorModel
from schemas.sensor import SensorCreate, Sensor
from service.sensor_service import SensorService
from service.medicao_service import MedicaoService

sensor_router=APIRouter(prefix="/sensores", tags=["sensores"])

@sensor_router.post("/", response_model=Sensor)
async def create_sensor(
    sensor: SensorCreate, 
    db: Session = Depends(get_db)
): 
    return SensorService.create_sensor(
        db=db,
        name=sensor.name
    )

@sensor_router.get("/")
async def get_sensors(
    db: Session = Depends(get_db)
):
    return SensorService.get_sensors(db)

@sensor_router.get("/{sensor_id}")
async def get_sensor(
    sensor_id: int,
    db: Session = Depends(get_db)
):
    return SensorService.get_sensor(
        db=db,
        sensor_id=sensor_id
    )

@sensor_router.delete("/{sensor_id}")
async def delete_sensor(
    sensor_id: int,
    db: Session = Depends(get_db)
):
    return SensorService.delete_sensor(
        db=db,
        sensor_id=sensor_id
    )
    
@sensor_router.get("/{sensor_id}/metricas")
async def get_metricas(
    sensor_id: int,
    db: Session = Depends(get_db)
):
    return MedicaoService.get_metricas(
        db=db,
        sensor_id=sensor_id
    )