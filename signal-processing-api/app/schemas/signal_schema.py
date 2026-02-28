from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

from app.enums.signal_type import SignalType

class SignalBase(BaseModel):
    signal_type: SignalType
    value: float
    timestamp: datetime

class SignalCreate(SignalBase):
    pass

class SignalResponse(SignalBase):
    id: UUID
    machine_id: UUID
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,)

class FullTimeSeriesResponse(BaseModel):
    signal_id: UUID
    machine_id: UUID
    signal_type: SignalType
    total_points: int
    data: list[dict]

    model_config = ConfigDict(
        from_attributes=True,)