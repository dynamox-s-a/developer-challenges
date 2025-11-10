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


class SensorCreateSchema(BaseModel):
    model: str

    class Config:
        from_attributes = True


class MonitoringPointCreateSchema(BaseModel):
    name: str
    machine_id: int

    class Config:
        from_attributes = True


class MonitoringPointOut(BaseModel):
    machine_name: str | None
    machine_type: str | None
    monitoring_point_name: str
    sensor_model: str | None

    class Config:
        from_attributes = True


class SensorAssignSchema(BaseModel):
    sensor_id: int
    monitoring_point_id: int

    class Config:
        from_attributes = True
