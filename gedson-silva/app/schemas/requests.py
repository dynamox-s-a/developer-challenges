from pydantic import BaseModel, field_validator
from datetime import datetime


class DataPointIn(BaseModel):
    timestamp: datetime
    value: float

class TimeSeriesCreate(BaseModel):
    name: str | None = None
    points: list[DataPointIn]

    @field_validator("points")
    @classmethod
    def must_have_points(cls, v):
        if len(v) == 0:
            raise ValueError("A série deve ter pelo menos 1 ponto")
        return v
