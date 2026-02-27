from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy import desc
from uuid import UUID

from app.models.metrics import Metric
from app.models.signal import Signal

class MetricService:

    @staticmethod
    def create_metric(
        db: Session,
        signal_id: UUID, 
        data
    ):
        signal = db.query(Signal).filter(Signal.id == signal_id).first()
        if not signal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Signal not found"
            )
        
        metric = Metric(
            **data.model_dump(), 
            signal_id=signal_id
        )

        db.add(metric)
        db.commit()
        db.refresh(metric)
        return metric
    
    @staticmethod
    def get_metric_by_id(
        db: Session, 
        metric_id: UUID
    ):
        metric = db.query(Metric).filter(Metric.id == metric_id).first()
        if not metric:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Metric not found"
            )
        return metric
    
    @staticmethod
    def delete_metric(
        db: Session, 
        metric_id: UUID
    ):
        metric = MetricService.get_metric_by_id(db, metric_id)
        db.delete(metric)
        db.commit()

        return {
            "message": "Metric deleted successfully"
        }
    
    @staticmethod
    def list_metrics_by_signal(
        db: Session,
        signal_id: UUID,
        start_date,
        end_date,
        limit,
        offset,
        order
    ):
        query = db.query(Metric).filter(Metric.signal_id == signal_id)

        if start_date:
            query = query.filter(Metric.timestamp >= start_date)
        if end_date:
            query = query.filter(Metric.timestamp <= end_date)

        if order == "desc":
            query = query.order_by(desc(Metric.timestamp))
        else:
            query = query.order_by(Metric.timestamp)

        items = query.offset(offset).limit(limit + 1).all()

        has_next = len(items) > limit
        data = items[:limit]

        return {
            "limit": limit,
            "offset": offset,
            "has_next": has_next,
            "data": data
        }