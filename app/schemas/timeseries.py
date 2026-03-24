from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator, ConfigDict


class DataPointIn(BaseModel):
    timestamp: float
    value: float


class TimeSeriesCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    unit: Optional[str] = None
    data: list[DataPointIn]

    @field_validator("data")
    @classmethod
    def must_have_data(cls, v: list) -> list:
        if not v:
            raise ValueError("data must contain at least one point")
        return v


class PredictRequest(BaseModel):
    steps: int = Field(10, ge=1, le=500)
    # "auto" runs both models and picks whichever had lower in-sample RMSE
    method: str = Field("auto", description="linear | holt_winters | auto")

    @field_validator("method")
    @classmethod
    def valid_method(cls, v: str) -> str:
        if v not in {"linear", "holt_winters", "auto"}:
            raise ValueError("method must be one of: linear, holt_winters, auto")
        return v


class DataPointOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    timestamp: float
    value: float


class TimeSeriesOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str]
    unit: Optional[str]
    created_at: datetime
    updated_at: datetime


class TimeSeriesDetailOut(TimeSeriesOut):
    data: list[DataPointOut] = Field(default_factory=list)
    point_count: int = 0


class MetricsOut(BaseModel):
    series_id: str
    series_name: str
    point_count: int
    min: float
    max: float
    mean: float
    std: float
    median: float
    p95: float
    p99: float
    rms: float
    start_timestamp: float
    end_timestamp: float
    duration_seconds: float


class PredictOut(BaseModel):
    series_id: str
    series_name: str
    method_used: str
    steps: int
    interval_seconds: float
    predictions: list[DataPointOut]
    confidence_lower: Optional[list[DataPointOut]] = None
    confidence_upper: Optional[list[DataPointOut]] = None


class SeriesCountOut(BaseModel):
    count: int
    message: str


class DeleteOut(BaseModel):
    series_id: str
    message: str


class PaginatedTimeSeriesOut(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[TimeSeriesOut]
