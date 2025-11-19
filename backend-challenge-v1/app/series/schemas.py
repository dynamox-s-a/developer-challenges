from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TimeSeriesData(BaseModel):
    value: float
    timestamp: datetime
    quality: Optional[str] = "good"
    unit: Optional[str] = "g-force"

class TimeSeriesCreate(BaseModel):
    device_uid: str
    values: List[TimeSeriesData]

class TimeSeriesResponse(BaseModel):
    id: int
    device_uid: str
    values: List[TimeSeriesData]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    message: str
    status: bool

class MetricsResponse(BaseModel):
    mean: float
    min: float
    max: float
    std: float
    count: int

class CountResponse(BaseModel):
    count: int