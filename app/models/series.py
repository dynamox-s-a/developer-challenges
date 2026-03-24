import uuid
from datetime import datetime, UTC
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class Series(Base):
    __tablename__ = "series"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now(UTC))

class SeriesData(Base):
    __tablename__ = "series_data"

    timestamp = Column(DateTime(timezone=True), primary_key=True)
    
    series_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("series.id", ondelete="CASCADE"), 
        primary_key=True
    )
    
    value = Column(Float, nullable=False)