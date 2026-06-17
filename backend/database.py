from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.sensor import Sensor
from models.medicao import Medicao
from models.base import Base

engine = create_engine("sqlite:///./data.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
