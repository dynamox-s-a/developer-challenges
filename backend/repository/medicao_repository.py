from models.medicao import Medicao
from datetime import datetime

class MedicaoRepository:

    @staticmethod
    def create(db, sensor_id: int, name: str, value: float):
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
        return db.query(Medicao).all()
    
    @staticmethod
    def get_medicao(db, medicao_id: int):
        return db.query(Medicao).filter(Medicao.id == medicao_id).first()
    
    @staticmethod
    def delete_medicao(db, medicao_id: int):
        medicao = db.query(Medicao).filter(Medicao.id == medicao_id).first()
        if medicao:
            db.delete(medicao)
            db.commit()
        return medicao
    
    @staticmethod
    def get_by_sensor(db, sensor_id: int):
        return (
            db.query(Medicao)
            .filter(Medicao.sensor_id == sensor_id)
            .all()
        )