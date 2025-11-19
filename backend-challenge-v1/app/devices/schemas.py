from pydantic import BaseModel
from typing import Optional
from app.devices.sensor_enum import SensorTypeEnum

class DeviceBase(BaseModel):
    name: str
    client_id: Optional[int] = None
    sensor_type: SensorTypeEnum

class DevicesResponse(BaseModel):
    id: int
    uid: str
    name: str
    sensor_type: str
    client_id: int

class DeviceCreate(DeviceBase):
    pass

class DeviceResponse(DeviceBase):
    id: int
    uid: str

    class Config:
        from_attributes = True
