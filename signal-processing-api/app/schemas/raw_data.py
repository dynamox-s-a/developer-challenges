import string

from pydantic import BaseModel, ConfigDict
from datetime import datetime


class RawDataItem(BaseModel):
    timestamp: datetime
    value: float


class RawDataCreate(BaseModel):
    serial_device: str
    data: list[RawDataItem]

class DeviceDataResponse(BaseModel):
    device_id: int
    data: list[RawDataItem]


class RawDataResponse(BaseModel):
    id: int
    device_id: int
    timestamp: datetime
    value: float
    created_at: datetime
    model_config =  ConfigDict(from_attributes=True  )

