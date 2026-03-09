from datetime import datetime

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    registry,
    relationship,
)

table_registry = registry()


@table_registry.mapped_as_dataclass
class TimeSeries:
    __tablename__ = 'time_series'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    name: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )

    data_points: Mapped[list['DataPoints']] = relationship(
        back_populates='series', cascade='all, delete-orphan', init=False
    )


@table_registry.mapped_as_dataclass
class DataPoints:
    __tablename__ = 'data_points'

    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    series_id: Mapped[int] = mapped_column(
        ForeignKey('time_series.id'), init=False
    )
    timestamp: Mapped[datetime]
    value: Mapped[float]

    series: Mapped['TimeSeries'] = relationship(
        back_populates='data_points', init=False
    )
