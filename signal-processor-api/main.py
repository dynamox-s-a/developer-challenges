from contextlib import asynccontextmanager

from fastapi import FastAPI

from sqlmodel import Session, select

from database import create_db_and_tables, engine

from models import TimeSeries, Measurements


# Initializing database
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


# Create API app
app = FastAPI(lifespan=lifespan)



# Routes

@app.get('/')
def root():
    return {'message': 'hello world'}

@app.get('/series/{series_id}')
def read_series(series_id: int):
    with Session(engine) as session:
        query = select(TimeSeries).where(TimeSeries.id == series_id)
        timeseries = session.exec(query).first()

        return timeseries

@app.post('/series/')
def create_series(timeseries: TimeSeries):
    with Session(engine) as session:
        session.add(timeseries)
        session.commit()

        return timeseries