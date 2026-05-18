from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.device import DeviceResponse
from app.service.device_service import DeviceService


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