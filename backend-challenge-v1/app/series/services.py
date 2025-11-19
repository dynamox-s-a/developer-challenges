from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.series.models import TimeSeries
from app.series.schemas import TimeSeriesCreate
from app.clients.models import Client
from app.devices.models import Device
from fastapi import HTTPException
import statistics

def create_series(db: Session, payload: TimeSeriesCreate):
    device = db.query(Device).filter(Device.uid == payload.device_uid).first()
    if not device:
        return None
    values = [
        {
            "value": item.value,
            "timestamp": item.timestamp.isoformat(),
            "quality": item.quality,
            "unit": item.unit
        }
        for item in payload.values
    ]

    series = TimeSeries(
        device_uid=payload.device_uid,
        values=values
    )
    db.add(series)
    db.commit()
    db.refresh(series)
    return series

def delete_series(db: Session, series_id: int, deleted_by: str  = "system"):
    series = db.query(TimeSeries).filter(TimeSeries.id == series_id).first()
    if not series:
        return None
    series.is_active = False
    series.deleted_at = func.now()
    series.deleted_by = "system"
    db.commit()
    db.refresh(series)
    return series

def count_series_by_client(db: Session, client_id: int):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        return 0

    device_uids = (
        db.query(Device.uid)
        .filter(Device.client_id == client.id)
        .all()
    )
    device_uids = [uid[0] for uid in device_uids]

    if not device_uids:
        return 0

    count = (
        db.query(TimeSeries)
        .filter(TimeSeries.device_uid.in_(device_uids))
        .count()
    )

    return count

def get_metrics(values: list[float]):
    return {
        "mean": statistics.mean(values),
        "min": min(values),
        "max": max(values),
        "std": statistics.pstdev(values),
        "count": len(values)
    }

def get_series_by_client(db: Session, client_id: int):
    devices = db.query(Device).filter(Device.client_id == client_id).all()
    if not devices:
        return []

    uids = [d.uid for d in devices]

    series = db.query(TimeSeries).filter(TimeSeries.device_uid.in_(uids)).all()
    return series

def get_series(db: Session, series_id: int):
    return db.query(TimeSeries).filter(TimeSeries.id == series_id).first()

