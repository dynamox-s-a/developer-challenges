from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db_session
from app.schemas.time_series import (
    TimeSeriesCountResponse,
    TimeSeriesCreate,
    TimeSeriesCreateResponse,
    TimeSeriesMetricsResponse,
    TimeSeriesResponse,
    TimeSeriesSummaryResponse,
    TimeSeriesForecastResponse,
    TimeSeriesPointsAppend,
    TimeSeriesPointsAppendResponse,
)
from app.services.time_series_service import TimeSeriesService


router = APIRouter(prefix="/api/v1/time-series", tags=["Time Series"])


def get_service(db: Session = Depends(get_db_session)) -> TimeSeriesService:
    return TimeSeriesService(db)


@router.post(
    "",
    response_model=TimeSeriesCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_time_series(
    payload: TimeSeriesCreate,
    service: TimeSeriesService = Depends(get_service),
):
    series = service.create(payload)

    return TimeSeriesCreateResponse(
        id=series.id,
        message="Time series created successfully",
    )


@router.get(
    "",
    response_model=list[TimeSeriesSummaryResponse],
)
def get_all_time_series(
    service: TimeSeriesService = Depends(get_service),
):
    return service.get_all()


@router.get(
    "/count",
    response_model=TimeSeriesCountResponse,
)
def count_time_series(
    service: TimeSeriesService = Depends(get_service),
):
    return TimeSeriesCountResponse(count=service.count())

@router.post(
    "/{series_id}/points",
    response_model=TimeSeriesPointsAppendResponse,
    status_code=status.HTTP_201_CREATED,
)
def append_time_series_points(
    series_id: UUID,
    payload: TimeSeriesPointsAppend,
    service: TimeSeriesService = Depends(get_service),
):
    return service.append_points(series_id, payload)


@router.get(
    "/{series_id}/forecast",
    response_model=TimeSeriesForecastResponse,
)
def forecast_time_series(
    series_id: UUID,
    steps: int = 5,
    service: TimeSeriesService = Depends(get_service),
):
    return service.forecast(series_id, steps)


@router.get(
    "/{series_id}",
    response_model=TimeSeriesResponse,
)
def get_time_series_by_id(
    series_id: UUID,
    service: TimeSeriesService = Depends(get_service),
):
    return service.get_by_id(series_id)


@router.get(
    "/{series_id}/metrics",
    response_model=TimeSeriesMetricsResponse,
)
def get_time_series_metrics(
    series_id: UUID,
    service: TimeSeriesService = Depends(get_service),
):
    return service.get_metrics(series_id)


@router.delete(
    "/{series_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_time_series(
    series_id: UUID,
    service: TimeSeriesService = Depends(get_service),
):
    service.delete(series_id)