from pydantic import BaseModel
from typing import Optional, List

class ClientBase(BaseModel):
    name: str
    email: Optional[str] = None
    document: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int

    class Config:
        from_attributes = True
