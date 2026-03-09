import statistics

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_session
from app.models import DataPoints, TimeSeries
from app.routers.schemas import (
    Message,
    TimeSeriesCount,
    TimeSeriesCreate,
    TimeSeriesMetrics,
    TimeSeriesResponse,
)

router = APIRouter(prefix='/time-series', tags=['Time Series'])


@router.post('/', response_model=TimeSeriesResponse, status_code=201)
def create_time_series(
    data: TimeSeriesCreate,
    session: Session = Depends(get_session),
):
    time_series = TimeSeries(name=data.name)
    session.add(time_series)
    session.flush()

    for dp in data.data_points:
        data_point = DataPoints(timestamp=dp.timestamp, value=dp.value)
        time_series.data_points.append(data_point)

    session.commit()
    session.refresh(time_series)
    return time_series


@router.get('/count', response_model=TimeSeriesCount)
def get_time_series_count(session: Session = Depends(get_session)):
    total = session.scalar(select(func.count(TimeSeries.id)))
    return TimeSeriesCount(total=total or 0)


@router.get('/{series_id}', response_model=TimeSeriesResponse)
def get_time_series(series_id: int, session: Session = Depends(get_session)):
    time_series = session.get(TimeSeries, series_id)

    if not time_series:
        raise HTTPException(status_code=404, detail='Time series not found')

    return time_series


@router.get('/{series_id}/metrics', response_model=TimeSeriesMetrics)
def get_time_series_metrics(
    series_id: int,
    session: Session = Depends(get_session),
):
    time_series = session.get(TimeSeries, series_id)

    if not time_series:
        raise HTTPException(status_code=404, detail='Time series not found')

    values = [dp.value for dp in time_series.data_points]

    if not values:
        raise HTTPException(
            status_code=400, detail='No data points in this series'
        )

    return TimeSeriesMetrics(
        id=time_series.id,
        name=time_series.name,
        count=len(values),
        min_value=min(values),
        max_value=max(values),
        mean_value=statistics.mean(values),
        std_deviation=statistics.stdev(values) if len(values) > 1 else 0.0,
    )


@router.delete('/{series_id}', response_model=Message)
def delete_time_series(
    series_id: int,
    session: Session = Depends(get_session),
):
    time_series = session.get(TimeSeries, series_id)

    if not time_series:
        raise HTTPException(status_code=404, detail='Time series not found')

    session.delete(time_series)
    session.commit()

    return Message(message='Time series deleted successfully')
