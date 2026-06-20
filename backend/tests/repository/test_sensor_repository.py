import pytest
from repository.sensor_repository import SensorRepository
from models.sensor import Sensor


class TestSensorRepository:
    """Unit tests for SensorRepository"""
    
    def test_create_sensor(self, db_session):
        """Tests sensor creation"""
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        assert sensor.id is not None
        assert sensor.name == "Sensor Teste"
    
    
    def test_get_sensors_empty(self, db_session):
        """Tests sensor search when none exist"""
        sensors = SensorRepository.get_sensors(db_session)
        
        assert sensors == []
    
    def test_get_sensors_with_data(self, db_session):
        """Tests sensor search when data exists"""
        SensorRepository.create(db_session, "Sensor 1")
        SensorRepository.create(db_session, "Sensor 2")
        
        sensors = SensorRepository.get_sensors(db_session)
        
        assert len(sensors) == 2
        assert sensors[0].name == "Sensor 1"
        assert sensors[1].name == "Sensor 2"
    
    def test_get_sensor_by_id(self, db_session):
        """Tests sensor search by ID"""
        created_sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        found_sensor = SensorRepository.get_sensor(db_session, created_sensor.id)
        
        assert found_sensor is not None
        assert found_sensor.id == created_sensor.id
        assert found_sensor.name == "Sensor Teste"
    
    def test_get_sensor_not_found(self, db_session):
        """Tests sensor search when not found"""
        sensor = SensorRepository.get_sensor(db_session, 999)
        
        assert sensor is None
    
    def test_delete_sensor(self, db_session):
        """Tests sensor deletion"""
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        result = SensorRepository.delete_sensor(db_session, sensor.id)
        
        assert result == {"message": "Sensor deleted successfully"}
        
        deleted_sensor = SensorRepository.get_sensor(db_session, sensor.id)
        assert deleted_sensor is None
