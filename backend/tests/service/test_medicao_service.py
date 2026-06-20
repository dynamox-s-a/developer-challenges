import pytest
from fastapi import HTTPException
from service.medicao_service import MedicaoService
from service.sensor_service import SensorService


class TestMedicaoService:
    """Unit tests for MedicaoService"""
    
    def test_create_medicao_success(self, db_session):
        """Tests successful measurement creation"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        medicao = MedicaoService.create_medicao(
            db_session,
            sensor_id=sensor.id,
            name="temperatura",
            value=25.5
        )
        
        assert medicao.id is not None
        assert medicao.sensor_id == sensor.id
        assert medicao.name == "temperatura"
        assert medicao.value == 25.5
    
    def test_create_medicao_empty_name(self, db_session):
        """Tests measurement creation with empty name"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        with pytest.raises(HTTPException) as exc_info:
            MedicaoService.create_medicao(
                db_session,
                sensor_id=sensor.id,
                name="",
                value=25.5
            )
        
        assert exc_info.value.status_code == 400
        assert "Measurement name cannot be empty" in exc_info.value.detail
    
    def test_create_medicao_sensor_not_found(self, db_session):
        """Tests measurement creation with non-existent sensor"""
        with pytest.raises(HTTPException) as exc_info:
            MedicaoService.create_medicao(
                db_session,
                sensor_id=999,
                name="temperatura",
                value=25.5
            )
        
        assert exc_info.value.status_code == 404
        assert "Sensor not found" in exc_info.value.detail
    
    def test_create_medicao_trims_whitespace(self, db_session):
        """Tests measurement creation trims whitespace"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        medicao = MedicaoService.create_medicao(
            db_session,
            sensor_id=sensor.id,
            name="  temperatura  ",
            value=25.5
        )
        
        assert medicao.name == "temperatura"
    
    def test_get_medicoes_empty(self, db_session):
        """Tests measurement search when none exist"""
        result = MedicaoService.get_medicoes(db_session)
        
        assert result["medicoes"] == []
        assert result["total"] == 0
    
    def test_get_medicoes_with_data(self, db_session):
        """Tests measurement search when data exists"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        MedicaoService.create_medicao(db_session, sensor.id, "temp", 25.5)
        MedicaoService.create_medicao(db_session, sensor.id, "temp", 30.2)
        
        result = MedicaoService.get_medicoes(db_session)
        
        assert len(result["medicoes"]) == 2
        assert result["total"] == 2
    
    def test_get_medicao_by_id(self, db_session):
        """Tests measurement search by ID"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        created_medicao = MedicaoService.create_medicao(
            db_session,
            sensor.id,
            "temperatura",
            25.5
        )
        
        found_medicao = MedicaoService.get_medicao(db_session, created_medicao.id)
        
        assert found_medicao is not None
        assert found_medicao.id == created_medicao.id
        assert found_medicao.value == 25.5
    
    def test_get_medicao_not_found(self, db_session):
        """Tests measurement search when not found"""
        medicao = MedicaoService.get_medicao(db_session, 999)
        
        assert medicao is None
    
    def test_delete_medicao(self, db_session):
        """Tests measurement deletion"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        medicao = MedicaoService.create_medicao(
            db_session,
            sensor.id,
            "temperatura",
            25.5
        )
        
        result = MedicaoService.delete_medicao(db_session, medicao.id)
        
        assert result is not None
        
        deleted_medicao = MedicaoService.get_medicao(db_session, medicao.id)
        assert deleted_medicao is None
    
    def test_get_metricas_success(self, db_session):
        """Tests successful metrics calculation"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        MedicaoService.create_medicao(db_session, sensor.id, "temp", 20.0)
        MedicaoService.create_medicao(db_session, sensor.id, "temp", 30.0)
        MedicaoService.create_medicao(db_session, sensor.id, "temp", 25.0)
        
        metricas = MedicaoService.get_metricas(db_session, sensor.id)
        
        assert metricas["count"] == 3
        assert metricas["min"] == 20.0
        assert metricas["max"] == 30.0
        assert metricas["avg"] == 25.0
    
    def test_get_metricas_no_measurements(self, db_session):
        """Tests metrics calculation when no measurements exist"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        with pytest.raises(HTTPException) as exc_info:
            MedicaoService.get_metricas(db_session, sensor.id)
        
        assert exc_info.value.status_code == 404
        assert "No measurements found" in exc_info.value.detail
    
    def test_get_medicoes_by_sensor(self, db_session):
        """Tests measurement search by sensor"""
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        MedicaoService.create_medicao(db_session, sensor.id, "temp", 25.5)
        MedicaoService.create_medicao(db_session, sensor.id, "temp", 30.2)
        MedicaoService.create_medicao(db_session, sensor.id, "temp", 28.7)
        
        result = MedicaoService.get_medicoes_by_sensor(db_session, sensor.id)
        
        assert len(result["medicoes"]) == 3
        assert result["total"] == 3
        assert all(m.sensor_id == sensor.id for m in result["medicoes"])
