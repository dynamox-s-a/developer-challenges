from typing import Optional
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Relationship
from decimal import Decimal


class TimeSeries(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    sensor: str

    measurements: list['Measurements'] = Relationship(back_populates='timeseries')



class Measurements(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime
    air_humidity: float

    timeseries_id: int = Field(default=None, foreign_key='timeseries.id')
    
    timeseries: TimeSeries = Relationship(back_populates='measurements')
