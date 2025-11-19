from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.devices.schemas import DeviceCreate, DeviceResponse, DevicesResponse
from app.devices.services import create_device, get_devices, get_device
from app.core.auth import get_current_user
from app.core.database import get_db

router = APIRouter(prefix="/devices", tags=["Devices"], dependencies=[Depends(get_current_user)])


@router.post("/", response_model=DeviceResponse)
def create_device_route(payload: DeviceCreate, db: Session = Depends(get_db)):
    return create_device(db, payload)

@router.get("/client/{client_id}", response_model=list[DevicesResponse])
def get_devices_route(client_id: str, db: Session = Depends(get_db)):
    return get_devices(db, client_id)

@router.get("/device/{device_id}", response_model=DeviceResponse)
def get_device_route(device_id: int, db: Session = Depends(get_db)):
    device = get_device(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device