


from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Index, func, String, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class RawData(Base):
    __tablename__ = "raw_data"

    
    id = Column(Integer, primary_key=True, autoincrement=True)

    device_id = Column(
        Integer,
        ForeignKey("devices.id", ondelete="CASCADE"),
        nullable=False
        
    )

    
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    
   
    value = Column(Float(precision=53), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

   
    device = relationship(
        "Device",
        back_populates="raw_data"
    )

   
    __table_args__ = (
    UniqueConstraint("device_id", "timestamp"),
    )   
        
    