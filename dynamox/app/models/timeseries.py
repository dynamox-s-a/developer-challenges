import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, Float, ForeignKey, Integer, Index, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


def utcnow():
    """
    Return the current UTC time with timezone information.

    We store timestamps in UTC to avoid ambiguity and to make filtering
    and comparisons consistent across environments.
    """
    return datetime.now(timezone.utc)


class TimeSeries(Base):
    """
    TimeSeries table: represents a logical time series entity.

    This table stores the metadata of a time series, while the actual samples
    are stored in the DataPoint table (one-to-many relationship).

    Typical use cases:
    - create a new time series (POST /timeseries)
    - list/count time series
    - delete a time series (cascades to data points)
    """

    __tablename__ = "timeseries"

    # Primary key:
    # We use a UUID stored as a string for easier client-side usage
    # and to avoid exposing sequential IDs.
    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    # A human-friendly name for the time series (indexable for search/filtering).
    name: Mapped[str] = mapped_column(String(255), index=True)

    # Free-form metadata stored as JSON serialized into a TEXT column.
    # Using TEXT keeps the project simple and SQLite-friendly.
    metadata_json: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Creation timestamp (UTC). Useful for auditing and ordering in listings.
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utcnow,
        nullable=False,
    )

    # One-to-many relationship:
    # A TimeSeries has many DataPoints.
    #
    # cascade="all, delete-orphan" means:
    # - when a TimeSeries is deleted, all related DataPoints are deleted as well
    # - a DataPoint cannot exist without a parent TimeSeries
    #
    # passive_deletes=True works together with the FK ondelete="CASCADE"
    # to let the database handle cascading deletes efficiently.
    points: Mapped[list["DataPoint"]] = relationship(
        back_populates="series",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class DataPoint(Base):
    """
    DataPoint table: stores the actual samples (timestamp, value) of a time series.

    Each row is a single measurement/sample.

    Typical operations:
    - insert many datapoints for a time series (bulk insert)
    - retrieve datapoints ordered by timestamp
    - compute aggregated metrics (min/max/avg/count) in SQL
    """

    __tablename__ = "datapoints"

    # Integer primary key (auto-increment) is efficient for row storage in SQLite.
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Foreign key back to the parent time series.
    #
    # ondelete="CASCADE" ensures that deleting a TimeSeries also deletes
    # all its DataPoints at the database level.
    timeseries_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("timeseries.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    # Timestamp of the sample (UTC).
    # Indexed because queries often filter by time windows (from/to).
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        index=True,
        nullable=False,
    )

    # Numeric value of the sample.
    value: Mapped[float] = mapped_column(Float, nullable=False)

    # Many-to-one relationship:
    # Each DataPoint belongs to exactly one TimeSeries.
    series: Mapped[TimeSeries] = relationship(back_populates="points")


# Composite index to speed up the most common access pattern:
# - filter by timeseries_id
# - order/filter by timestamp
#
# This index benefits endpoints like:
# - GET /timeseries/{id}?from=...&to=...
# - GET /timeseries/{id}/metrics?from=...&to=...
Index("idx_datapoints_ts_id_timestamp", DataPoint.timeseries_id, DataPoint.timestamp)
