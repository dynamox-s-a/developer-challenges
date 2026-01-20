from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session
from app.core.database import get_session
from app.core.security import get_current_user
from app.models import Machine, User, MonitoringPoint, SensorModel, Sensor
from .schemas import SensorRead, SensorCreate
from sqlmodel import Session, select

router = APIRouter()

@router.post("/", response_model=SensorRead, status_code=status.HTTP_201_CREATED)
def associate_sensor(
    sensor_in: SensorCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    
    query = session.exec((
        select(MonitoringPoint)
        .join(Machine)
        .where(
            MonitoringPoint.id == sensor_in.monitoring_point_id,
            Machine.user_id == current_user.id
        ))
    ).first()

    if not query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ponto de monitoramento nao encontrado.")

    if query.sensor:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Esse ponto ja possui um sensor.")

    machine = query.machine
    if machine.type == "Pump" and sensor_in.model in [SensorModel.TCAG, SensorModel.TCAS]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Bombas nao aceitam sensores do tipo {sensor_in.model}")

    new_sensor = Sensor(
        id = sensor_in.id,
        model=sensor_in.model,
        monitoring_point_id=sensor_in.monitoring_point_id
    )

    session.add(new_sensor)
    session.commit()
    session.refresh(new_sensor)
    return new_sensor

