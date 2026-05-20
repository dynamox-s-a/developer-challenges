from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.device import DeviceResponse
from app.service.device_service import DeviceService
from app.schemas.raw_data import DeviceDataResponse, RawDataItem


router = APIRouter(
    prefix="/devices",
    tags=["Devices"]
)


@router.get(
    "",
    response_model=List[DeviceResponse]
)
def get_all_devices(db: Session = Depends(get_db)):
    service = DeviceService(db)
    return service.get_all_devices()


@router.get(
    "/{device_id}/raw-data",
    response_model=list[RawDataItem]
)
def get_device_raw_data(
    device_id: int,
    limit: int | None = Query(default=None, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
):
    service = DeviceService(db)
    return service.get_device_raw_data(
        device_id=device_id,
        limit=limit,
        offset=offset
    )
