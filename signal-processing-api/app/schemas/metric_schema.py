from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

from app.enums.metric_type import MetricType
from app.enums.signal_type import SignalType

class MetricBase(BaseModel):
    metric_type: MetricType
    value: float
    timestamp: datetime

class MetricsCreate(MetricBase):
    pass

class MetricsResponse(MetricBase):
    id: UUID
    signal_id: UUID
    timestamp: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.strftime("%H:%M:%S - %d/%m/%Y")
        }

class MetricDataPoint(BaseModel):
    timestamp: datetime
    value: float
    metric_type: MetricType

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.strftime("%H:%M:%S - %d/%m/%Y")
        }

class FullTimeSeriesResponse(BaseModel):
    signal_id: UUID
    machine_id: UUID
    signal_type: SignalType
    total_points: int
    data: list[MetricDataPoint]  # Usando o schema específico

    class Config:
        from_attributes = True