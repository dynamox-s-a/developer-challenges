from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class MachineBase(BaseModel):
    name: str
    location: str

class MachineCreate(MachineBase):
    pass

class Machine(MachineBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class MachineResponse(Machine):
    pass