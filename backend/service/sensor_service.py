from fastapi import HTTPException
from repositories.sensor_repository import SensorRepository

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
        sensor = db.query(SensorModel).filter(SensorModel.id == sensor_id).first()
        if not sensor:
            raise HTTPException(
                status_code=404,
                detail="Sensor not found"
            )
        db.delete(sensor)
        db.commit()
        return {"message": "Sensor deleted successfully"}
        