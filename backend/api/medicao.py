from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from models.medicao import Medicao as MedicaoModel
from schemas.medicao import MedicaoCreate, Medicao
from repository.medicao_repository import MedicaoRepository
from service.medicao_service import MedicaoService

medicao_router=APIRouter(prefix="/medicoes", tags=["medicoes"])

@medicao_router.post("/", response_model=Medicao)

async def create_medicao(
    medicao: MedicaoCreate, 
    db: Session = Depends(get_db)
): 
    """
    Creates a new measurement associated with a sensor.
    """
    return MedicaoService.create_medicao(db, medicao.sensor_id, medicao.name, medicao.value)

@medicao_router.get("/")
async def get_medicoes(
    db: Session = Depends(get_db)
):
    """
    Returns all measurements.
    """
    return MedicaoService.get_medicoes(db)

@medicao_router.get("/{medicao_id}")
async def get_medicao(
    medicao_id: int,
    db: Session = Depends(get_db)
):
    """
    Returns a specific measurement by ID.
    """
    return MedicaoService.get_medicao(
        db=db,
        medicao_id=medicao_id
    )

@medicao_router.delete("/{medicao_id}")
async def delete_medicao(
    medicao_id: int,
    db: Session = Depends(get_db)
):
    """
    Deletes a specific measurement by ID.
    """
    return MedicaoService.delete_medicao(
        db=db,
        medicao_id=medicao_id
    )

@medicao_router.get("/sensor/{sensor_id}")
async def get_medicoes_by_sensor(
    sensor_id: int,
    db: Session = Depends(get_db)
):
    """
    Returns all measurements from a specific sensor.
    """
    return MedicaoService.get_medicoes_by_sensor(db, sensor_id)