import uuid

from sqlalchemy import Column, Float, ForeignKey, DateTime, Enum, Index, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.core.database import Base

from app.enums.metric_type import MetricType

class Metric(Base):
    __tablename__ = "metrics"

    __table_args__ = (
        Index("idx_metrics_signal_timestamp", "signal_id", "timestamp"),
        Index("idx_metrics_signal_type", "signal_id", "metric_type"),
    )

    id = Column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    signal_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("signals.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    metric_type = Column(
        Enum(MetricType, name="metric_type_enum"), 
        nullable=False,
        index=True
    )
    value = Column(Float, nullable=False)
    timestamp = Column(
        DateTime(timezone=True), 
        nullable=False,
        server_default=func.now(),
        index=True
    )
    created_at = Column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        index=True
    )
    signal = relationship("Signal", back_populates="metrics")
