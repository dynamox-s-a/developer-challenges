import os
from sqlmodel import create_engine, SQLModel, Session
from .config import settings

database_url = settings.DATABASE_URL

if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(database_url, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

def create_db():
    from ..models import User, Machine, MonitoringPoint, Sensor
    SQLModel.metadata.create_all(engine)