from pydantic import BaseModel
from datetime import datetime

class SensorCreate(BaseModel):
    """
    Schema for sensor creation
    """
    name: str

class Sensor(BaseModel):
    """
    Schema to represent a sensor
    """
    id: int
    name: str
    
    class Config:
        from_attributes = True
        
class SensorPagination(BaseModel):
    total: int
    skip: int
    limit: int
    items: list[Sensor]