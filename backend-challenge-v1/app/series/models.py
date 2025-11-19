from sqlalchemy import Column, Integer, String, JSON, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class TimeSeries(Base):
    __tablename__ = "timeseries"

    id = Column(Integer, primary_key=True, index=True)
    is_active = Column(Boolean, default=True)
    values = Column(JSON, nullable=False)

    device_uid = Column(String, ForeignKey("devices.uid"))
    device = relationship("Device", back_populates="series")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    deleted_by = Column(String, nullable=True)
