from models.sensor import Sensor

class SensorRepository:
    """Repository for database operations related to Sensor."""

    @staticmethod
    def create(db, name: str):
        """Creates a new sensor in the database.
        
        Args:
            db: Database session
            name: Sensor name
            
        Returns:
            Created sensor with assigned ID
        """
        sensor = Sensor(name=name)

        db.add(sensor)
        db.commit()
        db.refresh(sensor)

        return sensor
    
    @staticmethod
    def get_sensors(db):
        """Returns all sensors from the database.
        
        Args:
            db: Database session
            
        Returns:
            List of all sensors
        """
        return db.query(Sensor).all()
    
    @staticmethod
    def get_sensor(db, sensor_id: int):
        """Returns a specific sensor by ID.
        
        Args:
            db: Database session
            sensor_id: Sensor ID
            
        Returns:
            Found sensor or None if not exists
        """
        return db.query(Sensor).filter(Sensor.id == sensor_id).first()
    
    @staticmethod
    def delete_sensor(db, sensor_id: int):
        """Deletes a sensor from the database.
        
        Args:
            db: Database session
            sensor_id: ID of the sensor to be deleted
            
        Returns:
            Deletion confirmation message
        """
        sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
        db.delete(sensor)
        db.commit()
        return {"message": "Sensor deleted successfully"}
    