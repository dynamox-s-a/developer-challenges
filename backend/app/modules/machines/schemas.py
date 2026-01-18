from pydantic import BaseModel
from app.models import MachineType

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