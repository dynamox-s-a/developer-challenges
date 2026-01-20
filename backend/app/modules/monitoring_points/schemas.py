from pydantic import BaseModel
from typing import Optional, List
from ..sensors.schemas import SensorCreate, SensorRead
from app.models import MachineType, SensorModel

class MonitoringPointCreate(BaseModel):
    name: str
    machine_id: int

class MonitoringPointRead(BaseModel):
    id: int
    name: str
    machine_id: int
    sensor: Optional[SensorRead]

    class Config:
        from_attributes: True

class MonitoringPointList(BaseModel):
    point_id: int
    machine_name: str
    machine_type: MachineType
    point_name: str
    sensor_model: Optional[SensorModel] = None

    class Config:
        from_attributes: True

class PageList(BaseModel):
    items: List[MonitoringPointList]
    total: int
    page: int
    size: int
