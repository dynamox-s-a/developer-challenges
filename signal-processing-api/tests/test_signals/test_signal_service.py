import pytest
from fastapi import HTTPException
from uuid import uuid4
from datetime import datetime, timezone

from app.services.signal_service import SignalService
from app.schemas.signal_schema import SignalCreate
from app.enums.signal_type import SignalType

def test_create_signal_machine_not_found(db_session):
    fake_id = uuid4()
    signal_data = SignalCreate(
        signal_type=SignalType.VIBRATION,
        value=10.5,
        timestamp=datetime.now(timezone.utc)
    )
    
    with pytest.raises(HTTPException) as exc:
        SignalService.create_signal(fake_id, signal_data, db_session)
    
    assert exc.value.status_code == 404
    assert "Machine not found" in exc.value.detail

def test_get_signal_by_id_not_found(db_session):
    fake_id = uuid4()
    
    with pytest.raises(HTTPException) as exc:
        SignalService.get_signal_by_id(fake_id, db_session)
    
    assert exc.value.status_code == 404
    assert "Signal not found" in exc.value.detail

def test_delete_signal_not_found(db_session):
    fake_id = uuid4()
    
    with pytest.raises(HTTPException) as exc:
        SignalService.delete_signal(fake_id, db_session)
    
    assert exc.value.status_code == 404
    assert "Signal not found" in exc.value.detail

def test_list_signals_by_machine_success(db_session, create_machine, create_signal):
    machine = create_machine()
    
    for i in range(15):
        create_signal(machine_id=machine.id, value=float(i))
    
    result = SignalService.list_signals_by_machine(db_session, machine.id, limit=10, offset=0)
    
    assert result["limit"] == 10
    assert result["offset"] == 0
    assert result["has_next"] == True
    assert len(result["data"]) == 10
    
    result = SignalService.list_signals_by_machine(db_session, machine.id, limit=10, offset=10)
    
    assert result["has_next"] == False
    assert len(result["data"]) == 5