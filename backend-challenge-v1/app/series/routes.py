from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.series.models import TimeSeries
from app.series.schemas import TimeSeriesCreate, TimeSeriesResponse, MessageResponse, MetricsResponse, CountResponse
from app.series.services import (create_series, delete_series, count_series_by_client, get_metrics, get_series_by_client, get_series) 
from app.core.auth import get_current_user
from typing import List

router = APIRouter(prefix="/series", tags=["timeseries"], dependencies=[Depends(get_current_user)])

@router.post("/", response_model=TimeSeriesResponse)
def create_series_route(payload: TimeSeriesCreate, db: Session = Depends(get_db),current_user = Depends(get_current_user)):
    series = create_series(db, payload)

    if not series:
        raise HTTPException(400, "It was not possible to create a series.")

    return series

@router.get("/client/{client_id}", response_model=List[TimeSeriesResponse])
def get_series_by_client_route(client_id: int, db: Session = Depends(get_db),current_user = Depends(get_current_user)):
    series = get_series_by_client(db, client_id)

    if not series:
        raise HTTPException(
            status_code=404,
            detail="No series found for this client"
        )

    return series


@router.get("/device/{device_uid}/list", response_model=List[TimeSeriesResponse])
def get_series_by_device_route(device_uid: str, db: Session = Depends(get_db)):
    return db.query(TimeSeries).filter(TimeSeries.device_uid == device_uid).all()

@router.get("/count/{client_id}", response_model=CountResponse)
def count_series_route(client_id: int, db: Session = Depends(get_db)):
    count = count_series_by_client(db, client_id)
    return CountResponse(count=count)

@router.get("/{series_id}", response_model=TimeSeriesResponse)
def get_series_route(series_id: int, db: Session = Depends(get_db)):
    series = get_series(db, series_id)
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")
    return series

@router.get("/{series_id}/metrics", response_model=MetricsResponse)
def get_metrics_route(series_id: int, db: Session = Depends(get_db)):
    series = get_series(db, series_id)
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")
    
    values = [item["value"] for item in series.values if isinstance(item.get("value"), (int, float))]
    
    if not values:
        raise HTTPException(status_code=400, detail="Series has no numeric values")
    
    metrics = get_metrics(values)
    metrics["count"] = len(series.values)
    return metrics

@router.delete("/{series_id}", response_model=MessageResponse)
def delete_series_route(series_id: int, db: Session = Depends(get_db), deleted_by: str = "system"):
    deleted_serie = delete_series(db, series_id, deleted_by)
    if not deleted_serie:
        raise HTTPException(status_code=400, detail="Series not found")
    return MessageResponse(
        message="Series deleted successfully",
        status=True
    )

