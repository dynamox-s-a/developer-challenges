import os
from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy.pool import QueuePool
from .config import settings

database_url = settings.DATABASE_URL

if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    database_url,
    echo=False,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    connect_args={"connect_timeout": 5}
)

def get_session():
    with Session(engine) as session:
        yield session

def create_db():
    from ..models import User, Machine, MonitoringPoint, Sensor
    SQLModel.metadata.create_all(engine)