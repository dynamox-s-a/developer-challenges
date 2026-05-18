from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import relationship     
from app.core.database import Base
from sqlalchemy.orm import Session
from app.models.raw_data import RawData


class RawDataRepository:
    def __init__(self, db: Session):
        self.db = db

    def exists(self, device_id: int, timestamp):
        return self.db.query(RawData).filter(
            RawData.device_id == device_id,
            RawData.timestamp == timestamp
        ).first()
    
    
    def get_existing_timestamps(self, device_id: int, timestamps: list):
        return (
            self.db.query(RawData.timestamp)
            .filter(
                RawData.device_id == device_id,
                RawData.timestamp.in_(timestamps)
            )
            .all()
    )
    
    


    def bulk_create(self, instances_list):
        try:
            if instances_list and isinstance(instances_list[0], dict):
                self.db.bulk_insert_mappings(RawData, instances_list)
            else:
                self.db.bulk_save_objects(instances_list)
                
            self.db.commit()
            
            
            return {"status": "success", "count": len(instances_list)}
            
        except Exception as e:
            self.db.rollback()
            raise e
            

    # def create(self, device_id: int, timestamp, value: float):
    #     raw = RawData(
    #         device_id=device_id,
    #         timestamp=timestamp,
    #         value=value
    #     )

        self.db.add(raw)
        self.db.commit()
        self.db.refresh(raw)

        return raw