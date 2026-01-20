from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlmodel import Session, select, func, asc, desc
from app.core.database import get_session
from app.core.security import get_current_user
from app.models import MonitoringPoint, User, Machine, Sensor
from .schemas import MonitoringPointCreate, PageList, MonitoringPointRead
from typing import List
from sqlmodel import Session, select

router = APIRouter()

@router.post("/machines/{machine_id}/monitoring-points", response_model=MonitoringPointRead, status_code=status.HTTP_201_CREATED)
def create_machine(
    monitoring_point_in: MonitoringPointCreate,
    machine_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    machine = session.exec(select(Machine).where(Machine.id == machine_id, Machine.user_id == current_user.id)).first()

    if not machine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Maquina nao encontrada.")
    
    if len(machine.monitoring_points) >= 2:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Limite de 2 pontos de monitoramento atingidos.")

    new_monitoring_point = MonitoringPoint(
        name=monitoring_point_in.name,
        machine_id=machine_id,
    )

    session.add(new_monitoring_point)
    session.commit()
    session.refresh(new_monitoring_point)
    return new_monitoring_point


@router.get("/monitoring-points", response_model=PageList, status_code=status.HTTP_200_OK)
def list_monitoring_points(
    page: int = Query(1, ge=1),
    size: int = Query(5, ge=1),
    sort_by: str = Query("point_name"),
    order: str = Query("asc"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    
    sort_options = {
        "point_id": MonitoringPoint.id,
        "machine_name": Machine.name,
        "machine_type": Machine.type,
        "point_name": MonitoringPoint.name,
        "sensor_model": Sensor.model
    }

    column = sort_options.get(sort_by, MonitoringPoint.name)
    order_func = desc if order == "desc" else asc

    query = (
        select(
            MonitoringPoint.id.label("point_id"),
            Machine.name.label("machine_name"),
            Machine.type.label("machine_type"),
            MonitoringPoint.name.label("point_name"),
            Sensor.model.label("sensor_model")
        )
        .join(Machine, MonitoringPoint.machine_id == Machine.id)
        .outerjoin(Sensor, Sensor.monitoring_point_id == MonitoringPoint.id)
        .where(Machine.user_id == current_user.id)
        .order_by(order_func(column))
    )

    offset = (page - 1) * size
    results = session.exec(query.offset(offset).limit(size)).all()
    total_pages = session.exec(select(func.count(MonitoringPoint.id))
                                      .join(Machine, MonitoringPoint.machine_id == Machine.id)
                                      .where(Machine.user_id == current_user.id)).one()

    return {
        "items": results,
        "total": total_pages,
        "page": page,
        "size": size
    }
