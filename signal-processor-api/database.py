from sqlmodel import SQLModel, create_engine
from models import TimeSeries, Measurement

DATABASE_URL = "sqlite:///./signal.db"

# Remember: remove echo for production
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """
        Function that create database and all registered tables
    """
    SQLModel.metadata.create_all(engine)