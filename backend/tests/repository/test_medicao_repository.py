import pytest
from datetime import datetime
from repository.medicao_repository import MedicaoRepository
from repository.sensor_repository import SensorRepository
from models.medicao import Medicao


class TestMedicaoRepository:
    """Unit tests for MedicaoRepository"""
    
    def test_create_medicao(self, db_session):
        """Tests measurement creation"""
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        medicao = MedicaoRepository.create(
            db_session,
            sensor_id=sensor.id,
            name="temperatura",
            value=25.5
        )
        
        assert medicao.id is not None
        assert medicao.sensor_id == sensor.id
        assert medicao.name == "temperatura"
        assert medicao.value == 25.5
        assert medicao.timestamp is not None
    
    
    def test_get_medicoes_empty(self, db_session):
        """Tests measurement search when none exist"""
        medicoes = MedicaoRepository.get_medicoes(db_session)
        
        assert medicoes == []
    
    def test_get_medicoes_with_data(self, db_session):
        """Tests measurement search when data exists"""
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        MedicaoRepository.create(db_session, sensor.id, "temp", 25.5)
        MedicaoRepository.create(db_session, sensor.id, "temp", 30.2)
        
        medicoes = MedicaoRepository.get_medicoes(db_session)
        
        assert len(medicoes) == 2
    
    def test_get_medicao_by_id(self, db_session):
        """Tests measurement search by ID"""
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        created_medicao = MedicaoRepository.create(
            db_session,
            sensor.id,
            "temperatura",
            25.5
        )
        
        found_medicao = MedicaoRepository.get_medicao(db_session, created_medicao.id)
        
        assert found_medicao is not None
        assert found_medicao.id == created_medicao.id
        assert found_medicao.value == 25.5
    
    def test_get_medicao_not_found(self, db_session):
        """Tests measurement search when not found"""
        medicao = MedicaoRepository.get_medicao(db_session, 999)
        
        assert medicao is None
    
    def test_delete_medicao(self, db_session):
        """Tests measurement deletion"""
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        medicao = MedicaoRepository.create(
            db_session,
            sensor.id,
            "temperatura",
            25.5
        )
        
        result = MedicaoRepository.delete_medicao(db_session, medicao.id)
        
        assert result is not None
        
        deleted_medicao = MedicaoRepository.get_medicao(db_session, medicao.id)
        assert deleted_medicao is None
    
    def test_delete_medicao_not_found(self, db_session):
        """Tests deletion of non-existent measurement"""
        result = MedicaoRepository.delete_medicao(db_session, 999)
        
        assert result is None
    
    def test_get_by_sensor(self, db_session):
        """Tests measurement search by sensor"""
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        MedicaoRepository.create(db_session, sensor.id, "temp", 25.5)
        MedicaoRepository.create(db_session, sensor.id, "temp", 30.2)
        MedicaoRepository.create(db_session, sensor.id, "temp", 28.7)
        
        medicoes = MedicaoRepository.get_by_sensor(db_session, sensor.id)
        
        assert len(medicoes) == 3
        assert all(m.sensor_id == sensor.id for m in medicoes)
    
    def test_get_by_sensor_empty(self, db_session):
        """Tests measurement search by sensor when none exist"""
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        medicoes = MedicaoRepository.get_by_sensor(db_session, sensor.id)
        
        assert medicoes == []
