from sqlalchemy import Column, Integer, String
from models.base import Base

class Sensor(Base):
    """Data model for Sensor.
    
    Represents a sensor that collects measurements.
    """
    __tablename__ = "sensors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    
    def __repr__(self):
        return f"<Sensor(id={self.id}, name='{self.name}')>"