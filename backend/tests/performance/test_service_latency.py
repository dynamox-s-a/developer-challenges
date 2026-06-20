import pytest


class TestServiceLatency:
    """Latency tests for service layer"""
    
    def test_create_sensor_latency(self, benchmark, db_session):
        """Tests sensor creation latency in service"""
        from service.sensor_service import SensorService
        
        def create_sensor():
            return SensorService.create_sensor(db_session, "Sensor Teste")
        
        result = benchmark(create_sensor)
        assert result.id is not None
    
    def test_get_sensors_latency(self, benchmark, db_session):
        """Tests sensor search latency in service"""
        from service.sensor_service import SensorService
        
        for i in range(10):
            SensorService.create_sensor(db_session, f"Sensor {i}")
        
        def get_sensors():
            return SensorService.get_sensors(db_session)
        
        result = benchmark(get_sensors)
        assert len(result) == 10
    
    def test_get_sensor_latency(self, benchmark, db_session):
        """Tests sensor search by ID latency in service"""
        from service.sensor_service import SensorService
        
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        def get_sensor():
            return SensorService.get_sensor(db_session, sensor.id)
        
        result = benchmark(get_sensor)
        assert result.id == sensor.id
    
    def test_create_medicao_latency(self, benchmark, db_session):
        """Tests measurement creation latency in service"""
        from service.sensor_service import SensorService
        from service.medicao_service import MedicaoService
        
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        def create_medicao():
            return MedicaoService.create_medicao(
                db_session,
                sensor.id,
                "temperatura",
                25.5
            )
        
        result = benchmark(create_medicao)
        assert result.id is not None
    
    def test_get_medicoes_latency(self, benchmark, db_session):
        """Tests measurement search latency in service"""
        from service.sensor_service import SensorService
        from service.medicao_service import MedicaoService
        
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        for i in range(10):
            MedicaoService.create_medicao(
                db_session,
                sensor.id,
                "temperatura",
                20.0 + i
            )
        
        def get_medicoes():
            return MedicaoService.get_medicoes(db_session)
        
        result = benchmark(get_medicoes)
        assert result["total"] == 10
    
    def test_get_metricas_latency(self, benchmark, db_session):
        """Tests metrics calculation latency in service"""
        from service.sensor_service import SensorService
        from service.medicao_service import MedicaoService
        
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        for i in range(10):
            MedicaoService.create_medicao(
                db_session,
                sensor.id,
                "temperatura",
                20.0 + i
            )
        
        def get_metricas():
            return MedicaoService.get_metricas(db_session, sensor.id)
        
        result = benchmark(get_metricas)
        assert result["count"] == 10
    
    def test_get_medicoes_by_sensor_latency(self, benchmark, db_session):
        """Tests measurement search by sensor latency in service"""
        from service.sensor_service import SensorService
        from service.medicao_service import MedicaoService
        
        sensor = SensorService.create_sensor(db_session, "Sensor Teste")
        
        for i in range(10):
            MedicaoService.create_medicao(
                db_session,
                sensor.id,
                "temperatura",
                20.0 + i
            )
        
        def get_medicoes_by_sensor():
            return MedicaoService.get_medicoes_by_sensor(db_session, sensor.id)
        
        result = benchmark(get_medicoes_by_sensor)
        assert result["total"] == 10
