from pydantic import BaseModel
from datetime import datetime

class SensorCreate(BaseModel):
    """
    Schema for creating a new sensor.
    """
    name: str

class Sensor(BaseModel):
    """
    Schema for representing a sensor.
    """
    id: int
    name: str
    
    class Config:
        from_attributes = True

class medicaoCreate(BaseModel):
    """
    Schema for creating a new time series.
    """
    sensor_id: int
    name: str
    value: float
    timestamp: datetime

class medicao(BaseModel):
    """
    Schema for representing a time series.
    """
    id: int
    sensor_id: int
    name: str
    value: float
    timestamp: datetime
    
    class Config:
        from_attributes = True


    