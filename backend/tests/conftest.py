import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import get_db
from models.base import Base
from models.sensor import Sensor
from models.medicao import Medicao

TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """
    Fixture that creates an in-memory database session for each test.
    """
    Base.metadata.create_all(bind=engine)
    
    session = TestingSessionLocal()
    
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_sensor(db_session):
    """
    Fixture that creates a sample sensor.
    """
    sensor = Sensor(name="Sensor Teste")
    db_session.add(sensor)
    db_session.commit()
    db_session.refresh(sensor)
    return sensor


@pytest.fixture
def sample_medicoes(db_session, sample_sensor):
    """
    Fixture that creates sample measurements.
    """
    from datetime import datetime
    
    medicao1 = Medicao(
        sensor_id=sample_sensor.id,
        name="temperatura",
        value=25.5,
        timestamp=datetime.now()
    )
    medicao2 = Medicao(
        sensor_id=sample_sensor.id,
        name="temperatura",
        value=30.2,
        timestamp=datetime.now()
    )
    medicao3 = Medicao(
        sensor_id=sample_sensor.id,
        name="temperatura",
        value=28.7,
        timestamp=datetime.now()
    )
    
    db_session.add_all([medicao1, medicao2, medicao3])
    db_session.commit()
    
    return [medicao1, medicao2, medicao3]
