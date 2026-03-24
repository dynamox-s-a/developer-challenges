from datetime import datetime

from pydantic import BaseModel


class Message(BaseModel):
    message: str


class DataPointCreate(BaseModel):
    timestamp: datetime
    value: float


class DataPointResponse(BaseModel):
    id: int
    timestamp: datetime
    value: float


class TimeSeriesCreate(BaseModel):
    name: str
    data_points: list[DataPointCreate]


class TimeSeriesResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    data_points: list[DataPointResponse]


class TimeSeriesMetrics(BaseModel):
    id: int
    name: str
    count: int
    min_value: float
    max_value: float
    mean_value: float
    std_deviation: float


class TimeSeriesCount(BaseModel):
    total: int


class TimeSeriesPrediction(BaseModel):
    series_id: int
    series_name: str
    historical_count: int
    steps: int
    predictions: list[float]
