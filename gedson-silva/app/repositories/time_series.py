from app.models.models import TimeSeries, DataPoint
from app.schemas.requests import TimeSeriesCreate


class TimeSeriesRepository:

    async def create(self, data: TimeSeriesCreate) -> TimeSeries:
        series = await TimeSeries.create(name=data.name)
        await DataPoint.bulk_create([
            DataPoint(series=series, timestamp=p.timestamp, value=p.value)
            for p in data.points
        ])
        await series.fetch_related("points")
        return series

    async def get_by_id(self, series_id: str) -> TimeSeries | None:
        return await TimeSeries.get_or_none(id=series_id).prefetch_related("points")

    async def delete(self, series: TimeSeries) -> None:
        await series.delete()

    async def count(self) -> int:
        return await TimeSeries.all().count()