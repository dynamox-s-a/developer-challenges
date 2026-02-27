from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.dependencies import get_db
from app.schemas.metric_schema import MetricsCreate
from app.services.metrics_service import MetricService

router = APIRouter(prefix="/signals", tags=["Metrics"])

@router.post("/signals/{signal_id}/metrics")
def create_metric(
    signal_id: UUID,
    data: MetricsCreate,
    db: Session = Depends(get_db)
):
    return MetricService.create_metric(db, signal_id, data)

@router.get("/metrics/{metric_id}")
def get_metric(
    metric_id: UUID,
    db: Session = Depends(get_db)
):
    return MetricService.get_metric_by_id(db, metric_id)

@router.delete("/metrics/{metric_id}")
def delete_metric(
    metric_id: UUID,
    db: Session = Depends(get_db)
):
    return MetricService.delete_metric(db, metric_id)

@router.get("/signals/{signal_id}/metrics")
def list_signal_metrics(
    signal_id: UUID,
    start_time: datetime | None = None,
    end_time: datetime | None = None,
    metric_type: str | None = None,
    order: str = Query("desc", pattern="^(asc|desc)$"),
    limit: int = Query(50, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    return MetricService.list_metrics_by_signal(
        db, 
        signal_id, 
        start_time, 
        end_time, 
        metric_type, 
        order, 
        limit, 
        offset
    )