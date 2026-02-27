import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone

from app.core.database import Base

class Machine(Base):
    __tablename__ = "machines"

    id = Column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    created_at = Column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    signals = relationship(
        "Signal", 
        back_populates="machine",
        cascade="all, delete"
    )