import uuid
import enum
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class SignalType(enum.Enum):
    VIBRATION = "vibration"
    TEMPERATURE = "temperature"
    PRESSURE = "pressure"

class Signal(Base):
    __tablename__ = "signal"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    machine_id = Column(String, ForeignKey("machine.id"), nullable=False)
    signal_type = Column(Enum(SignalType), nullable=False)
    value = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.now())
    machine = relationship(
        "Machine", 
        back_populates="signals"
    )
    metrics = relationship(
        "Metrics", 
        back_populates="signal",
        cascade="all, delete"
    )