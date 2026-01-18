from enum import Enum
from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel

class MachineType(str, Enum):
    PUMP = "Pump"
    FAN = "Fan"

class SensorModel(str, Enum):
    TCAG = "TcAg"
    TCAS = "TcAs"
    HF_PLUS = "HF+"

class User(SQLModel, Table=True):
    __tablename__ = "user"
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hash: str

    machines: List["Machine"] = Relationship(back_populates="user")

class Machine(SQLModel, Table=True):
    __tablename__ = "machine"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: MachineType
    user_id: int = Field(foreign_key="user.id")
    
    user: User = Relationship(back_populates="machines")
    monitoring_points: List["MonitoringPoint"] = Relationship(back_populates="machine")

class MonitoringPoint(SQLModel, Table=True):
    __tablename__ = "monitoring_points"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    machine_id: int = Field(foreign_key="machine.id")

    machine: Machine = Relationship(back_populates="monitoring_points")
    sensor: Optional["Sensor"] = Relationship(back_populates="monitoring_points")

class Sensor(SQLModel, Table=True):
    __tablename__ = "sensor"
    id: str = Field(primary_key=True, index=True)
    model: SensorModel
    monitoring_point_id: int = Field(foreign_key="monitoring_points.id", unique=True)
    
    monitoring_point: MonitoringPoint = Relationship(back_populates="sensor")
