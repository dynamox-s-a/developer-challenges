import os
from pathlib import Path
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text
from fastapi import Depends

from models.timeseries import TimeSeries
from models.measurement import Measurement


DATABASE_URL = os.getenv('DATABASE_URL', 
                         'postgresql://signal_api:dynamox@database:5432/signal')

engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    """Function that create database and all registered tables"""
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

def seed_db():
    if 'postgresql' in DATABASE_URL:
        current_dir = Path(__file__).parent

        seed_path = f'{current_dir}/seed.sql'
        with Session(engine) as session:
            with open(seed_path, 'r', encoding='UTF-8') as f:
                seeding_commands = f.read()
        
            session.execute(text(seeding_commands))
            session.commit()
    else: 
        return