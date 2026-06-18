from fastapi import HTTPException
from repository.sensor_repository import SensorRepository

class SensorService:

    @staticmethod
    def create_sensor(db, name: str):

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
        return SensorRepository.get_sensors(db)
    
    @staticmethod
    def get_sensor(db, sensor_id: int):
        return SensorRepository.get_sensor(db, sensor_id)
    
    @staticmethod
    def delete_sensor(db, sensor_id: int):
        return SensorRepository.delete_sensor(db, sensor_id)