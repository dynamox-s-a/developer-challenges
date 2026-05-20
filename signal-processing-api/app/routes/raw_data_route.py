from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.service.raw_data_service import RawDataService
from app.schemas.raw_data import RawDataCreate, RawDataCreateResponse

router = APIRouter()


@router.post("/raw_data", response_model=RawDataCreateResponse)
def create_raw_data(
    payload: RawDataCreate,
    db: Session = Depends(get_db)
):
    service = RawDataService(db)
    return service.create_raw_data(payload)


@router.get("/raw_data/full_time_series")
def get_full_time_series(
    limit: int | None = Query(default=None, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
):
    service = RawDataService(db)
    return service.get_full_time_series(
        limit=limit,
        offset=offset
    )


@router.get("/devices/count/active")
def get_active_devices_count(
    db: Session = Depends(get_db)
):
    service = RawDataService(db)
    return service.get_active_devices_count()


@router.delete("/raw_data/{device_id}")
def delete_by_device(
    device_id: int,
    db: Session = Depends(get_db)
):
    service = RawDataService(db)
    return service.delete_by_device(device_id)

@router.get("/raw_data/{device_id}/metrics")
def get_device_metrics(
    device_id: int,
    db: Session = Depends(get_db)
):
    service = RawDataService(db)
    return service.get_device_metrics(device_id)
