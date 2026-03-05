from uuid import UUID

from sqlalchemy.orm import Session

from app.api.exceptions import TimeseriesNotFound, TimeseriesPayloadTooLarge
from app.repositories.timeseries_repository import TimeseriesRepository
from app.schemas.timeseries import (
    CountResponse,
    DataPoint,
    MetricsResponse,
    TimeSeriesCreate,
    TimeSeriesResponse,
)


class TimeseriesService:
    MAX_DATA_POINTS = 1_000_000

    def __init__(self, db: Session):
        self.repo = TimeseriesRepository(db)

    # ------------------------------------------------------------------
    # Create
    # ------------------------------------------------------------------

    def create(self, payload: TimeSeriesCreate) -> TimeSeriesResponse:
        if len(payload.data) > self.MAX_DATA_POINTS:
            raise TimeseriesPayloadTooLarge(
                f"Received {len(payload.data):,} data points — max is {self.MAX_DATA_POINTS:,}"
            )

        data_points = [
            {"timestamp": dp.timestamp, "value": dp.value} for dp in payload.data
        ]

        series = self.repo.create_timeseries(
            name=payload.name,
            extra_metadata=payload.metadata or {},
            data_points=data_points,
        )

        return TimeSeriesResponse(
            id=series.id,
            name=series.name,
            metadata=series.extra_metadata,
            created_at=series.created_at,
            data_points_count=series.data_points_count,
            time_range_start=series.time_range_start,
            time_range_end=series.time_range_end,
            data=[
                DataPoint(timestamp=dp.timestamp, value=dp.value)
                for dp in series.data_points
            ],
        )

    # ------------------------------------------------------------------
    # Read — full series with pagination
    # ------------------------------------------------------------------

    def get_by_id(
        self,
        series_id: UUID,
        limit: int = 100,
        offset: int = 0,
    ) -> TimeSeriesResponse:
        result = self.repo.get_timeseries_by_id(series_id, limit=limit, offset=offset)

        if result is None:
            raise TimeseriesNotFound(f"Time series with id {series_id} not found")

        series, data_points = result

        return TimeSeriesResponse(
            id=series.id,
            name=series.name,
            metadata=series.extra_metadata,
            created_at=series.created_at,
            data_points_count=series.data_points_count,
            time_range_start=series.time_range_start,
            time_range_end=series.time_range_end,
            data=[
                DataPoint(timestamp=dp.timestamp, value=dp.value) for dp in data_points
            ],
        )

    # ------------------------------------------------------------------
    # Read — aggregated metrics
    # ------------------------------------------------------------------

    def get_metrics(self, series_id: UUID) -> MetricsResponse:
        metrics = self.repo.get_metrics(series_id)

        if metrics is None:
            raise TimeseriesNotFound(f"Time series with id {series_id} not found")

        return MetricsResponse(**metrics)

    # ------------------------------------------------------------------
    # Read — total count
    # ------------------------------------------------------------------

    def get_count(self) -> CountResponse:
        return CountResponse(count=self.repo.get_count())

    # ------------------------------------------------------------------
    # Delete
    # ------------------------------------------------------------------

    def delete(self, series_id: UUID) -> None:
        deleted = self.repo.delete_timeseries(series_id)

        if not deleted:
            raise TimeseriesNotFound(f"Time series with id {series_id} not found")
