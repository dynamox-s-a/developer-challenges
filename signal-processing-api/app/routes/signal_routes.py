from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.models.signal import Signal
from app.schemas.signal_schema import SignalCreate, SignalResponse

router = APIRouter(prefix="/signals", tags=["Signals"])

@router.post("/", response_model=SignalResponse)
def create_signal(signal: SignalCreate, db: Session = Depends(get_db)):
    db_signal = Signal(
        machine_id=signal.machine_id,
        timestamp=signal.timestamp,
        value=signal.value
    )

    db.add(db_signal)
    db.commit()
    db.refresh(db_signal)
    
    return db_signal