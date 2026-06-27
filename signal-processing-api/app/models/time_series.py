from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class TimeSeries(Base):
    __tablename__ = "time_series"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    points: Mapped[list["TimeSeriesPoint"]] = relationship(
        "TimeSeriesPoint",
        back_populates="series",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class TimeSeriesPoint(Base):
    __tablename__ = "time_series_points"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        index=True,
    )
    series_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("time_series.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    timestamp: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    value: Mapped[float] = mapped_column(Float, nullable=False)

    series: Mapped[TimeSeries] = relationship(
        "TimeSeries",
        back_populates="points",
    )