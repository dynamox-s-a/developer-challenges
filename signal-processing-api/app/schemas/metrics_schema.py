from pydantic import BaseModel, Field
from datetime import datetime

class MetricsBase(BaseModel):
    signal_id: str
    metric_type: str
    value: float
    # created_at: datetime = Field(default_factory=datetime.now)

class MetricsCreate(MetricsBase):
    pass

class MetricsResponse(MetricsBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True