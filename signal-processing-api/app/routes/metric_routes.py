from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.models.metrics import Metrics
from app.schemas.metrics_schema import MetricsCreate, MetricsResponse

router = APIRouter(prefix="/metrics", tags=["Metrics"])

@router.post("/", response_model=MetricsResponse)
def create_metrics(metrics: MetricsCreate, db: Session = Depends(get_db)):
    db_metrics = Metrics(
        machine_id=metrics.machine_id,
        signal_id=metrics.signal_id,
        metric_type=metrics.metric_type,
        value=metrics.value
    )

    db.add(db_metrics)
    db.commit()
    db.refresh(db_metrics)
    
    return db_metrics