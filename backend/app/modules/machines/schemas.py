from pydantic import BaseModel
from app.models import MachineType
from ..monitoring_points.schemas import MonitoringPointRead
from typing import Optional, List

class MachineCreate(BaseModel):
    name: str
    type: MachineType

class MachineRead(BaseModel):
    id: int
    name: str
    type: MachineType
    user_id: int
    monitoring_points: List[MonitoringPointRead] = []

    class Config:
        from_attributes: True

class MachineUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[MachineType] = None

    class Config:
        from_attributes: True
