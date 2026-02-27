from itertools import count

from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import asc, desc
from uuid import UUID

from app.models.machine import Machine
from app.models.signal import Signal
from app.models.metrics import Metric

class MachineService:
    @staticmethod
    def create_machine(
        db: Session,
        name: str, 
        location: str
    ) -> Machine:
        machine = Machine(name=name, location=location)
        db.add(machine)
        db.commit()
        db.refresh(machine)
        return machine

    @staticmethod
    def get_machine_by_id(
        db: Session, 
        machine_id: UUID
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
        limit: int, 
        offset: int
    ):
        query = db.query(Machine)
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
    def delete_machine(
        db: Session, 
        machine_id: UUID
    ):
        machine = MachineService.get_by_id(db, machine_id)
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
        MachineService.get_by_id(db, machine_id)

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
        machine_id: UUID
    ):
        MachineService.get_machine_by_id(db, machine_id)

        signals = db.query(Signal).filter(Signal.machine_id == machine_id).all()
        return signals
    
    @staticmethod
    def count_machine_signals(
        db: Session,
        machine_id: UUID
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