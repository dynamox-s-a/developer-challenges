import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base
from app.core.dependencies import get_db
from app.models.machine import Machine
from app.models.signal import Signal
from app.models.metric import Metric
from app.enums.signal_type import SignalType
from app.enums.metric_type import MetricType
from datetime import datetime, timezone
from uuid import uuid4

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db_session):
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def create_machine(db_session):
    def _create_machine(name="Máquina Teste", location="Local Teste"):
        machine = Machine(
            id=uuid4(),
            name=name,
            location=location,
            created_at=datetime.now(timezone.utc)
        )
        db_session.add(machine)
        db_session.commit()
        db_session.refresh(machine)
        return machine
    return _create_machine

@pytest.fixture
def create_signal(db_session, create_machine):
    def _create_signal(
            machine_id=None, 
            signal_type=SignalType.VIBRATION, 
            value=10.5,
            timestamp=None
        ):
        if not machine_id:
            machine = create_machine()
            machine_id = machine.id

        if not timestamp:
            timestamp = datetime.now(timezone.utc)
        
        signal = Signal(
            id=uuid4(),
            machine_id=machine_id,
            signal_type=signal_type,
            value=value,
            timestamp=timestamp,
            created_at=datetime.now(timezone.utc)
        )
        db_session.add(signal)
        db_session.commit()
        db_session.refresh(signal)
        return signal
    return _create_signal

@pytest.fixture
def create_metric(db_session, create_signal):
    def _create_metric(
        signal_id=None, 
        metric_type=MetricType.RMS, 
        value=5.2,
        timestamp=None
    ):
        if not signal_id:
            signal = create_signal()
            signal_id = signal.id

        if not timestamp:
            timestamp = datetime.now(timezone.utc)
        
        metric = Metric(
            id=uuid4(),
            signal_id=signal_id,
            metric_type=metric_type,
            value=value,
            timestamp=timestamp,
            created_at=datetime.now(timezone.utc)
        )
        db_session.add(metric)
        db_session.commit()
        db_session.refresh(metric)
        return metric
    return _create_metric