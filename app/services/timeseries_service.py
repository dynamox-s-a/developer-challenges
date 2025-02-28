import numpy as np
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import TimeSeriesNotFoundError, TimeSeriesAlreadyExistsError
from app.models.timeseries import TimeSeries, DataPoint
from app.repositories.timeseries_repository import TimeSeriesRepository
from app.schemas.timeseries import (
    TimeSeriesCreate,
    TimeSeriesOut,
    TimeSeriesDetailOut,
    DataPointOut,
    MetricsOut,
    SeriesCountOut,
    DeleteOut,
    PaginatedTimeSeriesOut,
)


class TimeSeriesService:
    def __init__(self, session: AsyncSession) -> None:
        self._repo = TimeSeriesRepository(session)

    async def store(self, payload: TimeSeriesCreate) -> TimeSeriesOut:
        if await self._repo.get_by_name(payload.name):
            raise TimeSeriesAlreadyExistsError(payload.name)

        series = await self._repo.create(payload)
        return TimeSeriesOut.model_validate(series)

    async def retrieve(self, series_id: str) -> TimeSeriesDetailOut:
        series = await self._repo.get_by_id_with_data(series_id)
        if not series:
            raise TimeSeriesNotFoundError(series_id)

        data = [DataPointOut(timestamp=dp.timestamp, value=dp.value) for dp in series.data_points]
        return TimeSeriesDetailOut(
            **TimeSeriesOut.model_validate(series).model_dump(),
            data=data,
            point_count=len(data),
        )

    async def get_metrics(self, series_id: str) -> MetricsOut:
        series = await self._repo.get_by_id(series_id)
        if not series:
            raise TimeSeriesNotFoundError(series_id)

        points = await self._repo.get_data_points(series_id)
        return _compute_metrics(series, points)

    async def list_series(self, page: int, page_size: int) -> PaginatedTimeSeriesOut:
        offset = (page - 1) * page_size
        items, total = await self._repo.list_all(offset=offset, limit=page_size)
        return PaginatedTimeSeriesOut(
            total=total,
            page=page,
            page_size=page_size,
            items=[TimeSeriesOut.model_validate(s) for s in items],
        )

    async def count(self) -> SeriesCountOut:
        total = await self._repo.count()
        return SeriesCountOut(count=total, message=f"You have {total} time series stored.")

    async def delete(self, series_id: str) -> DeleteOut:
        series = await self._repo.get_by_id(series_id)
        if not series:
            raise TimeSeriesNotFoundError(series_id)

        await self._repo.delete(series_id)
        return DeleteOut(series_id=series_id, message=f"'{series.name}' deleted successfully.")


def _compute_metrics(series: TimeSeries, points: list[DataPoint]) -> MetricsOut:
    values = np.array([p.value for p in points], dtype=np.float64)
    timestamps = np.array([p.timestamp for p in points], dtype=np.float64)

    duration = float(timestamps[-1] - timestamps[0]) if len(timestamps) > 1 else 0.0

    return MetricsOut(
        series_id=series.id,
        series_name=series.name,
        point_count=len(values),
        min=float(np.min(values)),
        max=float(np.max(values)),
        mean=float(np.mean(values)),
        std=float(np.std(values, ddof=1) if len(values) > 1 else 0.0),
        median=float(np.median(values)),
        p95=float(np.percentile(values, 95)),
        p99=float(np.percentile(values, 99)),
        rms=float(np.sqrt(np.mean(values ** 2))),
        start_timestamp=float(timestamps[0]),
        end_timestamp=float(timestamps[-1]),
        duration_seconds=duration,
    )
