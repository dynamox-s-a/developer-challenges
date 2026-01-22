from pydantic import BaseModel, ConfigDict
from app.models import MachineType
from ..monitoring_points.schemas import MonitoringPointRead
from typing import Optional, List

class MachineCreate(BaseModel):
    name: str
    type: MachineType

class MachineRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    type: MachineType
    user_id: int
    monitoring_points: List[MonitoringPointRead] = []

class MachineUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    name: Optional[str] = None
    type: Optional[MachineType] = None
