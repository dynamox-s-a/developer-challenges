from typing import Optional
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel, Relationship


class TimeSeriesBase(SQLModel):
    """Time-series Base Model"""

    sensor: str
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

class TimeSeries(TimeSeriesBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # Estabilishing 1-to-many relationship between time-series and measurements
    measurements: list['Measurement'] = Relationship(back_populates='timeseries', cascade_delete=True)