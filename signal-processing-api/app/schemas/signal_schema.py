from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

from app.enums.signal_type import SignalType

class SignalBase(BaseModel):
    machine_id: UUID
    signal_type: SignalType
    value: float


class SignalCreate(SignalBase):
    pass

class SignalResponse(SignalBase):
    id: UUID
    timestamp: datetime

    class Config:
        from_attributes = True

class FullTimeSeriesResponse(BaseModel):
    signal_id: UUID
    machine_id: UUID
    signal_type: SignalType
    total_points: int
    data: list[dict]

    class Config:
        from_attributes = True