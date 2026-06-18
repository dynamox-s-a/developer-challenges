from tortoise.exceptions import IntegrityError
from fastapi import APIRouter, HTTPException, Query
from app.repositories.time_series import TimeSeriesRepository
from app.schemas.requests import TimeSeriesCreate
from app.schemas.responses import CountResponse, TimeSeriesMetrics, TimeSeriesOut, TimeSeriesPrediction
from app.services.time_series import calculate_metrics
from app.services.prediction import predict_linear
from fastapi import status
from app.services.get_or_not_found import get_series_or_404

router = APIRouter(prefix="/api/v1/series", tags=["Time Series"])
repo = TimeSeriesRepository()


@router.post("/", status_code=201, response_model=TimeSeriesOut)
async def create_series(data: TimeSeriesCreate):
    try:
        instance_created = await repo.create(data)
    except IntegrityError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return instance_created


@router.get("/count", response_model=CountResponse)
async def count_series():
    total = await repo.count()
    return CountResponse(count=total)


@router.get("/{series_id}", response_model=TimeSeriesOut)
async def get_series(series_id: str):
    return await get_series_or_404(series_id)


@router.get("/{series_id}/metrics", response_model=TimeSeriesMetrics)
async def get_metrics(series_id: str):
    series = await get_series_or_404(series_id)
    return calculate_metrics(series)


@router.get("/{series_id}/predict", response_model=TimeSeriesPrediction)
async def predict_series(
    series_id: str,
    steps: int = Query(default=10, ge=1, le=100),
):
    series = await get_series_or_404(series_id)
    try:
        return predict_linear(series, steps)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail=str(e))



@router.delete("/{series_id}", status_code=204)
async def delete_series(series_id: str):
    series = await get_series_or_404(series_id)
    await repo.delete(series)

