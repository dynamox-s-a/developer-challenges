from pydantic import BaseModel, ConfigDict
from app.models import SensorModel

class SensorCreate(BaseModel):
    id: str
    model: SensorModel
    monitoring_point_id: int
    
class SensorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    model: SensorModel
    monitoring_point_id: int
