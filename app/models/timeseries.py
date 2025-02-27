import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Float, Integer, ForeignKey, DateTime, Text, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def _now() -> datetime:
    return datetime.now(timezone.utc)


class TimeSeries(Base):
    __tablename__ = "time_series"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    unit: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now, onupdate=_now)

    data_points: Mapped[list["DataPoint"]] = relationship(
        "DataPoint",
        back_populates="series",
        cascade="all, delete-orphan",
        order_by="DataPoint.timestamp",
    )


class DataPoint(Base):
    __tablename__ = "data_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    series_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("time_series.id", ondelete="CASCADE"), nullable=False, index=True
    )
    timestamp: Mapped[float] = mapped_column(Float, nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)

    series: Mapped["TimeSeries"] = relationship("TimeSeries", back_populates="data_points")

    __table_args__ = (
        # composite index so range queries on a specific series are fast
        Index("ix_data_points_series_timestamp", "series_id", "timestamp"),
    )
