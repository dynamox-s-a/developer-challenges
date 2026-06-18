from models.sensor import Sensor

class SensorRepository:

    @staticmethod
    def create(db, name: str):
        sensor = Sensor(name=name)

        db.add(sensor)
        db.commit()
        db.refresh(sensor)

        return sensor
    
    @staticmethod
    def get_sensors(db):
        return db.query(Sensor).all()
    
    @staticmethod
    def get_sensor(db, sensor_id: int):
        return db.query(Sensor).filter(Sensor.id == sensor_id).first()
    
    @staticmethod
    def delete_sensor(db, sensor_id: int):
        sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
        db.delete(sensor)
        db.commit()
        return {"message": "Sensor deleted successfully"}
    