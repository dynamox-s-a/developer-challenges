import pytest
from fastapi import HTTPException
from uuid import uuid4
from datetime import datetime, timedelta, timezone

from app.enums.signal_type import SignalType
from app.services.metric_service import MetricService
from app.schemas.metric_schema import MetricsCreate
from app.models.metric import Metric
from app.enums.metric_type import MetricType

def test_create_metric_signal_not_found(db_session):
    fake_id = uuid4()
    metric_data = MetricsCreate(
        metric_type=MetricType.RMS,
        value=3.14,
        timestamp=datetime.now(timezone.utc)
    )
    
    with pytest.raises(HTTPException) as exc:
        MetricService.create_metric(db_session, fake_id, metric_data)
    
    assert exc.value.status_code == 404
    assert "Signal not found" in exc.value.detail

def test_list_metrics_by_signal_success(db_session, create_signal, create_metric):
    signal = create_signal()
    
    base_time = datetime.now(timezone.utc)
    for i in range(15):
        metric_type = MetricType.RMS if i % 2 == 0 else MetricType.PEAK
        create_metric(
            signal_id=signal.id,
            metric_type=metric_type,
            value=float(i),
            timestamp=base_time + timedelta(minutes=i)
        )
    
    result = MetricService.list_metrics_by_signal(
        db_session, signal.id, limit=10, offset=0
    )
    
    assert result["limit"] == 10
    assert result["has_next"] == True
    assert len(result["data"]) == 10
    
    result = MetricService.list_metrics_by_signal(
        db_session, signal.id, metric_type=MetricType.RMS
    )
    
    assert all(m.metric_type == MetricType.RMS for m in result["data"])
    
    mid_time = base_time + timedelta(minutes=7)
    result = MetricService.list_metrics_by_signal(
        db_session, signal.id, start_date=base_time, end_date=mid_time
    )
    
    assert len(result["data"]) == 8 

def test_list_metrics_by_signal_success(db_session, create_signal, create_metric):
    signal = create_signal()
    
    base_time = datetime.now(timezone.utc)
    for i in range(15):
        metric_type = MetricType.RMS if i % 2 == 0 else MetricType.PEAK
        create_metric(
            signal_id=signal.id,
            metric_type=metric_type,
            value=float(i),
            timestamp=base_time + timedelta(minutes=i)
        )
    
    result = MetricService.list_metrics_by_signal(
        db_session, signal.id, limit=10, offset=0
    )
    
    assert result["limit"] == 10
    assert result["has_next"] == True
    assert len(result["data"]) == 10
    
    result = MetricService.list_metrics_by_signal(
        db_session, signal.id, metric_type=MetricType.RMS
    )
    
    assert all(m.metric_type == MetricType.RMS for m in result["data"])
    
    mid_time = base_time + timedelta(minutes=7)
    result = MetricService.list_metrics_by_signal(
        db_session, signal.id, start_date=base_time, end_date=mid_time
    )
    
    assert len(result["data"]) == 8 

def test_list_metrics_by_machine_success(db_session, create_machine, create_signal, create_metric):
    machine = create_machine()
    
    signal1 = create_signal(machine_id=machine.id)
    signal2 = create_signal(machine_id=machine.id, signal_type=SignalType.TEMPERATURE)
    
    for i in range(5):
        create_metric(signal_id=signal1.id, value=float(i))
        create_metric(signal_id=signal2.id, value=float(i) * 2)
    
    result = MetricService.list_metrics_by_machine(db_session, machine.id)
    
    assert result["total"] == 10
    assert len(result["data"]) == 10
    
    result = MetricService.list_metrics_by_machine(
        db_session, machine.id, signal_type=SignalType.TEMPERATURE
    )
    
    assert result["total"] == 5

def test_list_metrics_by_machine_not_found(db_session):
    fake_id = uuid4()
    
    with pytest.raises(HTTPException) as exc:
        MetricService.list_metrics_by_machine(db_session, fake_id)
    
    assert exc.value.status_code == 404
