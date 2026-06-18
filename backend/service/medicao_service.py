from fastapi import HTTPException
from repository.medicao_repository import MedicaoRepository
from repository.sensor_repository import SensorRepository

class MedicaoService:

    @staticmethod
    def create_medicao(
        db,
        sensor_id: int,
        name: str,
        value: float
    ):

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
        medicoes = MedicaoRepository.get_medicoes(db)
        return {
            "medicoes": medicoes,
            "total": len(medicoes)
        }
    
    @staticmethod
    def get_medicao(db, medicao_id: int):
        return MedicaoRepository.get_medicao(db, medicao_id)
    
    @staticmethod
    def delete_medicao(db, medicao_id: int):
        return MedicaoRepository.delete_medicao(db, medicao_id)
    
    @staticmethod
    def get_metricas(db, sensor_id: int):

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
        medicoes = MedicaoRepository.get_by_sensor(db, sensor_id)
        return {
            "medicoes": medicoes,
            "total": len(medicoes)
        }