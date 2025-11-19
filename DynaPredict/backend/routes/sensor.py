from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from dependencies import get_session, verify_token
from models.sensor import Sensor
from models.user import User
from schemas import SensorCreateSchema

sensor_router = APIRouter(prefix="/sensor", tags=["sensor"])


ALLOWED_MODELS = ["TcAg", "TcAs", "HF+"]


@sensor_router.post("", status_code=201)
async def create_sensor(payload: SensorCreateSchema, session: Session = Depends(get_session), current_user: User = Depends(verify_token)):
    """Cria um novo sensor associado ao usuário autenticado.

    Espera um JSON no formato: { "model": "TC_AGM" }
    """
    model = payload.model
    if model not in ALLOWED_MODELS:
        raise HTTPException(
            status_code=400, detail=f"Modelo inválido. Modelos permitidos: {ALLOWED_MODELS}")

    sensor = Sensor(model=model, user_id=current_user.id)
    session.add(sensor)
    session.commit()
    session.refresh(sensor)

    return {"message": "Sensor criado com sucesso.", "id": sensor.id}


@sensor_router.get("", status_code=200)
async def list_sensors(session: Session = Depends(get_session), current_user: User = Depends(verify_token)):
    """Lista todos os sensores associados ao usuário autenticado
    """
    sensors = session.query(Sensor).filter(
        Sensor.user_id == current_user.id).all()
    return sensors


@sensor_router.delete("/{sensor_id}", status_code=200)
async def delete_sensor(
    sensor_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Deleta um sensor quando ele não estiver mais em uso por pontos de monitoramento
    """
    sensor = session.query(Sensor).filter(
        Sensor.id == sensor_id, Sensor.user_id == current_user.id).first()

    if not sensor:
        return {"error": "Sensor não encontrado ou acesso negado."}

    if sensor.monitoring_point is not None:
        return {"error": "Não é possível deletar o sensor pois ele está associado a um ponto de monitoramento."}

    session.delete(sensor)
    session.commit()

    return {"message": "Sensor deletado com sucesso."}
