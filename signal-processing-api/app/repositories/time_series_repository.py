from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.time_series import TimeSeries, TimeSeriesPoint
from app.schemas.time_series import TimeSeriesCreate


class TimeSeriesRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, payload: TimeSeriesCreate) -> TimeSeries:
        series = TimeSeries(
            asset_name=payload.asset_name,
            sensor_name=payload.sensor_name,
            signal_type=payload.signal_type,
            unit=payload.unit,
        )

        series.points = [
            TimeSeriesPoint(timestamp=point.timestamp, value=point.value)
            for point in payload.data
        ]

        self.db.add(series)
        self.db.commit()
        self.db.refresh(series)

        return series

    def find_all(self) -> list[TimeSeries]:
        statement = (
            select(TimeSeries)
            .options(selectinload(TimeSeries.points))
            .order_by(TimeSeries.created_at.desc())
        )
        return list(self.db.scalars(statement).all())

    def find_by_id(self, series_id: UUID) -> TimeSeries | None:
        statement = (
            select(TimeSeries)
            .options(selectinload(TimeSeries.points))
            .where(TimeSeries.id == series_id)
        )
        return self.db.scalars(statement).first()

    def count(self) -> int:
        statement = select(func.count(TimeSeries.id))
        return int(self.db.scalar(statement) or 0)

    def delete(self, series: TimeSeries) -> None:
        self.db.delete(series)
        self.db.commit()
        
    def append_points(
        self,
        series: TimeSeries,
        points_data,
    ) -> int:
        points = [
            TimeSeriesPoint(
                series_id=series.id,
                timestamp=point.timestamp,
                value=point.value,
            )
            for point in points_data
        ]

        self.db.add_all(points)
        self.db.commit()

        return len(points)