import pytest
from fastapi import HTTPException
from service.sensor_service import SensorService


class TestSensorService:
    """Unit tests for SensorService"""
    
    def test_create_sensor_success(self, db_session):
        """Tests successful sensor creation"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        assert sensor.id is not None
        assert sensor.name == "Sensor Teste"
    
    def test_create_sensor_empty_name(self, db_session):
        """Tests sensor creation with empty name"""
        with pytest.raises(HTTPException) as exc_info:
            SensorService.create_sensor(db_session, "")
        
        assert exc_info.value.status_code == 400
        assert "Sensor name cannot be empty" in exc_info.value.detail
    
    def test_create_sensor_whitespace_only(self, db_session):
        """Tests sensor creation with whitespace only"""
        with pytest.raises(HTTPException) as exc_info:
            SensorService.create_sensor(db_session, "   ")
        
        assert exc_info.value.status_code == 400
        assert "Sensor name cannot be empty" in exc_info.value.detail
    
    def test_create_sensor_trims_whitespace(self, db_session):
        """Tests sensor creation trims whitespace"""
        sensor = SensorService.create_sensor(db_session, "  Sensor Teste  ")
        
        assert sensor.name == "Sensor Teste"
    
    def test_get_sensors_empty(self, db_session):
        """Tests sensor search when none exist"""
        sensors = SensorService.get_sensors(db_session)
        
        assert sensors == []
    
    def test_get_sensors_with_data(self, db_session):
        """Tests sensor search when data exists"""
        SensorService.create_sensor(db_session, "Sensor 1")
        SensorService.create_sensor(db_session, "Sensor 2")
        
        sensors = SensorService.get_sensors(db_session)
        
        assert len(sensors) == 2
    
    def test_get_sensor_by_id(self, db_session):
        """Tests sensor search by ID"""
        created_sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        found_sensor = SensorService.get_sensor(db_session, created_sensor.id)
        
        assert found_sensor is not None
        assert found_sensor.id == created_sensor.id
        assert found_sensor.name == "Sensor Teste"
    
    def test_get_sensor_not_found(self, db_session):
        """Tests sensor search when not found"""
        sensor = SensorService.get_sensor(db_session, 999)
        
        assert sensor is None
    
    def test_delete_sensor(self, db_session):
        """Tests sensor deletion"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        result = SensorService.delete_sensor(db_session, sensor.id)
        
        assert result == {"message": "Sensor deleted successfully"}
        
        deleted_sensor = SensorService.get_sensor(db_session, sensor.id)
        assert deleted_sensor is None
