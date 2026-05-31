from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.schemas.timeseries import (
    TimeSeriesCreate,
    TimeSeriesResponse,
    TimeSeriesDetail,
    TimeSeriesCountResponse,
    TimeSeriesMetricsResponse,
    PredictionResponse,
)

from app.repository.timeseries_repository import (
    create_timeseries,
    count_timeseries,
    delete_timeseries,
)

from app.services.timeseries_service import (
    calculate_metrics,
    predict_future_values,
)

from app.core.dependencies import (
    get_db,
    get_timeseries_or_404,
)

router = APIRouter(prefix="/timeseries", tags=["TimeSeries"])


@router.post("", response_model=TimeSeriesResponse)
def create(payload: TimeSeriesCreate, db: Session = Depends(get_db)):
    ts = create_timeseries(db, payload.values)
    return {"id": ts.id}


@router.get("/count", response_model=TimeSeriesCountResponse)
def count(db: Session = Depends(get_db)):
    return {"count": count_timeseries(db)}


@router.get("/{timeseries_id}", response_model=TimeSeriesDetail)
def get(timeseries=Depends(get_timeseries_or_404)):
    return timeseries


@router.get("/{timeseries_id}/metrics", response_model=TimeSeriesMetricsResponse)
def metrics(timeseries=Depends(get_timeseries_or_404)):
    return calculate_metrics(timeseries)


@router.delete("/{timeseries_id}", status_code=204)
def delete(
    db: Session = Depends(get_db),
    timeseries=Depends(get_timeseries_or_404),
):
    delete_timeseries(db, timeseries)
    return


@router.get("/{timeseries_id}/predict", response_model=PredictionResponse)
def predict(timeseries=Depends(get_timeseries_or_404)):
    return {
        "predictions": predict_future_values(timeseries)
    }