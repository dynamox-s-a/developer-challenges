from pydantic import BaseModel, field_validator
from datetime import datetime

class DataPointOut(BaseModel):
    timestamp: datetime
    value: float

    model_config = {"from_attributes": True}

class TimeSeriesOut(BaseModel):
    id: str
    name: str | None
    created_at: datetime
    points: list[DataPointOut]

    model_config = {"from_attributes": True}

class TimeSeriesMetrics(BaseModel):
    series_id: str
    count: int
    min: float
    max: float
    mean: float
    median: float
    std: float
    range: float

class PredictedPoint(BaseModel):
    step: int
    value: float

class TimeSeriesPrediction(BaseModel):
    series_id: str
    method: str
    steps: int
    predicted_points: list[PredictedPoint]

class CountResponse(BaseModel):
    count: int