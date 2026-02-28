from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

class MachineBase(BaseModel):
    name: str
    location: str

class MachineCreate(MachineBase):
    pass

class MachineResponse(MachineBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,)
