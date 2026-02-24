from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class SignalType(str, Enum):
    VIBRATION = "vibration"
    TEMPERATURE = "temperature"
    PRESSURE = "pressure"

class SignalBase(BaseModel):
    machine_id: int
    signal_type: SignalType
    value: float


class SignalCreate(SignalBase):
    # timestamp: datetime
    pass

class SignalResponse(SignalBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True