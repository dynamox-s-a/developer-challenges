from pydantic import BaseModel,ConfigDict
from datetime import datetime


class DeviceCreate(BaseModel):
    name: str
    serial_device: str


class DeviceResponse(BaseModel):
    id: int
    name: str
    serial_device: str
    created_at: datetime
    model_config =  ConfigDict(from_attributes=True )

    