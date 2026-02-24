from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import engine
from app.core.dependencies import get_db
from app.models.machine import Machine
from app.schemas.machine_schema import MachineCreate, MachineResponse

router = APIRouter(prefix="/machines", tags=["Machines"])

@router.post("/", response_model=MachineResponse)
def create_machine(machine: MachineCreate, db: Session = Depends(get_db)):
    db_machine = Machine(
        name=machine.name, 
        location=machine.location
    )

    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    
    return db_machine