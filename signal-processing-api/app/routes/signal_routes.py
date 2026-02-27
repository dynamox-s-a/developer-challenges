from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.dependencies import get_db
from app.models.machine import Machine
from app.models.signal import Signal
from app.schemas.signal_schema import (
    SignalCreate, 
    SignalResponse, 
    FullTimeSeriesResponse 
)
from app.schemas.pagination import PaginatedResponseSchema
from app.enums.signal_type import SignalType
from app.services.signal_service import SignalService

router = APIRouter(prefix="/signals", tags=["Signals"])

@router.get("/{signal_id}")
def get_signal(
    signal_id: UUID, 
    db: Session = Depends(get_db)
):
    return SignalService.get_signal_by_id(signal_id, db)

@router.delete("/{signal_id}")
def delete_signal(
    signal_id: UUID, 
    db: Session = Depends(get_db)
):
    return SignalService.delete_signal(signal_id, db)

@router.get("/{signal_id}/full")
def get_full_time_series(
    signal_id: UUID,
    db: Session = Depends(get_db)
):
    return SignalService.get_full_time_series(db, signal_id)