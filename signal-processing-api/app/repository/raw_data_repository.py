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
    
    def get_by_device_id(self, device_id: int, limit: int | None = None, offset: int = 0):
        query = (
            self.db.query(RawData)
            .filter(RawData.device_id == device_id)
            .order_by(RawData.timestamp.asc())
        )

        if offset:
            query = query.offset(offset)

        if limit is not None:
            query = query.limit(limit)

        return query.all()

    def delete_by_device_id(self, device_id: int):
        deleted = self.db.query(RawData).filter(
            RawData.device_id == device_id
        ).delete()

        self.db.commit()
        return deleted
    
    def count_devices_with_data(self):
        return self.db.query(func.count(func.distinct(RawData.device_id))).scalar()
    

    def get_all_devices_with_data(self, limit: int | None = None, offset: int = 0):
        query = (
            self.db.query(RawData)
            .order_by(RawData.device_id.asc(), RawData.timestamp.asc())
        )

        if offset:
            query = query.offset(offset)

        if limit is not None:
            query = query.limit(limit)

        return query.all()
    


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
        



    def get_time_series_stats(self, device_id: int):
       
        general_stats = self.db.query(
            func.avg(RawData.value).label("avg_value"),
            func.count(RawData.id).label("total_records"),
            func.min(RawData.timestamp).label("first_timestamp"),
            func.max(RawData.timestamp).label("last_timestamp")
        ).filter(RawData.device_id == device_id).first()

        if not general_stats or general_stats.total_records == 0:
            return None

        
        max_record = (
            self.db.query(RawData.value, RawData.timestamp)
            .filter(RawData.device_id == device_id)
            .order_by(RawData.value.desc(), RawData.timestamp.asc())
            .first()
        )

        
        min_record = (
            self.db.query(RawData.value, RawData.timestamp)
            .filter(RawData.device_id == device_id)
            .order_by(RawData.value.asc(), RawData.timestamp.asc())
            .first()
        )

        return {
            "general": general_stats,
            "max_record": max_record,
            "min_record": min_record
        }
        

    
            

   
