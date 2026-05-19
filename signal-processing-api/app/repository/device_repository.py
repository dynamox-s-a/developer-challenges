
from sqlalchemy.orm import relationship 
from datetime import datetime
from app.core.database import Base
from sqlalchemy.orm import Session
from app.models.device import Device


class DeviceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_deviceid(self, device_id: int):
        return self.db.query(Device).filter(
            Device.id == device_id
        ).first()
    
    def get_by_serial_device(self, serial_device: str):
        return self.db.query(Device).filter(
            Device.serial_device == serial_device
        ).first()

    def get_all(self):
        return (
        self.db.query(Device)
        .order_by(Device.created_at.desc())
        .all()
    )   
     

    def create(self, name: str, serial_device: str, created_at: datetime):
        device = Device(
            name=name,
            serial_device=serial_device,
            created_at=created_at
        )

        self.db.add(device)
        self.db.commit()
        self.db.refresh(device)

        return device