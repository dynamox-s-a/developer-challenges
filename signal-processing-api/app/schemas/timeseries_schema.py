from datetime import datetime

from models.timeseries import TimeSeriesBase
from models.measurement import Measurement
from schemas.measurement_schema import MeasurementRead


class TimeSeriesCreate(TimeSeriesBase):
    # Only used for POST requests
    """
        What expects:
        - Sensor
        - Measurements list
    """

    measurements: list['Measurement']


class TimeSeriesRead(TimeSeriesBase):
    # Used for data visualization
    """ What appears: 
        - ID
        - Sensor
        - Created_at
        - Measurements list
    """
    id: int
    created_at: datetime
    measurements: list['MeasurementRead']
