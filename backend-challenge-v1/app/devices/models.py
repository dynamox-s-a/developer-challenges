from sqlalchemy import Column, Integer, String, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.devices.sensor_enum import SensorTypeEnum

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=True)

    sensor_type = Column(Enum(SensorTypeEnum), nullable=False)
    sensor_capabilities = Column(JSON, nullable=True)

    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True)
    client = relationship("Client", back_populates="devices")

    series = relationship("TimeSeries", back_populates="device")
