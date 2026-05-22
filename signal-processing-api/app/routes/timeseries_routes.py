from typing import List

from fastapi import APIRouter, Depends

from schemas.timeseries_schema import TimeSeriesCreate, TimeSeriesRead
from services.timeseries_service import TimeSeriesService, get_timeseries_service


router = APIRouter(tags=['Timeseries'])


### GET ROUTES ###

@router.get('/series/')
def read_all_series(service: TimeSeriesService = Depends(get_timeseries_service)):
    """Retrieve all time-series registered, but without
    corresponding measurements"""

    all_timeseries = service.read_all_timeseries()

    return all_timeseries

@router.get('/series/count/')
def count_series(service: TimeSeriesService = Depends(get_timeseries_service)):
    """Retrieve the number of all registered time-series"""

    timeseries_total = service.count_timeseries()
    return timeseries_total


@router.get('/series/full_series/', response_model=List[TimeSeriesRead])
def read_full_series(service: TimeSeriesService = Depends(get_timeseries_service)):
    """Retrieve all time-series with all measurements"""

    all_timeseries_with_measurements = service.read_full_timeseries()

    return all_timeseries_with_measurements


@router.get('/series/{time_series_id}', response_model=TimeSeriesRead)
def read_series(time_series_id: int, service: TimeSeriesService = Depends(get_timeseries_service)):
    """Time-series reading route.
    Here we receive an series ID and retrieve the first match 
    found in database with all registred measurements"""

    timeseries = service.read_timeseries(time_series_id)

    return timeseries


@router.get('/series/metrics/{time_series_id}')
def get_metrics(time_series_id: int, service: TimeSeriesService = Depends(get_timeseries_service)):
    """Retrieve 3 metrics from an informed timeseries
    Air humidity average, max air humidity and min air humidity"""

    timeseries_metrics = service.get_timeseries_metrics(time_series_id)

    return timeseries_metrics


### POST ROUTES ###

@router.post('/series/', response_model=TimeSeriesRead)
def create_series(timeseries: TimeSeriesCreate, service: TimeSeriesService = Depends(get_timeseries_service)):
    """Time-series creating route.
    Here we receive a request with sensor name and measurements raw data
    to create a new time-series object in database with corresponding
    measurements"""

    new_timeseries = service.create_timeseries(timeseries)

    return new_timeseries


### DELETE ROUTES ###

@router.delete('/series/{time_series_id}')
def delete_series(time_series_id: int, service: TimeSeriesService = Depends(get_timeseries_service)):
    """Receives a time-series id delete the record"""
    deleted_timeseries = service.delete_timeseries(time_series_id)

    return deleted_timeseries