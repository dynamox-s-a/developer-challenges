from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session
from app.schemas.timeseries import (
    CountResponse,
    MetricsResponse,
    TimeSeriesCreate,
    TimeSeriesResponse,
)
from app.services.timeseries_service import TimeseriesService

router = APIRouter(prefix="/timeseries", tags=["timeseries"])


@router.post(
    "",
    response_model=TimeSeriesResponse,
    status_code=201,
    summary="Store a raw time series",
)
def store_timeseries(
    payload: TimeSeriesCreate,
    db: Session = Depends(get_db_session),
) -> TimeSeriesResponse:
    return TimeseriesService(db).create(payload)


@router.get(
    "/count",
    response_model=CountResponse,
    summary="Count stored time series",
)
def get_timeseries_count(
    db: Session = Depends(get_db_session),
) -> CountResponse:
    return TimeseriesService(db).get_count()


@router.get(
    "/{series_id}",
    response_model=TimeSeriesResponse,
    summary="Retrieve a time series by ID",
)
def get_timeseries(
    series_id: UUID,
    limit: int = Query(default=100, ge=1, le=10_000, description="Max data points to return"),
    offset: int = Query(default=0, ge=0, description="Number of data points to skip"),
    db: Session = Depends(get_db_session),
) -> TimeSeriesResponse:
    return TimeseriesService(db).get_by_id(series_id, limit=limit, offset=offset)


@router.get(
    "/{series_id}/metrics",
    response_model=MetricsResponse,
    summary="Get aggregated metrics for a time series",
)
def get_timeseries_metrics(
    series_id: UUID,
    db: Session = Depends(get_db_session),
) -> MetricsResponse:
    return TimeseriesService(db).get_metrics(series_id)


@router.delete(
    "/{series_id}",
    status_code=204,
    summary="Delete a time series",
)
def delete_timeseries(
    series_id: UUID,
    db: Session = Depends(get_db_session),
) -> None:
    TimeseriesService(db).delete(series_id)
