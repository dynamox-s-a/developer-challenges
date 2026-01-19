from pydantic import BaseModel
from app.models import SensorModel

class SensorCreate(BaseModel):
    id: str
    model: SensorModel
    
class SensorRead(BaseModel):
    id: str
    model: SensorModel
    monitoring_point_id: int

    class Config:
        from_attributes: True
