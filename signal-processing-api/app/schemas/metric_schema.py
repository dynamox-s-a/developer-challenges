from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID

from app.enums.metric_type import MetricType

class MetricBase(BaseModel):
    metric_type: MetricType
    value: float
    timestamp: datetime

class MetricsCreate(MetricBase):
    pass

class MetricsResponse(MetricBase):
    id: UUID
    signal_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True