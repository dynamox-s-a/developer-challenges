from uuid import UUID
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

# Time series
class TimeSeriesCreate(BaseModel):
    label: str = Field(
        ...,
        min_length=3,
        max_length=50,
        pattern=r"^[a-zA-Z0-9_:-]+$",
        description="Timeseries label (3-50 chars, letters, numbers, _, -, :)"
    )


class TimeSeriesRead(BaseModel):
    id: UUID
    label: str
    created_at: datetime

    class Config:
        from_attributes = True


# Points
class TimeSeriesPointCreate(BaseModel):
    timestamp: datetime
    value: float


class TimeSeriesPointsBatchCreate(BaseModel):
    points: List[TimeSeriesPointCreate] = Field(
        ...,
        min_length=1,
        description="List of time series points"
    )

class BatchInsertResponse(BaseModel):
    inserted: int

# Complete time series with points
class TimeSeriesPointResponse(BaseModel):
    timestamp: datetime
    value: float

    class Config:
        from_attributes = True


class TimeSeriesFullResponse(BaseModel):
    id: UUID
    label: str
    created_at: datetime
    points: List[TimeSeriesPointResponse]

    class Config:
        from_attributes = True

# Count
class TimeSeriesCountResponse(BaseModel):
    count: int

# Delete
class DeleteTimeSeriesResponse(BaseModel):
    deleted_id: UUID

# Metrics
class TimeSeriesMetricsResponse(BaseModel):
    count: int
    min: float | None
    max: float | None
    avg: float | None
    stddev: float | None
    p50: float | None
    p95: float | None
    start: datetime | None
    end: datetime | None

