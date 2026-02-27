from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.core.dependencies import get_db
from app.enums.metric_type import MetricType
from app.enums.signal_type import SignalType
from app.schemas.machine_schema import MachineCreate
from app.schemas.signal_schema import SignalCreate
from app.services.machine_service import MachineService
from app.services.signal_service import SignalService

router = APIRouter(prefix="/machines", tags=["Machines"])


@router.post("")
def create_machine(
    data: MachineCreate,
    db: Session = Depends(get_db)
):
    return MachineService.create_machine(data, db)

@router.get("")
def list_machines(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    return MachineService.list_machines(db, limit, offset)

@router.get("/{machine_id}")
def get_machine_by_id(
    machine_id: UUID,
    db: Session = Depends(get_db)
):
    return MachineService.get_machine_by_id(machine_id, db)

@router.delete("/{machine_id}")
def delete_machine_by_id(
    machine_id: UUID,
    db: Session = Depends(get_db)
):
    return MachineService.delete_machine(machine_id, db)

@router.post("/{machine_id}/signals")
def create_signal_for_machine(
    machine_id: UUID,
    data: SignalCreate,
    db: Session = Depends(get_db)
):
    return SignalService.create_signal(machine_id, data, db)

@router.get("/{machine_id}/signals")
def get_machine_signals(
    machine_id: UUID,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    signal_type: Optional[SignalType] | None = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    return MachineService.get_machine_signals(
        db, machine_id, limit, offset, signal_type, start_time, end_time
    )

@router.get("/{machine_id}/metrics")
def get_machine_metrics(
    machine_id: UUID,
    start_time: datetime | None = None,
    end_time: datetime | None = None,
    order: str = "desc",
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    metric_type: Optional[MetricType] = None,
    db: Session = Depends(get_db)
):
    return MachineService.list_metrics(
        db, machine_id, start_time, end_time, order, 
        limit, offset, metric_type
    )

@router.get("/{machine_id}/signals/count")
def count_machine_signals(
    machine_id: UUID,
    db: Session = Depends(get_db)
):
    return MachineService.count_machine_signals(machine_id, db)