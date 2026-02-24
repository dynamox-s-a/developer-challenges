from pydantic import BaseModel, Field
from datetime import datetime

class MachineBase(BaseModel):
    name: str
    location: str

class MachineCreate(MachineBase):
    pass

class Machine(MachineBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class MachineResponse(Machine):
    pass