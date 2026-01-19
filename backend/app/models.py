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

class User(SQLModel, table=True):
    __tablename__ = "user"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    hash: str

    machines: List["Machine"] = Relationship(back_populates="user")

class Machine(SQLModel, table=True):
    __tablename__ = "machine"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    type: MachineType
    user_id: int = Field(foreign_key="user.id")
    
    user: User = Relationship(back_populates="machines")
    monitoring_points: List["MonitoringPoint"] = Relationship(back_populates="machine", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

class MonitoringPoint(SQLModel, table=True):
    __tablename__ = "monitoring_points"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    machine_id: int = Field(foreign_key="machine.id", ondelete="CASCADE")

    machine: Machine = Relationship(back_populates="monitoring_points")
    sensor: Optional["Sensor"] = Relationship(back_populates="monitoring_point", sa_relationship_kwargs={"cascade": "all, delete-orphan"})

class Sensor(SQLModel, table=True):
    __tablename__ = "sensor"
    id: str = Field(primary_key=True, index=True)
    model: SensorModel
    monitoring_point_id: int = Field(foreign_key="monitoring_points.id", unique=True, ondelete="CASCADE")
    
    monitoring_point: MonitoringPoint = Relationship(back_populates="sensor")
