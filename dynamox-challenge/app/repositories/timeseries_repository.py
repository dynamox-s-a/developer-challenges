"""Repository layer — all database queries for Timeseries and TimeseriesData."""
from uuid import UUID

from sqlalchemy import func, insert
from sqlalchemy.orm import Session

from app.models.timeseries import Timeseries, TimeseriesData
from app.utils.metrics import format_metrics_result


class TimeseriesRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_timeseries(
        self,
        name: str | None,
        extra_metadata: dict,
        data_points: list[dict],
    ) -> Timeseries:
        timestamps = [dp["timestamp"] for dp in data_points]

        series = Timeseries(
            name=name,
            extra_metadata=extra_metadata,
            data_points_count=len(data_points),
            time_range_start=min(timestamps) if timestamps else None,
            time_range_end=max(timestamps) if timestamps else None,
        )
        self.db.add(series)
        self.db.flush()

        if data_points:
            self.db.execute(
                insert(TimeseriesData),
                [
                    {
                        "timeseries_id": series.id,
                        "timestamp": dp["timestamp"],
                        "value": dp["value"],
                    }
                    for dp in data_points
                ],
            )

        self.db.commit()
        self.db.refresh(series)
        return series

    def get_timeseries_by_id(
        self,
        series_id: UUID,
        limit: int = 100,
        offset: int = 0,
    ) -> tuple[Timeseries, list[TimeseriesData]] | None:
        series = self.db.query(Timeseries).filter(Timeseries.id == series_id).first()
        if not series:
            return None

        data_points = (
            self.db.query(TimeseriesData)
            .filter(TimeseriesData.timeseries_id == series_id)
            .order_by(TimeseriesData.timestamp.asc())
            .limit(limit)
            .offset(offset)
            .all()
        )
        return series, data_points

    def get_metrics(self, series_id: UUID) -> dict | None:
        series = self.db.query(Timeseries).filter(Timeseries.id == series_id).first()
        if not series:
            return None

        result = (
            self.db.query(
                func.avg(TimeseriesData.value).label("mean"),
                func.stddev(TimeseriesData.value).label("stddev"),
                func.min(TimeseriesData.value).label("min"),
                func.max(TimeseriesData.value).label("max"),
                func.count(TimeseriesData.value).label("count"),
            )
            .filter(TimeseriesData.timeseries_id == series_id)
            .one()
        )

        return format_metrics_result(series, result)

    def get_count(self) -> int:
        """Return the total number of stored time series."""
        return self.db.query(Timeseries).count()

    def delete_timeseries(self, series_id: UUID) -> bool:
        series = self.db.query(Timeseries).filter(Timeseries.id == series_id).first()
        if not series:
            return False

        self.db.delete(series)
        self.db.commit()
        return True
