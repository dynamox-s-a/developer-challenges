from contextlib import asynccontextmanager

from fastapi import FastAPI

from sqlmodel import Session, select, func

from sqlalchemy.orm import selectinload

from database import create_db_and_tables, engine

from models import (
    TimeSeries, TimeSeriesCreate, TimeSeriesRead,
    Measurement
)

from typing import List

# Initializing database
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


# Create API app, setting up the database first
app = FastAPI(lifespan=lifespan)



# Routes

@app.get('/')
def root():
    return {'message': 'hello world'}

@app.get('/series/')
def read_all_series():
    """
        Retrieve all time-series registered, but without
        corresponding measurements
    """
    
    with Session(engine) as session:
        query = select(TimeSeries)
        results = session.exec(query).all()

        return results

@app.get('/series/{time_series_id}', response_model=TimeSeriesRead)
def read_series(time_series_id: int):
    """
        Time-series reading route.
        Here we receive an series ID and retrieve the first match 
        found in database with all registred measurements.
    """

    with Session(engine) as session:

        timeseries = session.get(TimeSeries, time_series_id)

        if timeseries:
            measurements = timeseries.measurements

        return timeseries

@app.get('/series/full_series/', response_model=List[TimeSeriesRead])
def read_full_series():
    """
        Retrieve all time-series with all measurements
    """

    with Session(engine) as session:
        query = select(TimeSeries).options(selectinload(TimeSeries.measurements))
        all_timeseries = session.exec(query).all()

        return all_timeseries


@app.post('/series/')
def create_series(timeseries: TimeSeriesCreate, response_model=TimeSeriesRead):
    """
        Time-series creating route.
        Here we receive a request with sensor name and measurements raw data
        to create a new time-series object in database with corresponding
        measurements.
    """

    with Session(engine) as session:
        # data validation before insert
        timeseries_validated = TimeSeries.model_validate(timeseries)

        timeseries_validated.measurements = [Measurement.model_validate(m) for m in timeseries.measurements]



        session.add(timeseries_validated)
        session.commit()
        session.refresh(timeseries_validated)

        return timeseries_validated
    

@app.delete('/series/{time_series_id}')
def delete_series(time_series_id: int):
    with Session(engine) as session:
        query = select(TimeSeries).where(TimeSeries.id == time_series_id)
        time_series = session.exec(query).one_or_none()

        if time_series is None:
            return {'Response': 'Time-series not found, please check if the ID is correct'}

        session.delete(time_series)
        session.commit()

@app.get('/series/metrics/{time_series_id}')
def get_metrics(time_series_id):
    """
        Retrieve 3 metrics from an informed timeseries
        Air humidity average, max air humidity and min air humidity
    """

    with Session(engine) as session:
        
        avg_humidity = session.exec(select(func.avg(Measurement.air_humidity)).where(Measurement.timeseries_id == time_series_id)).one()
        max_humidity = session.exec(select(func.max(Measurement.air_humidity)).where(Measurement.timeseries_id == time_series_id)).one()
        min_humidity = session.exec(select(func.min(Measurement.air_humidity)).where(Measurement.timeseries_id == time_series_id)).one()

        metrics = {
            'average_humidity': avg_humidity,
            'max_humidity': max_humidity,
            'min_humidity': min_humidity
        }
        return metrics
    
@app.get('/series/count/')
def count_series():
    """
        Retrieve the number of all registered time-series
    """
    with Session(engine) as session:
        count = select(func.count()).select_from(TimeSeries)
        time_series_number = session.exec(count).one()
        return time_series_number
