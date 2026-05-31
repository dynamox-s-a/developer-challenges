from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_db,
    get_timeseries_or_404,
)

from app.models import TimeSeries

from app.repository.timeseries_repository import (
    create_timeseries,
    count_timeseries,
    delete_timeseries,
)

from app.schemas.timeseries import (
    PredictionResponse,
    TimeSeriesCountResponse,
    TimeSeriesCreate,
    TimeSeriesDetail,
    TimeSeriesMetricsResponse,
    TimeSeriesResponse,
)

from app.services.timeseries_service import (
    calculate_metrics,
    predict_future_values,
)

router = APIRouter(
    prefix="/timeseries",
    tags=["TimeSeries"],
)


@router.post(
    "",
    response_model=TimeSeriesResponse,
)
def create(
    payload: TimeSeriesCreate,
    db: Session = Depends(get_db),
):
    timeseries = create_timeseries(
        db=db,
        values=payload.values,
    )

    return TimeSeriesResponse(
        id=timeseries.id,
    )


@router.get(
    "/count",
    response_model=TimeSeriesCountResponse,
)
def count(
    db: Session = Depends(get_db),
):
    return {
        "count": count_timeseries(db)
    }


@router.get(
    "/{timeseries_id}",
    response_model=TimeSeriesDetail,
)
def get_timeseries(
    timeseries: TimeSeries = Depends(
        get_timeseries_or_404
    ),
):
    return timeseries


@router.get(
    "/{timeseries_id}/metrics",
    response_model=TimeSeriesMetricsResponse,
)
def metrics(
    timeseries: TimeSeries = Depends(
        get_timeseries_or_404
    ),
):
    return calculate_metrics(
        timeseries
    )


@router.delete(
    "/{timeseries_id}",
    status_code=204,
)
def delete(
    db: Session = Depends(get_db),
    timeseries: TimeSeries = Depends(
        get_timeseries_or_404
    ),
):
    delete_timeseries(
        db=db,
        timeseries=timeseries,
    )

    return Response(
        status_code=204
    )


@router.get(
    "/{timeseries_id}/predict",
    response_model=PredictionResponse,
)
def predict(
    timeseries: TimeSeries = Depends(
        get_timeseries_or_404
    ),
):
    return PredictionResponse(
        predictions=predict_future_values(
            timeseries
        )
    )