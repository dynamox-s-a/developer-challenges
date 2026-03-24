from sqlalchemy import select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.timeseries import TimeSeries, DataPoint
from app.schemas.timeseries import TimeSeriesCreate


class TimeSeriesRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._db = session

    async def create(self, payload: TimeSeriesCreate) -> TimeSeries:
        series = TimeSeries(
            name=payload.name,
            description=payload.description,
            unit=payload.unit,
        )
        self._db.add(series)
        await self._db.flush()

        # bulk insert is noticeably faster than adding one by one
        points = [
            DataPoint(series_id=series.id, timestamp=dp.timestamp, value=dp.value)
            for dp in payload.data
        ]
        self._db.add_all(points)
        await self._db.flush()
        await self._db.refresh(series)
        return series

    async def get_by_id(self, series_id: str) -> TimeSeries | None:
        result = await self._db.execute(
            select(TimeSeries).where(TimeSeries.id == series_id)
        )
        return result.scalar_one_or_none()

    async def get_by_id_with_data(self, series_id: str) -> TimeSeries | None:
        result = await self._db.execute(
            select(TimeSeries)
            .options(selectinload(TimeSeries.data_points))
            .where(TimeSeries.id == series_id)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> TimeSeries | None:
        result = await self._db.execute(
            select(TimeSeries).where(TimeSeries.name == name)
        )
        return result.scalar_one_or_none()

    async def list_all(self, offset: int, limit: int) -> tuple[list[TimeSeries], int]:
        total = await self._db.scalar(select(func.count()).select_from(TimeSeries))
        rows = await self._db.execute(
            select(TimeSeries).order_by(TimeSeries.created_at.desc()).offset(offset).limit(limit)
        )
        return rows.scalars().all(), total

    async def delete(self, series_id: str) -> bool:
        result = await self._db.execute(
            delete(TimeSeries).where(TimeSeries.id == series_id)
        )
        return result.rowcount > 0

    async def count(self) -> int:
        return await self._db.scalar(select(func.count()).select_from(TimeSeries))

    async def get_data_points(self, series_id: str) -> list[DataPoint]:
        result = await self._db.execute(
            select(DataPoint)
            .where(DataPoint.series_id == series_id)
            .order_by(DataPoint.timestamp)
        )
        return result.scalars().all()
