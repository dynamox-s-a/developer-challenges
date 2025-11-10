from pydantic import BaseModel


class UserSchema(BaseModel):
    email: str
    password: str

    class Config:
        from_attributes = True


class MachineCreateSchema(BaseModel):
    name: str
    type: str

    class Config:
        from_attributes = True


class MachineUpdateSchema(BaseModel):
    name: str | None = None
    type: str | None = None

    class Config:
        from_attributes = True
