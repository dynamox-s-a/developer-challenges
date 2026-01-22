from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session
from app.core.database import get_session
from app.core.security import get_current_user
from app.models import Machine, User, MonitoringPoint
from .schemas import MachineCreate, MachineRead, MachineUpdate
from typing import List
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.post("/", response_model=MachineRead, status_code=status.HTTP_201_CREATED)
def create_machine(
    machine_in: MachineCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    
    new_machine = Machine(
        name=machine_in.name,
        type=machine_in.type,
        user_id=current_user.id
    )

    session.add(new_machine)
    session.commit()
    session.refresh(new_machine)
    return new_machine


@router.get("/", response_model=List[MachineRead], status_code=status.HTTP_200_OK)
def list_machines(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    
    list_machines = session.exec(select(Machine).where(Machine.user_id == current_user.id).options(selectinload(Machine.monitoring_points).selectinload(MonitoringPoint.sensor)))
    return list_machines


@router.get("/{machine_id}", response_model=MachineRead, status_code=status.HTTP_200_OK)
def get_machines(
    machine_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    
    machine = session.exec(select(Machine).where(Machine.id == machine_id, Machine.user_id == current_user.id).options(selectinload(Machine.monitoring_points).selectinload(MonitoringPoint.sensor))).first()

    if machine is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Maquina nao encontrada")
    
    return machine


@router.put("/{machine_id}", response_model=MachineRead, status_code=status.HTTP_200_OK)
def update_machine(
    machine_id: int,
    machine_update: MachineUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    
    machine = session.exec(select(Machine).where(Machine.id == machine_id, Machine.user_id == current_user.id)).first()

    if machine is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Maquina nao encontrada")

    update_data = machine_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(machine, key, value)

    session.add(machine)
    session.commit()
    session.refresh(machine)

    return machine


@router.delete("/{machine_id}")
def delete_machine(
    machine_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    machine = session.exec(select(Machine).where(Machine.id == machine_id, Machine.user_id == current_user.id)).first()

    if machine is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Maquina nao encontrada")

    session.delete(machine)
    session.commit()
    
    return {"message": f"Maquina com id {machine_id} deletada com sucesso"}