from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TimeSeriesPointCreate(BaseModel):
    timestamp: datetime
    value: float
    
class TimeSeriesPointsAppend(BaseModel):
    data: list[TimeSeriesPointCreate] = Field(..., min_length=1)

class TimeSeriesCreate(BaseModel):
    asset_name: str = Field(..., min_length=1, max_length=120)
    sensor_name: str = Field(..., min_length=1, max_length=120)
    signal_type: str = Field(..., min_length=1, max_length=80)
    unit: str = Field(..., min_length=1, max_length=40)
    data: list[TimeSeriesPointCreate] = Field(..., min_length=1)

class TimeSeriesPointsAppendResponse(BaseModel):
    series_id: UUID
    inserted_points: int
    message: str

class TimeSeriesPointResponse(BaseModel):
    timestamp: datetime
    value: float


class TimeSeriesResponse(BaseModel):
    id: UUID
    asset_name: str
    sensor_name: str
    signal_type: str
    unit: str
    created_at: datetime
    data: list[TimeSeriesPointResponse]


class TimeSeriesSummaryResponse(BaseModel):
    id: UUID
    asset_name: str
    sensor_name: str
    signal_type: str
    unit: str
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