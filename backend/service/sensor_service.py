from fastapi import HTTPException
from repository.sensor_repository import SensorRepository

class SensorService:
    """Service for business logic related to Sensor."""

    @staticmethod
    def create_sensor(db, name: str):
        """Creates a new sensor with validation.
        
        Args:
            db: Database session
            name: Sensor name
            
        Returns:
            Created sensor
            
        Raises:
            HTTPException: If name is empty or contains only whitespace
        """

        if not name.strip():
            raise HTTPException(
                status_code=400,
                detail="Sensor name cannot be empty"
            )

        return SensorRepository.create(
            db=db,
            name=name.strip()
        )
    
    @staticmethod
    def get_sensors(db):
        """Returns all sensors.
        
        Args:
            db: Database session
            
        Returns:
            List of all sensors
        """
        return SensorRepository.get_sensors(db)
    
    @staticmethod
    def get_sensor(db, sensor_id: int):
        """Returns a specific sensor by ID.
        
        Args:
            db: Database session
            sensor_id: Sensor ID
            
        Returns:
            Found sensor or None if not exists
        """
        return SensorRepository.get_sensor(db, sensor_id)
    
    @staticmethod
    def delete_sensor(db, sensor_id: int):
        """Deletes a sensor from the database.
        
        Args:
            db: Database session
            sensor_id: ID of the sensor to be deleted
            
        Returns:
            Deletion confirmation message
        """
        return SensorRepository.delete_sensor(db, sensor_id)