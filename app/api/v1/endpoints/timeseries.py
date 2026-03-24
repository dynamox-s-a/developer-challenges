from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import TimeSeriesNotFoundError, TimeSeriesAlreadyExistsError
from app.db.session import get_db
from app.schemas.timeseries import (
    PredictRequest,
    PredictOut,
    TimeSeriesCreate,
    TimeSeriesOut,
    TimeSeriesDetailOut,
    MetricsOut,
    SeriesCountOut,
    DeleteOut,
    PaginatedTimeSeriesOut,
)
from app.services.timeseries_service import TimeSeriesService

router = APIRouter(prefix="/timeseries", tags=["timeseries"])


def get_service(db: AsyncSession = Depends(get_db)) -> TimeSeriesService:
    return TimeSeriesService(db)


@router.post("/", response_model=TimeSeriesOut, status_code=status.HTTP_201_CREATED)
async def store_series(
    payload: TimeSeriesCreate,
    service: TimeSeriesService = Depends(get_service),
):
    try:
        return await service.store(payload)
    except TimeSeriesAlreadyExistsError as e:
        raise HTTPException(status.HTTP_409_CONFLICT, detail=str(e))


@router.get("/", response_model=PaginatedTimeSeriesOut)
async def list_series(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    service: TimeSeriesService = Depends(get_service),
):
    return await service.list_series(page=page, page_size=page_size)


@router.get("/count", response_model=SeriesCountOut)
async def count_series(service: TimeSeriesService = Depends(get_service)):
    return await service.count()


@router.get("/{series_id}", response_model=TimeSeriesDetailOut)
async def get_series(series_id: str, service: TimeSeriesService = Depends(get_service)):
    try:
        return await service.retrieve(series_id)
    except TimeSeriesNotFoundError as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/{series_id}/metrics", response_model=MetricsOut)
async def get_metrics(series_id: str, service: TimeSeriesService = Depends(get_service)):
    try:
        return await service.get_metrics(series_id)
    except TimeSeriesNotFoundError as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{series_id}", response_model=DeleteOut)
async def delete_series(series_id: str, service: TimeSeriesService = Depends(get_service)):
    try:
        return await service.delete(series_id)
    except TimeSeriesNotFoundError as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/{series_id}/predict", response_model=PredictOut)
async def predict(
    series_id: str,
    body: PredictRequest,
    service: TimeSeriesService = Depends(get_service),
):
    try:
        return await service.predict(series_id, body)
    except TimeSeriesNotFoundError as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValueError as e:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
