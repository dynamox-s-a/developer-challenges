from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from ..sensors.schemas import SensorCreate, SensorRead
from app.models import MachineType, SensorModel

class MonitoringPointCreate(BaseModel):
    name: str
    machine_id: int

class MonitoringPointRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    machine_id: int
    sensor: Optional[SensorRead] = None

class MonitoringPointList(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    point_id: int
    machine_name: str
    machine_type: MachineType
    point_name: str
    sensor_model: Optional[SensorModel] = None

class PageList(BaseModel):
    items: List[MonitoringPointList]
    total: int
    page: int
    size: int
