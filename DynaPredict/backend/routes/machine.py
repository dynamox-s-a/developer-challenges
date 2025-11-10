from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from dependencies import verify_token, get_session
from schemas import MachineCreateSchema
from models.machine import Machine
from models.user import User


machine_router = APIRouter(
    prefix="/machine",
    tags=["machine"]
)

ALLOWED_TYPES = ["Pump", "Fan"]


@machine_router.post("", status_code=status.HTTP_201_CREATED)
async def create_machine(
    payload: MachineCreateSchema,
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Cria uma nova máquina associada ao usuário autenticado
    """

    if payload.type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo inválido. Tipos permitidos: {ALLOWED_TYPES}",
        )

    machine = Machine(name=payload.name, type=payload.type,
                      user_id=current_user.id)
    session.add(machine)
    session.commit()
    session.refresh(machine)

    return {"message": "Máquina criada com sucesso."}


@machine_router.get("", status_code=status.HTTP_200_OK)
async def list_machines(
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Lista todas as máquinas associadas ao usuário autenticado
    """
    machines = session.query(Machine).filter(
        Machine.user_id == current_user.id).all()
    return machines


@machine_router.delete("/{machine_id}", status_code=status.HTTP_200_OK)
async def delete_machine(
    machine_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Deleta uma máquina quando ela não estiver mais em uso por pontos de monitoramento
    """
    machine = session.query(Machine).filter(
        Machine.id == machine_id,
        Machine.user_id == current_user.id
    ).first()

    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Máquina não encontrada."
        )

    if machine.monitoring_points:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível deletar a máquina enquanto houver pontos de monitoramento associados."
        )

    session.delete(machine)
    session.commit()

    return {"message": "Máquina deletada com sucesso."}


@machine_router.get("/{machine_id}", status_code=status.HTTP_200_OK)
async def get_machine(
    machine_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Obtém os detalhes de uma máquina específica associada ao usuário autenticado
    """
    machine = session.query(Machine).filter(
        Machine.id == machine_id,
        Machine.user_id == current_user.id
    ).first()

    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Máquina não encontrada."
        )

    return machine


@machine_router.put("/{machine_id}", status_code=status.HTTP_200_OK)
async def update_machine(
    machine_id: int,
    payload: MachineCreateSchema,
    session: Session = Depends(get_session),
    current_user: User = Depends(verify_token),
):
    """Atualiza os detalhes de uma máquina específica associada ao usuário autenticado
    """

    if payload.type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo inválido. Tipos permitidos: {ALLOWED_TYPES}",
        )

    machine = session.query(Machine).filter(
        Machine.id == machine_id,
        Machine.user_id == current_user.id
    ).first()

    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Máquina não encontrada."
        )

    machine.name = payload.name
    machine.type = payload.type

    session.commit()
    session.refresh(machine)

    return {"message": "Máquina atualizada com sucesso."}
