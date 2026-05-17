from typing import Optional
from datetime import datetime

from sqlmodel import Field, SQLModel, Relationship

from models.timeseries import TimeSeries

# Measurement Models

class MeasurementBase(SQLModel):
    timestamp: datetime
    air_humidity: float = Field(ge=0.0, le=100.0, 
                                description='The air humidity must be between 0 and 100')


class Measurement(MeasurementBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Setting up the foreign-key and the 1-to-many relationship
    timeseries_id: Optional[int] = Field(default=None, foreign_key='timeseries.id')
    timeseries: Optional['TimeSeries'] = Relationship(back_populates='measurements')

