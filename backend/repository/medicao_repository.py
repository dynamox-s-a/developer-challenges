from models.medicao import Medicao
from datetime import datetime

class MedicaoRepository:
    """Repository for database operations related to Medicao."""

    @staticmethod
    def create(db, sensor_id: int, name: str, value: float):
        """Creates a new measurement in the database.
        
        Args:
            db: Database session
            sensor_id: ID of the associated sensor
            name: Measurement name
            value: Measurement value
            
        Returns:
            Created measurement with assigned ID
        """
        medicao = Medicao(
            sensor_id=sensor_id,
            name=name,
            value=value,
            timestamp=datetime.now()
        )

        db.add(medicao)
        db.commit()
        db.refresh(medicao)

        return medicao
    
    @staticmethod
    def get_medicoes(db):
        """Returns all measurements from the database.
        
        Args:
            db: Database session
            
        Returns:
            List of all measurements
        """
        return db.query(Medicao).all()
    
    @staticmethod
    def get_medicao(db, medicao_id: int):
        """Returns a specific measurement by ID.
        
        Args:
            db: Database session
            medicao_id: Measurement ID
            
        Returns:
            Found measurement or None if not exists
        """
        return db.query(Medicao).filter(Medicao.id == medicao_id).first()
    
    @staticmethod
    def delete_medicao(db, medicao_id: int):
        """Deletes a measurement from the database.
        
        Args:
            db: Database session
            medicao_id: ID of the measurement to be deleted
            
        Returns:
            Deleted measurement or None if not exists
        """
        medicao = db.query(Medicao).filter(Medicao.id == medicao_id).first()
        if medicao:
            db.delete(medicao)
            db.commit()
        return medicao
    
    @staticmethod
    def get_by_sensor(db, sensor_id: int):
        """Returns all measurements from a specific sensor.
        
        Args:
            db: Database session
            sensor_id: Sensor ID
            
        Returns:
            List of sensor measurements
        """
        return (
            db.query(Medicao)
            .filter(Medicao.sensor_id == sensor_id)
            .all()
        )