from typing import Optional
from sqlalchemy.orm import Session
from app.devices.models import Device
from app.devices.schemas import DeviceCreate
from app.devices.sensor_capabilities import SENSOR_CAPABILITIES
from app.devices.sensor_enum import SensorTypeEnum
import uuid

def create_device(db: Session, payload: DeviceCreate):
    device = Device(
        uid=str(uuid.uuid4()),
        name=payload.name,
        client_id=payload.client_id,
        sensor_type=payload.sensor_type,
        sensor_capabilities=SENSOR_CAPABILITIES[payload.sensor_type.value],
    )
    db.add(device)
    db.commit()
    db.refresh(device)
    return device

def get_devices(db: Session, client_id: str):
    return db.query(Device).filter(Device.client_id == client_id).all()

def get_device(db: Session, device_id: int):
    return db.query(Device).filter(Device.id == device_id).first()
