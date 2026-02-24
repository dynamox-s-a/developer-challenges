import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.sqlite import BLOB
from datetime import datetime

from app.core.database import Base

class Machine(Base):
    __tablename__ = "machine"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now())

    signals = relationship(
        "Signal", 
        back_populates="machine",
        cascade="all, delete"
    )