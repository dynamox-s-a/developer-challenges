from pydantic import BaseModel
from app.models import MachineType
from typing import Optional

class MachineCreate(BaseModel):
    name: str
    type: MachineType

class MachineRead(BaseModel):
    id: int
    name: str
    type: MachineType
    user_id: int

    class Config:
        from_attributes: True

class MachineUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[MachineType] = None

    class Config:
        from_attributes: True
