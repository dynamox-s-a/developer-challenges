from datetime import datetime, timezone

from sqlalchemy.orm import Session
from app.repository.device_repository import DeviceRepository
from app.repository.raw_data_repository import RawDataRepository
from app.schemas.raw_data import RawDataCreate
from app.core.exceptions import NotFoundException

from itertools import groupby


class RawDataService:

    def __init__(self, db):
        self.device_repo = DeviceRepository(db)
        self.raw_repo = RawDataRepository(db)

    def create_raw_data(self, payload: RawDataCreate):

        now = datetime.now(timezone.utc)

        # NORMALIZAÇÃO DO SERIAL
        serial = payload.serial_device.strip().upper()

        #  BUSCA OU CRIA DEVICE
        device = self.device_repo.get_by_serial_device(serial)

        if not device:
            device = self.device_repo.create(
                name=f"device-{serial}",
                serial_device=serial,
                created_at=now
            )

        #  BUSCA EM LOTE O QUE JÁ EXISTE NO BANCO
        timestamps = [item.timestamp for item in payload.data]

        existing = self.raw_repo.get_existing_timestamps(
            device_id=device.id,
            timestamps=timestamps
        )

        existing_set = {t[0] for t in existing}

        # PROCESSAMENTO DO BATCH
        seen = set()
        inserts = []
        rejected = []

        for item in payload.data:

            #  valida timestamp futuro
            if item.timestamp > now:
                rejected.append({
                    "timestamp": item.timestamp,
                    "reason": "future_timestamp"
                })
                continue

            #  já existeno próprio payload
            if item.timestamp in seen:
                rejected.append({
                    "timestamp": item.timestamp,
                    "reason": "duplicate_in_payload"
                })
                continue

            # já existe no banco
            if item.timestamp in existing_set:
                rejected.append({
                    "timestamp": item.timestamp,
                    "reason": "already_exists"
                })
                continue

            seen.add(item.timestamp)

            inserts.append({
                "device_id": device.id,
                "timestamp": item.timestamp,
                "value": item.value
            })

        #  INSERÇÃO EM LOTE
        if inserts:
            self.raw_repo.bulk_create(inserts)

        # RESPONSE FINAL
        return {
            "device_id": device.id,
            "serial_device": serial,
            "inserted": len(inserts),
            "rejected": len(rejected),
            "details": rejected
        }
    

    def get_full_time_series(self):
    #  Busca todos os dados brutos ordenados por dispositivo
        all_data = self.raw_repo.get_all_devices_with_data()
        
        result = []
        
        # Agrupa os dados dinamicamente pelo ID do dispositivo
        for device_id, group in groupby(all_data, key=lambda x: x.device_id):
            series_entries = []
            
            for item in group:
                series_entries.append({
                    "id": item.id,
                    "timestamp": item.timestamp,
                    "value": item.value
                })
                
            #  Monta o objeto do dispositivo com a sua respectiva série temporal
            result.append({
                "device_id": device_id,
                "series_data": series_entries
            })
            
        return result
    

    def get_active_devices_count(self):
        devices_count = self.raw_repo.count_devices_with_data()
        return {"active_devices_count": devices_count}
    

    def delete_by_device(self, device_id: int):

        device = self.device_repo.get_by_deviceid(device_id)

        if not device:
            raise NotFoundException("Device not found")

        deleted_count = self.raw_repo.delete_by_device_id(device_id)

        return {
            "success": True,
            "deleted_records": deleted_count
        }


    def get_device_metrics(self, device_id: int):
        stats = self.raw_repo.get_time_series_stats(device_id)
        
        if not stats:
            raise NotFoundException("Nenhum dado de série temporal encontrado para este dispositivo.")
            
        general = stats["general"]
        max_rec = stats["max_record"]
        min_rec = stats["min_record"]
        
        return {
            "device_id": device_id,
            "metrics": {
                "total_records": general.total_records,
                "average_value": round(general.avg_value, 2) if general.avg_value else 0.0,
                "max": {
                    "value": max_rec.value if max_rec else None,
                    "timestamp": max_rec.timestamp if max_rec else None
                },
                "min": {
                    "value": min_rec.value if min_rec else None,
                    "timestamp": min_rec.timestamp if min_rec else None
                }
            },
            "period": {
                "start_time": general.first_timestamp,
                "end_time": general.last_timestamp
            }
        }    