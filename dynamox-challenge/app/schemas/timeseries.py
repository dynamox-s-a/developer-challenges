from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

# ---------------------------------------------------------------------------
# Building blocks
# ---------------------------------------------------------------------------


class DataPoint(BaseModel):
    timestamp: datetime = Field(..., description="UTC timestamp of the measurement")
    value: float = Field(..., description="Numeric sensor reading")

    model_config = {
        "json_schema_extra": {
            "examples": [{"timestamp": "2024-03-01T09:00:00Z", "value": 0.42}]
        }
    }


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------


class TimeSeriesCreate(BaseModel):
    name: str | None = Field(
        default=None,
        max_length=255,
        description="Human-readable label for this series",
        examples=["motor-vibration-line-3"],
    )
    metadata: dict[str, Any] | None = Field(
        default_factory=dict,
        description="Flexible key-value metadata (unit, sensor id, machine, etc.)",
        examples=[{"unit": "mm/s", "sensor": "ACC-01", "machine": "Pump A"}],
    )
    data: list[DataPoint] = Field(
        ...,
        min_length=1,
        description="Ordered list of data points — must contain at least one",
    )

    @field_validator("data")
    @classmethod
    def timestamps_must_be_unique(cls, data_points: list[DataPoint]) -> list[DataPoint]:
        timestamps = [dp.timestamp for dp in data_points]
        if len(timestamps) != len(set(timestamps)):
            raise ValueError("All data point timestamps must be unique within a series")
        return data_points

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "motor-vibration-line-3",
                    "metadata": {"unit": "mm/s", "sensor": "ACC-01"},
                    "data": [
                        {"timestamp": "2024-03-01T09:00:00Z", "value": 0.42},
                        {"timestamp": "2024-03-01T09:00:01Z", "value": 0.47},
                        {"timestamp": "2024-03-01T09:00:02Z", "value": 0.51},
                    ],
                }
            ]
        }
    }


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------


class TimeSeriesResponse(BaseModel):
    id: UUID
    name: str | None = None
    metadata: dict[str, Any] | None = None
    created_at: datetime
    data_points_count: int
    time_range_start: datetime | None = None
    time_range_end: datetime | None = None
    data: list[DataPoint] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class MetricsResponse(BaseModel):
    series_id: UUID
    name: str | None = None
    count: int = Field(..., description="Total number of data points")
    mean: float | None = Field(None, description="Average value")
    stddev: float | None = Field(None, description="Standard deviation")
    min: float | None = Field(None, description="Minimum value")
    max: float | None = Field(None, description="Maximum value")
    time_range_start: datetime | None = None
    time_range_end: datetime | None = None

    model_config = {"from_attributes": True}


class CountResponse(BaseModel):
    count: int = Field(..., description="Total number of stored time series")
