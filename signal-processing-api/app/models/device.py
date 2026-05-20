from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Device(Base):
    __tablename__ = "devices"

   
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    
    name = Column(String, unique=True, index=True, nullable=False)
    
    
    serial_device = Column(String, unique=True, index=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

  
    raw_data = relationship(
        "RawData",
        back_populates="device",
        cascade="all, delete-orphan"
    )