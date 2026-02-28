from itertools import count
from typing import Optional
from datetime import datetime

from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import asc, desc
from uuid import UUID

from app.enums.signal_type import SignalType
from app.models import machine
from app.models.machine import Machine
from app.models.signal import Signal
from app.models.metric import Metric
from app.schemas.machine_schema import MachineResponse
from app.schemas.signal_schema import SignalResponse
from app.services.pagination_service import PaginationService

class MachineService:
    @staticmethod
    def create_machine(
        data: MachineResponse,
        db: Session        
    ) -> Machine:
        machine = Machine(name=data.name, location=data.location)
        db.add(machine)
        db.commit()
        db.refresh(machine)
        return machine

    @staticmethod
    def get_machine_by_id( 
        machine_id: UUID,
        db: Session,
    ) -> Machine:
        machine = db.query(Machine).filter(Machine.id == machine_id).first()
        if not machine:
            raise HTTPException(
                status_code=404, 
                detail="Machine not found"
            )
        return machine

    @staticmethod
    def list_machines(
        db: Session, 
        limit: int = 10, 
        offset: int = 0
    ):
        query = db.query(Machine).order_by(Machine.created_at.desc())

        return PaginationService.paginate(
            query=query,
            limit=limit,
            offset=offset,
            schema_class=MachineResponse,
            count_total=True
        )

    @staticmethod
    def delete_machine(
        machine_id: UUID,
        db: Session        
    ):
        machine = db.query(Machine).filter(Machine.id == machine_id).first()
        if not machine:
            raise HTTPException(
                status_code=404, 
                detail="Machine not found"
            )
        
        db.delete(machine)
        db.commit()
        return {
            "message": "Machine deleted successfully"
        }
    
    @staticmethod
    def list_metrics(
        db: Session,
        machine_id: UUID,
        start_date,
        end_date,
        limit,
        offset,
        order
    ):
        MachineService.get_machine_by_id(machine_id, db)

        query = (
            db.query(Metric)
            .join(Signal)
            .filter(Signal.machine_id == machine_id)
        )

        if start_date and end_date and start_date > end_date:
            raise HTTPException(
                status_code=400, 
                detail="start_date cannot be greater than end_date"
            )

        if start_date:
            query = query.filter(Metric.timestamp >= start_date)

        if end_date:
            query = query.filter(Metric.timestamp <= end_date)

        if order.lower() == "asc":
            query = query.order_by(asc(Metric.timestamp))
        else:
            query = query.order_by(desc(Metric.timestamp))

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
    def get_machine_signals(
        db: Session,
        machine_id: UUID,
        limit: int = 50,
        offset: int = 0,
        signal_type: Optional[SignalType] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ):
        machine = MachineService.get_machine_by_id(machine_id, db)

        query = db.query(Signal).filter(Signal.machine_id == machine_id)

        # filters
        if signal_type:
            query = query.filter(Signal.signal_type == signal_type)
        if start_time:
            query = query.filter(Signal.timestamp >= start_time)
        if end_time:
            query = query.filter(Signal.timestamp <= end_time)

        query = query.order_by(desc(Signal.timestamp))

        return PaginationService.paginate(
            query=query,
            limit=limit,
            offset=offset,
            schema_class=SignalResponse,
        )
    
    @staticmethod
    def count_machine_signals(
        machine_id: UUID,
        db: Session,
    ):
        #retrives signals count for a given machine
        machine = db.query(Machine).filter(Machine.id == machine_id).first()
        if not machine:
            raise HTTPException(
                status_code=404, 
                detail="Machine not found"
            )
        
        count = db.query(Signal).filter(Signal.machine_id == machine_id).count()
        return {
            "machine_id": machine_id,
            "total_signals": count
        }