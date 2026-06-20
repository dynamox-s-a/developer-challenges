from fastapi import HTTPException
from repository.medicao_repository import MedicaoRepository
from repository.sensor_repository import SensorRepository

class MedicaoService:
    """Service for business logic related to Medicao."""

    @staticmethod
    def create_medicao(
        db,
        sensor_id: int,
        name: str,
        value: float
    ):
        """Creates a new measurement with validation.
        
        Args:
            db: Database session
            sensor_id: ID of the associated sensor
            name: Measurement name
            value: Measurement value
            
        Returns:
            Created measurement
            
        Raises:
            HTTPException: If name is empty or sensor does not exist
        """

        if not name.strip():
            raise HTTPException(
                status_code=400,
                detail="Measurement name cannot be empty"
            )

        sensor = SensorRepository.get_sensor(
            db=db,
            sensor_id=sensor_id
        )

        if not sensor:
            raise HTTPException(
                status_code=404,
                detail="Sensor not found"
            )

        return MedicaoRepository.create(
            db=db,
            sensor_id=sensor_id,
            name=name.strip(),
            value=value
        )
    
    @staticmethod
    def get_medicoes(db):
        """Returns all measurements with total.
        
        Args:
            db: Database session
            
        Returns:
            Dictionary with list of measurements and total
        """
        medicoes = MedicaoRepository.get_medicoes(db)
        return {
            "medicoes": medicoes,
            "total": len(medicoes)
        }
    
    @staticmethod
    def get_medicao(db, medicao_id: int):
        """Returns a specific measurement by ID.
        
        Args:
            db: Database session
            medicao_id: Measurement ID
            
        Returns:
            Found measurement or None if not exists
        """
        return MedicaoRepository.get_medicao(db, medicao_id)
    
    @staticmethod
    def delete_medicao(db, medicao_id: int):
        """Deletes a measurement from the database.
        
        Args:
            db: Database session
            medicao_id: ID of the measurement to be deleted
            
        Returns:
            Deleted measurement or None if not exists
        """
        return MedicaoRepository.delete_medicao(db, medicao_id)
    
    @staticmethod
    def get_metricas(db, sensor_id: int):
        """Calculates statistical metrics for sensor measurements.
        
        Args:
            db: Database session
            sensor_id: Sensor ID
            
        Returns:
            Dictionary with count, min, max, avg of measurements
            
        Raises:
            HTTPException: If no measurements found for the sensor
        """

        medicoes = MedicaoRepository.get_by_sensor(
            db=db,
            sensor_id=sensor_id
        )

        if not medicoes:
            raise HTTPException(
                status_code=404,
                detail="No measurements found"
            )

        valores = [medicao.value for medicao in medicoes]

        return {
            "count": len(valores),
            "min": min(valores),
            "max": max(valores),
            "avg": sum(valores) / len(valores)
        }
    
    @staticmethod
    def get_medicoes_by_sensor(db, sensor_id: int):
        """Returns all measurements from a specific sensor with total.
        
        Args:
            db: Database session
            sensor_id: Sensor ID
            
        Returns:
            Dictionary with list of sensor measurements and total
        """
        medicoes = MedicaoRepository.get_by_sensor(db, sensor_id)
        return {
            "medicoes": medicoes,
            "total": len(medicoes)
        }