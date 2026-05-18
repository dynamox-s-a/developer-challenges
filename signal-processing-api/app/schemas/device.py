from pydantic import BaseModel
from datetime import datetime


class DeviceCreate(BaseModel):
    name: str
    serial_device: str


class DeviceResponse(BaseModel):
    id: int
    name: str
    serial_device: str
    created_at: datetime

    class Config:
        from_attributes = True