from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TimeSeriesCreate(BaseModel):
    values: list[float] = Field(
        min_length=1
    )

class TimeSeriesResponse(BaseModel):
    id: UUID

class TimeSeriesDetail(BaseModel):
    id: UUID
    values: list[float]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class TimeSeriesCountResponse(BaseModel):
    count: int

class TimeSeriesMetricsResponse(BaseModel):
    count: int
    min: float
    max: float
    mean: float

class PredictionResponse(BaseModel):
    predictions: list[float]