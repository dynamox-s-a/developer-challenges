from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base

db= create_engine("sqlite:///./data.db")
Base = declarative_base()

class Medicao(Base):
    __tablename__ = "medicoes"
    
    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, index=True)
    name = Column(String, index=True)
    value = Column(Float, index=True)
    timestamp = Column(DateTime, index=True)
    
    def __repr__(self):
        return f"<Medicao(id={self.id}, sensor_id={self.sensor_id}, name='{self.name}', value={self.value}, timestamp='{self.timestamp}')>"
