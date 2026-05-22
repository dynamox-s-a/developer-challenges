from fastapi import Depends, HTTPException

from sqlmodel import Session, select, func
from sqlalchemy.orm import selectinload

import pandas as pd

from config.database import get_session

from models.timeseries import TimeSeries
from models.measurement import Measurement

from schemas.timeseries_schema import TimeSeriesCreate
from schemas.measurement_schema import MeasurementRead


class TimeSeriesService:
    """Time-series services"""
    
    def __init__(self, session: Session):
        self.session = session

    ### Reading Services ###

    def read_all_timeseries(self):
        """Retrieve all time-series registered, but 
        without corresponding measurements"""
        
        query = select(TimeSeries)
        results = self.session.exec(query).all()

        return results

    def read_timeseries(self, time_series_id: int):
        """Time-series reading route.
            Here we receive an series ID and retrieve the first match 
            found in database with all registred measurements"""

        timeseries = self.session.get(TimeSeries, time_series_id)

        if timeseries:
            measurements = timeseries.measurements
            return timeseries
        
        raise HTTPException(status_code=404, detail='Time-series not found')

    def read_full_timeseries(self):
        """Retrieve all time-series with all measurements"""

        query = select(TimeSeries).options(selectinload(TimeSeries.measurements))
        all_timeseries = self.session.exec(query).all()

        return all_timeseries

    ### Creating Services ###

    def create_timeseries(self, timeseries: TimeSeriesCreate):
        """Time-series creating route.
        Here we receive a request with sensor name and measurements raw data
        to create a new time-series object in database with corresponding
        measurements"""
        
        timeseries_validated = TimeSeries.model_validate(timeseries)

        timeseries_validated.measurements = [Measurement.model_validate(m) for m in timeseries.measurements]

        self.session.add(timeseries_validated)
        self.session.commit()
        self.session.refresh(timeseries_validated)

        return timeseries_validated
        

    ### Deleting Services ###

    def delete_timeseries(self, time_series_id: int):
        """Delete times-eries data if exists,
        delete all related measurements"""

        query = select(TimeSeries).where(TimeSeries.id == time_series_id)
        time_series = self.session.exec(query).one_or_none()

        if not time_series:
            return {'message': 'Time-series not found, please check if the ID is correct'}

        self.session.delete(time_series)
        self.session.commit()

        return {'message': 'Time-series successfully deleted'}

    # Time-series Metrics Services
    def get_timeseries_metrics(self, time_series_id: int):
        """Retrieve 3 metrics from an informed timeseries
        Air humidity average, max air humidity, min air humidity
        and standard deviation humidity"""

        humidity = Measurement.air_humidity
        related_timeseries_id = Measurement.timeseries_id
        relation = related_timeseries_id == time_series_id

        avg_query = select(func.avg(humidity)).where(relation)
        max_query = select(func.max(humidity)).where(relation)
        min_query = select(func.min(humidity)).where(relation)

        avg_humidity = self.session.exec(avg_query).one()
        max_humidity = self.session.exec(max_query).one()
        min_humidity = self.session.exec(min_query).one()
        

        stddev_query = select(humidity).where(relation)
        measurements = self.session.exec(stddev_query).all()
        pandas_series = pd.Series(measurements)
        
        stddev = pandas_series.std()

        metrics = {
            'average_humidity': avg_humidity,
            'max_humidity': max_humidity,
            'min_humidity': min_humidity,
            'stddev': stddev
        }

        if not all(metrics.values()):
            raise HTTPException(404, detail='Time-series not found')

        return metrics        

    ### Metadata Services ###

    def count_timeseries(self):
        """Retrieve the number of all registered time-series"""

        count_query = select(func.count()).select_from(TimeSeries)
        time_series_number = self.session.exec(count_query).one()

        return {'time_series_count': time_series_number}



def get_timeseries_service(session: Session = Depends(get_session)) -> TimeSeriesService:
    """Retrieve a TimeSeriesService Object with
    a defined session"""

    return TimeSeriesService(session)