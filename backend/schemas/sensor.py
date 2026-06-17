from pydantic import BaseModel
from datetime import datetime

class SensorCreate(BaseModel):
    """
    Schema para criação de sensor
    """
    name: str

class Sensor(BaseModel):
    """
    Schema para representar um sensor
    """
    id: int
    name: str
    
    class Config:
        from_attributes = True



    