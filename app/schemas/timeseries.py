from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

"""
Timeseries Creation
"""
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

    model_config = ConfigDict(from_attributes=True)

"""
Points Creation
"""
class TimeSeriesPointCreate(BaseModel):
    timestamp: datetime
    value: float

class TimeSeriesPointsBatchCreate(BaseModel):
    points: list[TimeSeriesPointCreate] = Field(
        ...,
        min_length=1,
        description="List of time series points"
    )

class BatchInsertResponse(BaseModel):
    inserted: int

"""
Timeseries Read
"""
class TimeSeriesPointResponse(BaseModel):
    timestamp: datetime
    value: float

    model_config = ConfigDict(from_attributes=True)

class TimeSeriesFullResponse(BaseModel):
    id: UUID
    label: str
    created_at: datetime
    points: list[TimeSeriesPointResponse]
    next_after_ts: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

"""
Count
"""
class TimeSeriesCountResponse(BaseModel):
    count: int

"""
Delete
"""
class DeleteTimeSeriesResponse(BaseModel):
    deleted_id: UUID

"""
Metrics
"""
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

