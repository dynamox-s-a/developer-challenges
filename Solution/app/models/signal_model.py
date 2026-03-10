from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List

class PointIn(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ts: datetime
    value: float

class CreateSeriesRequest(BaseModel):
    """Schema to create a new series."""
    name: str = Field(..., min_length=1, max_length=255)
    source: str = Field(..., max_length=255)
    unit: Optional[str] = Field(default=None, max_length=50)
    points: List[PointIn] = Field(..., min_length=1)

class SeriesResponse(BaseModel):
    """Schema for the response of a series created."""
    id: UUID
    name: str
    source: str
    unit: Optional[str]
    points_count: int
    start_ts: datetime
    end_ts: datetime
    created_at: datetime
    min_value: float
    max_value: float
    average: float
    min_value_aceptable_violated_count: int
    max_value_aceptable_violated_count: int    

class NumberOfSeriesResponse(BaseModel):
    """Schema for the response of the number of series stored in the server."""
    count: int

class FullSeriesResponse(SeriesResponse):
    """Schema for the response of a full series, with all the points."""
    id: UUID
    points: List[PointIn]

class PaginatedSeriesResponse(BaseModel):
    """Schema for the paginated response of a time series, with a subset of its points.

    Pass `next_offset` as the `offset` query param in the next request.
    When `has_more` is False, `next_offset` is None and pagination is complete.
    """
    series_id: UUID
    data: List[PointIn]
    has_more: bool
    next_offset: Optional[int]