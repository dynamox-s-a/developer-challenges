from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, ConfigDict


class DataPointIn(BaseModel):
    """
    Schema representing a single data point received from the client.

    This model is used when creating a new time series (input payload).
    """
    timestamp: datetime
    value: float


class DataPointOut(BaseModel):
    """
    Schema representing a single data point returned to the client.

    This model is used in responses when retrieving a full time series.
    """
    timestamp: datetime
    value: float

    # Allow creating this schema directly from ORM objects
    # (e.g. SQLAlchemy DataPoint instances).
    model_config = ConfigDict(from_attributes=True)


class TimeSeriesCreate(BaseModel):
    """
    Schema for creating a new time series.

    This is the request body for POST /timeseries.
    """
    name: str = Field(
        min_length=1,
        max_length=255,
        description="Human-readable name of the time series",
    )

    # Arbitrary metadata provided by the client.
    # Stored as JSON in the database.
    metadata: dict[str, Any] | None = None

    # List of data points to be ingested.
    # Must contain at least one element.
    points: list[DataPointIn] = Field(
        min_length=1,
        description="List of time series samples",
    )


class TimeSeriesCreated(BaseModel):
    """
    Response schema returned after a time series is successfully created.
    """
    id: str
    name: str
    metadata: dict[str, Any] | None
    points_count: int
    created_at: datetime


class TimeSeriesOut(BaseModel):
    """
    Response schema for retrieving a full time series.

    Used by GET /timeseries/{id}.
    """
    id: str
    name: str
    metadata: dict[str, Any] | None

    # The list of data points returned in this response.
    # This list may be paginated using limit/offset.
    points: list[DataPointOut]

    # Total number of points in the selected time window,
    # not just the number of points returned in this page.
    points_count: int

    created_at: datetime


class TimeSeriesListItem(BaseModel):
    """
    Lightweight representation of a time series used in listings.
    """
    id: str
    name: str
    points_count: int
    created_at: datetime


class TimeSeriesListOut(BaseModel):
    """
    Response schema for listing time series with pagination.
    """
    items: list[TimeSeriesListItem]
    limit: int
    offset: int
    total: int


class CountOut(BaseModel):
    """
    Response schema for endpoints that return only a count.
    """
    count: int


class MetricsOut(BaseModel):
    """
    Response schema for aggregated metrics of a time series.

    Used by GET /timeseries/{id}/metrics.
    """
    id: str

    # Time window used to compute the metrics.
    # Null values indicate that no filtering was applied.
    window: dict[str, datetime | None]

    count: int
    min: float | None = None
    max: float | None = None
    mean: float | None = None
    std: float | None = None
