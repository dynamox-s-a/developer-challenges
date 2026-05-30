from uuid import UUID

from pydantic import BaseModel


class TimeSeriesCreate(BaseModel):
    values: list[float]

class TimeSeriesResponse(BaseModel):
    id: UUID