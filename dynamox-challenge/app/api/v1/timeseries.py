"""Time series API endpoints - store, retrieve, metrics, delete, count."""
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session
from app.schemas.timeseries import (
    TimeSeriesCreate,
    TimeSeriesResponse,
    TimeSeriesMetricsResponse,
    TimeSeriesCountResponse,
)
from app.services.timeseries_service import TimeSeriesService

router = APIRouter(prefix="/timeseries", tags=["timeseries"])


@router.post("", response_model=TimeSeriesResponse)
def store_timeseries(
    payload: TimeSeriesCreate,
    db: Session = Depends(get_db_session),
):
    """Store a raw data series."""
    service = TimeSeriesService(db)
    return service.create(payload)


@router.get("/count", response_model=TimeSeriesCountResponse)
def get_timeseries_count(db: Session = Depends(get_db_session)):
    """Retrieve the number of time series stored."""
    service = TimeSeriesService(db)
    return service.get_count()


@router.get("/{series_id}", response_model=TimeSeriesResponse)
def get_timeseries(
    series_id: int,
    db: Session = Depends(get_db_session),
):
    """Retrieve a full time series by id."""
    service = TimeSeriesService(db)
    return service.get_by_id(series_id)


@router.get("/{series_id}/metrics", response_model=TimeSeriesMetricsResponse)
def get_timeseries_metrics(
    series_id: int,
    db: Session = Depends(get_db_session),
):
    """Retrieve metrics about the time series."""
    service = TimeSeriesService(db)
    return service.get_metrics(series_id)


@router.delete("/{series_id}", status_code=204)
def delete_timeseries(
    series_id: int,
    db: Session = Depends(get_db_session),
):
    """Delete a time series."""
    service = TimeSeriesService(db)
    service.delete(series_id)
