from pydantic import BaseModel
from datetime import datetime

class MedicaoCreate(BaseModel):
    """
    Schema for creating a measurement
    """
    sensor_id: int
    name: str
    value: float

    
class Medicao(BaseModel):
    """
    Schema to represent a measurement
    """
    id: int
    sensor_id: int
    name: str
    value: float
    timestamp: datetime
    
    class Config:
        from_attributes = True


    