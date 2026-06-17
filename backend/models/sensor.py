from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base

db= create_engine("sqlite:///./data.db")
Base = declarative_base()

class Sensor(Base):
    __tablename__ = "sensors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    
    def __repr__(self):
        return f"<Sensor(id={self.id}, name='{self.name}')>"