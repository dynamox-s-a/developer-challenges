from pydantic import BaseModel
from datetime import datetime

class MedicaoCreate(BaseModel):
    """
    Schema para realizar a criação de uma medição
    """
    sensor_id: int
    name: str
    value: float

    
class Medicao(BaseModel):
    """
    Schema para representar uma medição
    """
    id: int
    sensor_id: int
    name: str
    value: float
    timestamp: datetime
    
    class Config:
        from_attributes = True


    