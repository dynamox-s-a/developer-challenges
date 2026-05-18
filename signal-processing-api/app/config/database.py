import os

# ORM imports
from sqlmodel import SQLModel, create_engine, Session

# Models import guaranteeing database tests
from models.timeseries import TimeSeries
from models.measurement import Measurement

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://signal_api:dynamox@localhost:5432/signal')


engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    """
        Function that create database and all registered tables
    """
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session