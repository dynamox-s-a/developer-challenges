# tests/conftest.py - COM DEBUG
import pytest
import os
import tempfile

os.environ["TESTING"] = "true"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.security import hash_password
from app.core.database import Base, get_db
from app.users.models import User
from app.clients.models import Client
from app.devices.models import Device
from app.series.models import TimeSeries
from app.devices.sensor_enum import SensorTypeEnum
from main import app


@pytest.fixture(scope="function")
def engine():
    """Cria engine com arquivo temporário ÚNICO por teste"""
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    
    print(f"\n=== CRIANDO ENGINE: {db_path} ===")
    
    test_engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False},
        echo=False
    )
    
    Base.metadata.create_all(bind=test_engine)
    
    yield test_engine
    
    print(f"=== DESTRUINDO ENGINE: {db_path} ===\n")
    test_engine.dispose()
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture(scope="function")
def db(engine):
    """Sessão de banco isolada"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    print(f"=== CRIANDO SESSÃO: {id(session)} ===")
    
    try:
        yield session
    finally:
        print(f"=== FECHANDO SESSÃO: {id(session)} ===")
        session.rollback()
        session.close()

@pytest.fixture(scope="function")
def client(db, engine):
    """Cliente de teste do FastAPI"""
    app.dependency_overrides.clear()
    
    def override_get_db():
        print(f"=== GET_DB OVERRIDE CHAMADO - Sessão: {id(db)} ===")
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db):
    """Cria um usuário de teste"""
    password = "testpassword123"
    hashed = hash_password(password)
    
    user = User(
        name="Test User",
        email="test@example.com",
        hashed_password=hashed
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    print(f"=== USER CRIADO: ID={user.id}, Email={user.email} ===")
    return user

@pytest.fixture
def auth_token(client, test_user):
    """Obtém token de autenticação"""
    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    
    assert response.status_code == 200
    return response.json()["access_token"]

@pytest.fixture
def authenticated_client(client, auth_token):
    """Cliente autenticado"""
    client.headers = {"Authorization": f"Bearer {auth_token}"}
    return client

@pytest.fixture
def test_client(db):
    """Cria um cliente de teste"""
    client = Client(
        name="Test client",
        email="client@example.com",
        document="12345678000190"
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    
    print(f"=== TEST_CLIENT CRIADO: ID={client.id}, Name={client.name} ===")
    
    all_clients = db.query(Client).all()
    print(f"=== TOTAL CLIENTS NO BANCO: {len(all_clients)} ===")
    for c in all_clients:
        print(f"    - ID={c.id}, Name={c.name}")
    
    return client

@pytest.fixture
def test_device(db, test_client):
    """Cria um dispositivo de teste"""
    device = Device(
        uid="test-device-uid-123",
        name="Test Device",
        sensor_type=SensorTypeEnum.TCAG,
        client_id=test_client.id,
        sensor_capabilities={
            "sobreaquecimento": True,
            "vibracao_anormal": True
        }
    )
    db.add(device)
    db.commit()
    db.refresh(device)
    return device

@pytest.fixture
def test_series(db, test_device):
    """Cria uma série temporal de teste"""
    series = TimeSeries(
        device_uid=test_device.uid,
        values=[
            {
                "value": 1.5,
                "timestamp": "2025-11-18T10:30:00",
                "quality": "good",
                "unit": "g-force"
            },
            {
                "value": 2.0,
                "timestamp": "2025-11-18T10:31:00",
                "quality": "good",
                "unit": "g-force"
            },
            {
                "value": 2.3,
                "timestamp": "2025-11-18T10:32:00",
                "quality": "good",
                "unit": "g-force"
            }
        ],
        id=1

    )
    print("==================================== seeerrries ======================", series)
    db.add(series)
    db.commit()
    db.refresh(series)
    return series