from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from dependencies import get_session, verify_token
from models.sensor import Sensor
from schemas import MonitoringPointCreateSchema, SensorAssignSchema
from models.monitoring_point import MonitoringPoint
from models.machine import Machine
from models.user import User
import math
from sqlalchemy.orm import joinedload
from schemas import MonitoringPointOut


monitoring_point_router = APIRouter(
    prefix="/monitoring-point",
    tags=["monitoring-point"],
)


@monitoring_point_router.post("", status_code=status.HTTP_201_CREATED)
async def create_monitoring_point(
    payload: MonitoringPointCreateSchema,
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Cria um ponto de monitoramento para uma máquina existente do usuário autenticado.
    """
    # Verifica se a máquina existe e pertence ao usuário
    machine = session.query(Machine).filter(
        Machine.id == payload.machine_id,
        Machine.user_id == current_user.id,
    ).first()

    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Máquina não encontrada.",
        )

    mp = MonitoringPoint(
        name=payload.name, machine_id=payload.machine_id, user_id=current_user.id)
    session.add(mp)
    session.commit()
    session.refresh(mp)

    return {"id": mp.id, "name": mp.name, "machine_id": mp.machine_id}


@monitoring_point_router.get("", status_code=status.HTTP_200_OK)
async def list_monitoring_points(
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Lista todos os pontos de monitoramento do usuário autenticado
    """
    monitoring_points = (
        session.query(MonitoringPoint)
        .options(joinedload(MonitoringPoint.sensor), joinedload(MonitoringPoint.machine))
        .filter(MonitoringPoint.user_id == current_user.id)
        .order_by(MonitoringPoint.id)
        .all()
    )

    mapped = []
    for mp in monitoring_points:
        machine = mp.machine
        sensor = mp.sensor
        mapped.append({
            "machine_name": machine.name if machine else None,
            "monitoring_point_id": mp.id,
            "machine_type": machine.type if machine else None,
            "monitoring_point_name": mp.name,
            "sensor_id": sensor.id if sensor else None,
            "sensor_model": sensor.model if sensor else None,
        })

    return mapped


@monitoring_point_router.post("/assign", status_code=status.HTTP_200_OK)
async def assign_sensor(
    payload: SensorAssignSchema,
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Associa um sensor existente a um ponto de monitoramento.
    """
    print(payload)
    # Verifica se o sensor existe e pertence ao usuário
    sensor = session.query(Sensor).filter(
        Sensor.id == payload.sensor_id, Sensor.user_id == current_user.id
    ).first()

    if not sensor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Sensor não encontrado ou acesso negado")

    mp = session.query(MonitoringPoint).filter(
        MonitoringPoint.id == payload.monitoring_point_id,
        MonitoringPoint.user_id == current_user.id,
    ).first()

    if not mp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Ponto de monitoramento não encontrado ou acesso negado")

    # Verifica se o ponto já tem sensor associado
    if mp.sensor is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Ponto de monitoramento já possui um sensor associado")

    # Regra: impedir sensores TcAg/TcAs em máquinas do tipo Pump
    machine = session.query(Machine).filter(
        Machine.id == mp.machine_id).first()
    if machine and machine.type == "Pump" and sensor.model in ["TcAg", "TcAs"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Não é permitido associar sensores TcAg/TcAs a máquinas do tipo Pump")

    # Associa e persiste
    mp.sensor = sensor
    session.add(mp)
    session.commit()
    session.refresh(mp)

    return {"message": "Sensor associado com sucesso.", "monitoring_point_id": mp.id, "sensor_id": sensor.id}

# delete sensor from monitoring point
    #   await api.delete(`/monitoring-point/${pointId}/sensor`);


@monitoring_point_router.delete("/{monitoring_point_id}/sensor", status_code=status.HTTP_200_OK)
async def remove_sensor_from_monitoring_point(
    monitoring_point_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Remove o sensor associado a um ponto de monitoramento.
    """
    mp = session.query(MonitoringPoint).filter(
        MonitoringPoint.id == monitoring_point_id,
        MonitoringPoint.user_id == current_user.id,
    ).first()

    if not mp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Ponto de monitoramento não encontrado ou acesso negado")

    if mp.sensor is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Nenhum sensor está associado a este ponto de monitoramento")

    # Remove a associação do sensor
    mp.sensor = None
    session.add(mp)
    session.commit()
    session.refresh(mp)

    return {"message": "Sensor removido com sucesso."}


@monitoring_point_router.delete("/{monitoring_point_id}", status_code=status.HTTP_200_OK)
async def delete_monitoring_point(
    monitoring_point_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Deleta um ponto de monitoramento.
    """
    mp = session.query(MonitoringPoint).filter(
        MonitoringPoint.id == monitoring_point_id,
        MonitoringPoint.user_id == current_user.id,
    ).first()

    if not mp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Ponto de monitoramento não encontrado ou acesso negado")

    session.delete(mp)
    session.commit()

    return {"message": "Ponto de monitoramento deletado com sucesso."}
