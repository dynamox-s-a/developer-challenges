import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, BigInteger, ForeignKey, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.infra.database import Base

class TimeSeries(Base):
    __tablename__ = "time_series"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    source: Mapped[str | None] = mapped_column(String, nullable=True)
    unit: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    start_ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    points_count: Mapped[int] = mapped_column(Integer, nullable=False)
    min_value: Mapped[float] = mapped_column(Float, nullable=False)
    max_value: Mapped[float] = mapped_column(Float, nullable=False)
    average: Mapped[float] = mapped_column(Float, nullable=False)
    min_value_aceptable_violated_count: Mapped[int] = mapped_column(Integer, nullable=False)
    max_value_aceptable_violated_count: Mapped[int] = mapped_column(Integer, nullable=False)

    points = relationship(
        "TimeSeriesPoint",
        back_populates="series",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

class TimeSeriesPoint(Base):
    __tablename__ = "time_series_points"
    __table_args__ = (
        UniqueConstraint("series_id", "ts", name="uq_series_ts"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    series_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("time_series.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)

    series = relationship("TimeSeries", back_populates="points")
