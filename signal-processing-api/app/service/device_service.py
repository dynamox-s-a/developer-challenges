from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.repository.device_repository import DeviceRepository
from app.repository.raw_data_repository import RawDataRepository




class DeviceService:

    def __init__(self, db):
        self.device_repo = DeviceRepository(db)
        self.raw_repo = RawDataRepository(db)

    def get_all_devices(self):      
        return self.device_repo.get_all()
    
    
    def get_device_raw_data(self, device_id: int):
        device = self.device_repo.get_by_deviceid(device_id)

        if not device:
            raise NotFoundException("device not found")

        return self.raw_repo.get_by_device_id(device_id)
            
        
