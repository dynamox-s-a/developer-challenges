from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TimeSeriesPointCreate(BaseModel):
    timestamp: datetime
    value: float


class TimeSeriesCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    data: list[TimeSeriesPointCreate] = Field(..., min_length=1)


class TimeSeriesPointResponse(BaseModel):
    timestamp: datetime
    value: float


class TimeSeriesResponse(BaseModel):
    id: UUID
    name: str
    created_at: datetime
    data: list[TimeSeriesPointResponse]


class TimeSeriesSummaryResponse(BaseModel):
    id: UUID
    name: str
    created_at: datetime
    points_count: int


class TimeSeriesCreateResponse(BaseModel):
    id: UUID
    message: str


class TimeSeriesCountResponse(BaseModel):
    count: int


class TimeSeriesMetricsResponse(BaseModel):
    count: int
    min: float
    max: float
    mean: float
    median: float
    std: float | None
    
class ForecastPointResponse(BaseModel):
    step: int
    predicted_value: float


class TimeSeriesForecastResponse(BaseModel):
    series_id: UUID
    steps: int
    forecast: list[ForecastPointResponse]