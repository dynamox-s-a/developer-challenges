import uuid
from sqlalchemy import Column, Float, DateTime, ForeignKey, Enum, Index
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone

from app.core.database import Base

from app.enums.signal_type import SignalType

class Signal(Base):
    __tablename__ = "signals"

    __table_args__ = (
        Index("idx_machine_timestamp", "machine_id", "timestamp"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machine_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("machines.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    signal_type = Column(
        Enum(SignalType, name="signal_type_enum"), 
        nullable=False,
        index=True
    )
    value = Column(Float, nullable=False)
    timestamp = Column(
        DateTime(timezone=True), 
        nullable=False,
        index=True
    )
    created_at = Column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        index=True
    )
    machine = relationship(
        "Machine", 
        back_populates="signals"
    )
    metrics = relationship(
        "Metrics", 
        back_populates="signal",
        cascade="all, delete"
    )