from typing import Optional
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Relationship


# Time-series Models

class TimeSeriesBase(SQLModel):
    """ Time-series Base Model 
        All children classes must implement sensor attribute
    """

    sensor: str

class TimeSeries(TimeSeriesBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Estabilishing 1-to-many relationship between time-series and measurements
    measurements: list['Measurement'] = Relationship(back_populates='timeseries', cascade_delete=True)

class TimeSeriesCreate(TimeSeriesBase):
    # Only used for POST requests
    measurements: list['Measurement']    

class TimeSeriesRead(TimeSeriesBase):
    # Used for data visualization
    """ What appears: 
        - Sensor
        - Created_at
        - Measurements list
    """
    created_at: datetime
    measurements: list['MeasurementRead']







# Measurement Models

class MeasurementBase(SQLModel):

    timestamp: datetime
    air_humidity: float


class Measurement(MeasurementBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Setting up the foreign-key and the 1-to-many relationship
    timeseries_id: Optional[int] = Field(default=None, foreign_key='timeseries.id')
    timeseries: Optional['TimeSeries'] = Relationship(back_populates='measurements')

class MeasurementRead(MeasurementBase):
    pass