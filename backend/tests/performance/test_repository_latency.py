import pytest


class TestRepositoryLatency:
    """Latency tests for repository layer"""
    
    def test_create_sensor_latency(self, benchmark, db_session):
        """Tests sensor creation latency in repository"""
        from repository.sensor_repository import SensorRepository
        
        def create_sensor():
            return SensorRepository.create(db_session, "Sensor Teste")
        
        result = benchmark(create_sensor)
        assert result.id is not None
    
    def test_get_sensors_latency(self, benchmark, db_session):
        """Tests sensor search latency in repository"""
        from repository.sensor_repository import SensorRepository
        
        for i in range(10):
            SensorRepository.create(db_session, f"Sensor {i}")
        
        def get_sensors():
            return SensorRepository.get_sensors(db_session)
        
        result = benchmark(get_sensors)
        assert len(result) == 10
    
    def test_get_sensor_latency(self, benchmark, db_session):
        """Tests sensor search by ID latency in repository"""
        from repository.sensor_repository import SensorRepository
        
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        def get_sensor():
            return SensorRepository.get_sensor(db_session, sensor.id)
        
        result = benchmark(get_sensor)
        assert result.id == sensor.id
    
    def test_create_medicao_latency(self, benchmark, db_session):
        """Tests measurement creation latency in repository"""
        from repository.sensor_repository import SensorRepository
        from repository.medicao_repository import MedicaoRepository
        
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        def create_medicao():
            return MedicaoRepository.create(
                db_session,
                sensor.id,
                "temperatura",
                25.5
            )
        
        result = benchmark(create_medicao)
        assert result.id is not None
    
    def test_get_medicoes_latency(self, benchmark, db_session):
        """Tests measurement search latency in repository"""
        from repository.sensor_repository import SensorRepository
        from repository.medicao_repository import MedicaoRepository
        
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        for i in range(10):
            MedicaoRepository.create(
                db_session,
                sensor.id,
                "temperatura",
                20.0 + i
            )
        
        def get_medicoes():
            return MedicaoRepository.get_medicoes(db_session)
        
        result = benchmark(get_medicoes)
        assert len(result) == 10
    
    def test_get_by_sensor_latency(self, benchmark, db_session):
        """Tests measurement search by sensor latency in repository"""
        from repository.sensor_repository import SensorRepository
        from repository.medicao_repository import MedicaoRepository
        
        sensor = SensorRepository.create(db_session, "Sensor Teste")
        
        for i in range(10):
            MedicaoRepository.create(
                db_session,
                sensor.id,
                "temperatura",
                20.0 + i
            )
        
        def get_by_sensor():
            return MedicaoRepository.get_by_sensor(db_session, sensor.id)
        
        result = benchmark(get_by_sensor)
        assert len(result) == 10
