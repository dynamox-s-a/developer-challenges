# Depends import
from fastapi import Depends

# ORM imports
from sqlmodel import Session, select, func
from sqlalchemy.orm import selectinload

# Database import
from config.database import get_session

# Models import
from models.timeseries import TimeSeries
from models.measurement import Measurement

# Schemas import
from schemas.timeseries_schema import TimeSeriesCreate
from schemas.measurement_schema import MeasurementRead



class TimeSeriesService:
    def __init__(self, session: Session):
        self.session = session

    # Reading Services
    def read_all_series(self):
        """
            Retrieve all time-series registered, but without
            corresponding measurements
        """
        query = select(TimeSeries)
        results = self.session.exec(query).all()

        return results

    def read_series(self, time_series_id: int):
        """
            Time-series reading route.
            Here we receive an series ID and retrieve the first match 
            found in database with all registred measurements.
        """

        timeseries = self.session.get(TimeSeries, time_series_id)

        if timeseries:
            measurements = timeseries.measurements

        return timeseries

    def read_full_series(self):
        """
            Retrieve all time-series with all measurements
        """
        query = select(TimeSeries).options(selectinload(TimeSeries.measurements))
        all_timeseries = self.session.exec(query).all()

        return all_timeseries

    # Creating Services
    def create_series(self, timeseries: TimeSeriesCreate):
        """
            Time-series creating route.
            Here we receive a request with sensor name and measurements raw data
            to create a new time-series object in database with corresponding
            measurements.
        """

        # data validation before insert
        timeseries_validated = TimeSeries.model_validate(timeseries)

        timeseries_validated.measurements = [Measurement.model_validate(m) for m in timeseries.measurements]

        self.session.add(timeseries_validated)
        self.session.commit()
        self.session.refresh(timeseries_validated)

        return timeseries_validated
        

    # Deleting Services
    def delete_series(self, time_series_id: int):
        query = select(TimeSeries).where(TimeSeries.id == time_series_id)
        time_series = self.session.exec(query).one_or_none()

        if not time_series:
            return {'message': 'Time-series not found, please check if the ID is correct'}

        self.session.delete(time_series)
        self.session.commit()

        return {'message': 'Time-series successfull deleted'}

    # Time-series Metrics Services
    def get_metrics(self, time_series_id: int):
        """
            Retrieve 3 metrics from an informed timeseries
            Air humidity average, max air humidity and min air humidity
        """

        
        avg_humidity = self.session.exec(select(func.avg(Measurement.air_humidity)).where(Measurement.timeseries_id == time_series_id)).one()
        max_humidity = self.session.exec(select(func.max(Measurement.air_humidity)).where(Measurement.timeseries_id == time_series_id)).one()
        min_humidity = self.session.exec(select(func.min(Measurement.air_humidity)).where(Measurement.timeseries_id == time_series_id)).one()


        metrics = {
            'average_humidity': avg_humidity,
            'max_humidity': max_humidity,
            'min_humidity': min_humidity
        }
        return metrics
        

    # Meta Data Services
    def count_series(self):
        """
            Retrieve the number of all registered time-series
        """
        count = select(func.count()).select_from(TimeSeries)
        time_series_number = self.session.exec(count).one()

        return time_series_number



def get_timeseries_service(session: Session = Depends(get_session)) -> TimeSeriesService:
    """
        Retrieve a TimeSeriesService Object with
        a defined session
    """
    return TimeSeriesService(session)