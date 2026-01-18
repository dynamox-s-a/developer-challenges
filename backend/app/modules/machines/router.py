from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from app.core.database import get_session
from app.core.security import get_current_user
from app.models import Machine, User
from .schemas import MachineCreate, MachineRead

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