"""SQLAlchemy models for time series header and data points."""
from uuid import uuid4

from sqlalchemy import Column, String, DateTime, Float, Integer, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Timeseries(Base):
    """Header record describing a time series (no data points here)"""

    __tablename__ = "timeseries"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        index=True,
    )
    name = Column(String(255), nullable=True, index=True)
    extra_metadata = Column(JSONB, nullable=False, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    data_points_count = Column(Integer, nullable=False, default=0)
    time_range_start = Column(DateTime(timezone=True), nullable=True)
    time_range_end = Column(DateTime(timezone=True), nullable=True)

    data_points = relationship(
        "TimeseriesData",
        back_populates="timeseries",
        cascade="all, delete-orphan",
    )


class TimeseriesData(Base):
    """Individual data points belonging to a Timeseries.
    This table is promoted to a TimescaleDB hypertable on timestamp.
    """


    __tablename__ = "timeseries_data"

    timeseries_id = Column(
        UUID(as_uuid=True),
        ForeignKey("timeseries.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    timestamp = Column(DateTime(timezone=True), primary_key=True, nullable=False)
    value = Column(Float, nullable=False)

    timeseries = relationship("Timeseries", back_populates="data_points")

    __table_args__ = (
        Index("ix_timeseries_data_timeseries_id_timestamp", "timeseries_id", "timestamp"),
    )
