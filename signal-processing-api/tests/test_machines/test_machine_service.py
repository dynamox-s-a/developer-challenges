from datetime import datetime, timedelta, timezone

import pytest
from fastapi import HTTPException
from uuid import uuid4

from app.enums.metric_type import MetricType
from app.enums.signal_type import SignalType
from app.models.machine import Machine
from app.models.metric import Metric
from app.models.signal import Signal
from app.services.machine_service import MachineService
from app.schemas.machine_schema import MachineCreate, MachineResponse

def test_create_machine_service(db_session):
    data = MachineCreate(name="Service Test", location="Lab")
    
    machine = MachineService.create_machine(data, db_session)
    
    assert machine.name == "Service Test"
    assert machine.location == "Lab"
    assert machine.id is not None

def test_get_machine_not_found(db_session):
    fake_id = uuid4()
    
    with pytest.raises(HTTPException) as exc:
        MachineService.get_machine_by_id(fake_id, db_session)
    
    assert exc.value.status_code == 404

def test_get_machine_by_id_success(db_session, create_machine):
    machine = create_machine(name="Test Machine", location="Test Location")
    
    found = MachineService.get_machine_by_id(machine.id, db_session)
    
    assert found.id == machine.id
    assert found.name == "Test Machine"
    assert found.location == "Test Location"

def test_get_machine_by_id_not_found(db_session):
    fake_id = uuid4()
    
    with pytest.raises(HTTPException) as exc:
        MachineService.get_machine_by_id(fake_id, db_session)
    
    assert exc.value.status_code == 404
    assert "Machine not found" in exc.value.detail

def test_list_machines_pagination(db_session, create_machine):
    for i in range(15):
        create_machine(name=f"Machine {i}", location=f"Location {i}")
    
    result = MachineService.list_machines(db_session, limit=10, offset=0)
    
    assert result["limit"] == 10
    assert result["offset"] == 0
    assert result["has_next"] == True
    assert len(result["data"]) == 10
    assert result["total"] == 15
    
    result = MachineService.list_machines(db_session, limit=10, offset=10)
    
    assert result["has_next"] == False
    assert len(result["data"]) == 5
    
    assert all(isinstance(item, MachineResponse) for item in result["data"])

def test_list_machines_empty(db_session):
    result = MachineService.list_machines(db_session, limit=10, offset=0)
    
    assert result["limit"] == 10
    assert result["offset"] == 0
    assert result["has_next"] == False
    assert len(result["data"]) == 0
    assert result["total"] == 0

def test_delete_machine_success(db_session, create_machine, create_signal, create_metric):
    machine = create_machine()
    
    signal = create_signal(machine_id=machine.id)
    metric = create_metric(signal_id=signal.id)
    
    result = MachineService.delete_machine(machine.id, db_session)
    
    assert result["message"] == "Machine deleted successfully"
    
    # Verifica se a máquina foi deletada
    assert db_session.query(Machine).filter(Machine.id == machine.id).first() is None
    # Verifica se os sinais foram deletados em cascata
    assert db_session.query(Signal).filter(Signal.id == signal.id).first() is None
    # Verifica se as métricas foram deletadas em cascata
    assert db_session.query(Metric).filter(Metric.id == metric.id).first() is None

def test_delete_machine_not_found(db_session):
    fake_id = uuid4()
    
    with pytest.raises(HTTPException) as exc:
        MachineService.delete_machine(fake_id, db_session)
    
    assert exc.value.status_code == 404

def test_count_machine_signals_success(db_session, create_machine, create_signal):
    machine = create_machine()
    
    for i in range(5):
        create_signal(machine_id=machine.id, value=float(i))
    
    result = MachineService.count_machine_signals(machine.id, db_session)
    
    assert result["machine_id"] == machine.id
    assert result["total_signals"] == 5

def test_get_machine_signals_success(db_session, create_machine, create_signal):
    machine = create_machine()
    
    base_time = datetime.now(timezone.utc)
    for i in range(15):
        signal_type = SignalType.VIBRATION if i % 2 == 0 else SignalType.TEMPERATURE
        create_signal(
            machine_id=machine.id,
            signal_type=signal_type,
            value=float(i),
            timestamp=base_time + timedelta(minutes=i)
        )
    
    result = MachineService.get_machine_signals(
        db_session, machine.id, limit=10, offset=0
    )
    
    assert result["limit"] == 10
    assert result["has_next"] == True
    assert len(result["data"]) == 10
    
    result = MachineService.get_machine_signals(
        db_session, machine.id, signal_type=SignalType.VIBRATION
    )
    
    assert all(s.signal_type == SignalType.VIBRATION for s in result["data"])
    
    mid_time = base_time + timedelta(minutes=7)
    result = MachineService.get_machine_signals(
        db_session, machine.id, start_time=base_time, end_time=mid_time
    )
    
    assert len(result["data"]) == 8 

def test_get_machine_signals_machine_not_found(db_session):
    fake_id = uuid4()
    
    with pytest.raises(HTTPException) as exc:
        MachineService.get_machine_signals(
            db_session, fake_id, limit=10, offset=0
        )
    
    assert exc.value.status_code == 404
    assert "Machine not found" in exc.value.detail

def test_list_metrics_success(db_session, create_machine, create_signal, create_metric):
    machine = create_machine()
    signal = create_signal(machine_id=machine.id)
    
    base_time = datetime.now(timezone.utc)
    for i in range(20):
        metric_type = MetricType.RMS if i % 2 == 0 else MetricType.PEAK
        create_metric(
            signal_id=signal.id,
            metric_type=metric_type,
            value=float(i),
            timestamp=base_time + timedelta(minutes=i)
        )
    
    result = MachineService.list_metrics(
        db_session, machine.id, 
        start_date=None, end_date=None,
        limit=10, offset=0, order="desc"
    )
    
    assert result["limit"] == 10
    assert result["has_next"] == True
    assert len(result["data"]) == 10
    
    result_asc = MachineService.list_metrics(
        db_session, machine.id,
        start_date=None, end_date=None,
        limit=20, offset=0, order="asc"
    )
    
    timestamps = [m.timestamp for m in result_asc["data"]]
    assert timestamps == sorted(timestamps)
    
    result_desc = MachineService.list_metrics(
        db_session, machine.id,
        start_date=None, end_date=None,
        limit=20, offset=0, order="desc"
    )
    
    timestamps_desc = [m.timestamp for m in result_desc["data"]]
    assert timestamps_desc == sorted(timestamps_desc, reverse=True)

def test_list_metrics_with_date_filters(db_session, create_machine, create_signal, create_metric):
    machine = create_machine()
    signal = create_signal(machine_id=machine.id)
    
    base_time = datetime.now(timezone.utc)
    for i in range(10):
        create_metric(
            signal_id=signal.id,
            value=float(i),
            timestamp=base_time + timedelta(days=i)
        )
    
    start = base_time
    end = base_time + timedelta(days=4)
    
    result = MachineService.list_metrics(
        db_session, machine.id,
        start_date=start, end_date=end,
        limit=50, offset=0, order="asc"
    )
    
    assert len(result["data"]) == 5 

def test_list_metrics_invalid_date_range(db_session, create_machine):
    machine = create_machine()
    
    start = datetime.now(timezone.utc)
    end = start - timedelta(days=1)
    
    with pytest.raises(HTTPException) as exc:
        MachineService.list_metrics(
            db_session, machine.id,
            start_date=start, end_date=end,
            limit=10, offset=0, order="desc"
        )
    
    assert exc.value.status_code == 400
    assert "start_date cannot be greater than end_date" in exc.value.detail