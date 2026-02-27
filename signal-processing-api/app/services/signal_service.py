from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID

from app.models.signal import Signal
from app.models.metrics import Machine, Metric
from app.schemas.signal_schema import SignalCreate

class SignalService:
    @staticmethod
    def create_signal(
        db: Session,
        machine_id: UUID, 
        data: SignalCreate
    ):
        machine = db.query(Machine).filter(Machine.id == machine_id).first()
        if not machine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Machine not found. You cannot create a signal for a non-existent machine."
            )
        
        signal = Signal(
            **data.model_dump(), 
            machine_id=machine_id
        )

        db.add(signal)
        db.commit()
        db.refresh(signal)
        return signal
    
    @staticmethod
    def get_signal_by_id(
        db: Session, 
        signal_id: UUID
    ):
        
        signal = db.query(Signal).filter(Signal.id == signal_id).first()
        if not signal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Signal not found"
            )
        return signal
    
    @staticmethod
    def delete_signal(
        db: Session, 
        signal_id: UUID
    ):
        signal = SignalService.get_signal_by_id(db, signal_id)
        db.delete(signal)
        db.commit()

        return {
            "message": "Signal deleted successfully"
        }
    
    @staticmethod
    def list_signals_by_machine(
        db: Session, 
        machine_id: UUID,
        limit,
        offset
    ):
        query = db.query(Signal).filter(Signal.machine_id == machine_id)
        
        items = query.offset(offset).limit(limit + 1).all()
        has_next = len(items) > limit
        data = items[:limit]

        return {
            "limit": limit,
            "offset": offset,
            "has_next": has_next,
            "data": data
        }
    
    @staticmethod
    def get_full_time_series(
        db: Session, 
        signal_id: UUID
    ):
        #retrives  the whole time series data for a given signal, which can be used for further processing or analysis.
        signal = SignalService.get_signal_by_id(db, signal_id)

        #serch for all metrics for a given signal and order them by timestamp in ascending order
        metrics = db.query(Metric)\
            .filter(Metric.signal_id == signal_id)\
            .order_by(Metric.timestamp)\
            .all()

        return {
            "signal_id": signal_id,
            "machine_id": signal.machine_id,
            "signal_type": signal.signal_type,
            "total_points": len(metrics),
            "data": [
                {
                    "timestamp": metric.timestamp,
                    "value": metric.value,
                    "metric_type": metric.metric_type
                }
                for metric in metrics
            ]
        }