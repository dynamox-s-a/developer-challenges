from app.core.exceptions import NotFoundException
from app.repository.device_repository import DeviceRepository

class DeviceService:

    def __init__(self, db):
        self.device_repo = DeviceRepository(db)

    def get_all_devices(self):      
        return self.device_repo.get_all()