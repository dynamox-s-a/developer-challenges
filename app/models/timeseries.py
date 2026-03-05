import uuid
from sqlalchemy import String, ForeignKey, DateTime, func, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Float
from app.db.base import Base


class TimeSeries(Base):
    __tablename__ = "timeseries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    label: Mapped[str] = mapped_column(String, index=True, unique=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    points = relationship(
        "TimeSeriesPoint",
        back_populates="timeseries",
        cascade="all, delete-orphan",
        order_by="TimeSeriesPoint.timestamp"
    )


class TimeSeriesPoint(Base):
    __tablename__ = "timeseries_points"
    __table_args__ = (
        UniqueConstraint("timeseries_id", "timestamp", name="uq_timeseries_timestamp"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    timeseries_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("timeseries.id", ondelete="CASCADE"),
        index=True
    )
    timestamp: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        index=True
    )
    value: Mapped[float] = mapped_column(Float)

    timeseries = relationship("TimeSeries", back_populates="points")


Index(
    "idx_timeseries_timestamp",
    TimeSeriesPoint.timeseries_id,
    TimeSeriesPoint.timestamp
)