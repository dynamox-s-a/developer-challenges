import string

from pydantic import BaseModel
from datetime import datetime


class RawDataItem(BaseModel):
    timestamp: datetime
    value: float


class RawDataCreate(BaseModel):
    serial_device: str 
    name: str 
    data: list[RawDataItem]


class RawDataResponse(BaseModel):
    id: int
    device_id: int
    timestamp: datetime
    value: float
    created_at: datetime

    class Config:
        from_attributes = True