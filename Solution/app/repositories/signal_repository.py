import uuid

from sqlalchemy import select, func, delete, insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.infra.time_series import TimeSeries, TimeSeriesPoint

SERIES_PAGE_SIZE = 150

class SeriesRepository:
    """Repository for managing series data in the database."""
 
    @staticmethod
    async def create_series(
        db: AsyncSession,
        series: TimeSeries,
        points: list[dict]) -> TimeSeries:
        """Create a new series in the database."""

        db.add(series)
        await db.flush()  # write series row first to satisfy FK constraint
        await db.execute(
            insert(TimeSeriesPoint),
            points
        )
        await db.commit()
        await db.refresh(series)
        return series

    @staticmethod
    async def get_series_by_id(db: AsyncSession, series_id: uuid.UUID) -> TimeSeries:
        """Get a series by its id."""
        return await db.get(TimeSeries, series_id)
    
    @staticmethod
    async def get_series_count(db: AsyncSession) -> int:
        """Get the number of series stored in the server."""
        return await db.scalar(select(func.count()).select_from(TimeSeries)) or 0

    @staticmethod
    async def get_full_series_paginated(
        db: AsyncSession,
        series_id: uuid.UUID,
        offset: int = 0
    ) -> list[TimeSeriesPoint]:
        """Get a paginated list of points for a series.
        Fetches SERIES_PAGE_SIZE + 1 rows so the caller can detect
        whether there is a next page without an extra COUNT query.
        """
        result = await db.execute(
            select(TimeSeriesPoint)
            .where(TimeSeriesPoint.series_id == series_id)
            .order_by(TimeSeriesPoint.ts)
            .offset(offset)
            .limit(SERIES_PAGE_SIZE + 1)
        )
        return list(result.scalars().all())

    @staticmethod
    async def delete_series(db: AsyncSession, series_id: uuid.UUID) -> None:
        """Delete a series and its points (cascaded by the DB) by id."""
        await db.execute(delete(TimeSeries).where(TimeSeries.id == series_id))
        await db.commit()