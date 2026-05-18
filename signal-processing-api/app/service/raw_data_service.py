from datetime import datetime, timezone

from sqlalchemy.orm import Session
from app.core.exceptions import FutureTimestampException, DuplicateDataException
from app.core.exceptions import ValidationException
from app.repository.device_repository import DeviceRepository
from app.repository.raw_data_repository import RawDataRepository
from app.schemas.raw_data import RawDataCreate


class RawDataService:

    def __init__(self, db):
        self.device_repo = DeviceRepository(db)
        self.raw_repo = RawDataRepository(db)

    def create_raw_data(self, payload: RawDataCreate):

        now = datetime.now(timezone.utc)

        # 1. NORMALIZAÇÃO DO SERIAL
        serial = payload.serial_device.strip().upper()

        # 2. BUSCA OU CRIA DEVICE
        device = self.device_repo.get_by_serial_device(serial)

        if not device:
            device = self.device_repo.create(
                name=f"device-{serial}",
                serial_device=serial,
                created_at=now
            )

        # 3. BUSCA EM LOTE O QUE JÁ EXISTE NO BANCO
        timestamps = [item.timestamp for item in payload.data]

        existing = self.raw_repo.get_existing_timestamps(
            device_id=device.id,
            timestamps=timestamps
        )

        existing_set = {t[0] for t in existing}

        # 4. PROCESSAMENTO DO BATCH
        seen = set()
        inserts = []
        rejected = []

        for item in payload.data:

            # 4.1 valida timestamp futuro
            if item.timestamp > now:
                rejected.append({
                    "timestamp": item.timestamp,
                    "reason": "future_timestamp"
                })
                continue

            # 4.2 duplicado no próprio payload
            if item.timestamp in seen:
                rejected.append({
                    "timestamp": item.timestamp,
                    "reason": "duplicate_in_payload"
                })
                continue

            # 4.3 já existe no banco
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

        # 5. INSERÇÃO EM LOTE
        if inserts:
            self.raw_repo.bulk_create(inserts)

        # 6. RESPONSE FINAL
        return {
            "device_id": device.id,
            "serial_device": serial,
            "inserted": len(inserts),
            "rejected": len(rejected),
            "details": rejected
        }