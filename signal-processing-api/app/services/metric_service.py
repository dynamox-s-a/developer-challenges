from typing import Optional
from datetime import datetime

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy import desc
from uuid import UUID

from app.enums.metric_type import MetricType
from app.models.metric import Metric
from app.models.signal import Signal
from app.schemas.metric_schema import MetricsResponse
from app.services.pagination_service import PaginationService

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
        metric_id: UUID,
        db: Session
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
        metric_id: UUID,
        db: Session, 
    ):
        metric = MetricService.get_metric_by_id(metric_id, db)
        db.delete(metric)
        db.commit()

        return {
            "message": "Metric deleted successfully"
        }
    
    @staticmethod
    def list_metrics_by_signal(
        db: Session,
        signal_id: UUID,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        metric_type: Optional[MetricType] = None,
        order: str = "desc",
        limit: int = 50,
        offset: int = 0
    ):
        #checking if signal exists
        signal = db.query(Signal).filter(Signal.id == signal_id).first()
        if not signal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Signal not found"
            )
        
        query = db.query(Metric).filter(Metric.signal_id == signal_id)

        if start_date:
            query = query.filter(Metric.timestamp >= start_date)
        if end_date:
            query = query.filter(Metric.timestamp <= end_date)

        if metric_type:
            query = query.filter(Metric.metric_type == metric_type)

        if order == "desc":
            query = query.order_by(Metric.timestamp.desc())
        else:
            query = query.order_by(Metric.timestamp.asc())

        return PaginationService.paginate(
            query=query,
            limit=limit,
            offset=offset,
            schema_class=MetricsResponse,
            count_total=True
        )
    
    @staticmethod
    def list_metrics_by_machine(
        db: Session,
        machine_id: UUID,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        metric_type: Optional[str] = None,
        signal_type: Optional[str] = None,
        order: str = "desc",
        limit: int = 50,
        offset: int = 0
    ):
        # listing all the metrics from a given machine. also checking if the machine exists before querying the metrics
        machine = db.query(Signal).filter(Signal.machine_id == machine_id).first()
        if not machine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Machine not found"
            )

        query = db.query(Metric)\
            .join(Signal, Signal.id == Metric.signal_id)\
            .filter(Signal.machine_id == machine_id)
        
        if start_time:
            query = query.filter(Metric.timestamp >= start_time)
        if end_time:
            query = query.filter(Metric.timestamp <= end_time)
        if metric_type:
            query = query.filter(Metric.metric_type == metric_type)
        if signal_type:
            query = query.filter(Signal.signal_type == signal_type)
        
        if order == "desc":
            query = query.order_by(Metric.timestamp.desc())
        else:
            query = query.order_by(Metric.timestamp.asc())
        
        return PaginationService.paginate(
            query=query,
            limit=limit,
            offset=offset,
            schema_class=MetricsResponse,
            count_total=True
        )