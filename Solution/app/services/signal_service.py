"""Signal service module for handling signal processing logic."""
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.signal_model import CreateSeriesRequest, FullSeriesResponse, SeriesResponse
from app.repositories.signal_repository import SeriesRepository, SERIES_PAGE_SIZE
from app.sources.sources import SourcesFactory
from app.infra.time_series import TimeSeries

class SeriesService:
    """Service class for signal processing."""

    # O(n) because i need to iterate over all the points to calculate the metrics, but i can do it in one pass, so it's O(n)
    @staticmethod
    async def create_series(
        db: AsyncSession,
        payload: CreateSeriesRequest
    ) -> TimeSeries:
        """Create a new series with the given data."""

        points = []
        min_value = payload.points[0].value
        max_value = payload.points[0].value
        total = 0
        average = 0
        id=uuid.uuid4()
        name=payload.name
        source=payload.source
        unit=payload.unit
        start_ts=payload.points[0].ts
        end_ts=payload.points[-1].ts
        points_count=len(payload.points) # len is O(1) i don't need to worry
        
        # get the aceptable values for the source of the series, if there is no source, i will consider that there is no aceptable values, so all the points are aceptable
        _source = SourcesFactory.get_source(source)
        min_value_aceptable = (_source.minValueAcceptable if _source else None) or float('-inf')
        max_value_aceptable = (_source.maxValueAcceptable if _source else None) or float('inf')

        min_value_aceptable_violated_count = 0
        max_value_aceptable_violated_count = 0

        # IMPORTANT NOTE:
        # Here i pre-compute the metrics in order to avoid doing it later when the user request the data.
        # In a real implementation, i would not pre compute here, i would save the raw series in the broker,
        # and the worker would consume the serie, pre compute and save on the database.

        # i need to calculate metrics...

        for point in payload.points:
            # creates the points to be saved in the database
            points.append({
                "series_id": id,
                "ts": point.ts,
                "value": point.value,
            })
            # calculate some metrics here (max and min)
            if point.value < min_value:
                min_value = point.value
            if point.value > max_value:
                max_value = point.value
            total += point.value

            # check points that are not acceptable
            if point.value < min_value_aceptable:
                min_value_aceptable_violated_count += 1
            if point.value > max_value_aceptable:
                max_value_aceptable_violated_count += 1

            # if there is any violation of the acceptable values, we need to send a request to the alerting system
                # Send request http to microsservice (alerting system), but for now, just print a message,
                # Considering that this is a worker, and in this case not working sincronously like in this API EXAMPLE...
                # For better performance i would send all the points that are not acceptable in the batch, only 1 request...
                # for convinience i will not print failled points during the API EXAMPLE...

        average = total / len(payload.points)

        # fill the series with params and the metrics calculated
        series = TimeSeries(
            id=id,
            name=name,
            source=source,
            unit=unit,
            start_ts=start_ts,
            end_ts=end_ts,
            points_count=points_count,
            min_value=min_value,
            max_value=max_value,
            average=average,
            min_value_aceptable_violated_count=min_value_aceptable_violated_count,
            max_value_aceptable_violated_count=max_value_aceptable_violated_count
        )

        # Populates database via repository with data and returns the created series with metrics
        return await SeriesRepository.create_series(db, series, points)
    
    @staticmethod
    async def get_metrics(db: AsyncSession, series_id: uuid.UUID) -> TimeSeries | None:
        """Get the metrics of a series by its id. Returns None if not found."""
        return await SeriesRepository.get_series_by_id(db, series_id)
    
    @staticmethod
    async def get_series_count(db: AsyncSession) -> int:
        """Get the number of series stored in the server."""
        return await SeriesRepository.get_series_count(db)

    @staticmethod
    async def get_full_series_paginated(
        db: AsyncSession,
        series_id: uuid.UUID,
        offset: int = 0
    ) -> tuple:
        """Get a paginated chunk of points for a series.

        Returns a tuple (data, has_more, next_offset) where:
          - data: list of TimeSeriesPoint for the current page
          - has_more: True if there are more points beyond this page
          - next_offset: the offset to use in the next request, or None
        """
        rows = await SeriesRepository.get_full_series_paginated(db, series_id, offset)

        has_more = len(rows) > SERIES_PAGE_SIZE
        data = rows[:SERIES_PAGE_SIZE]
        next_offset = offset + SERIES_PAGE_SIZE if has_more else None

        return data, has_more, next_offset

    @staticmethod
    async def delete_series(db: AsyncSession, series_id: uuid.UUID) -> None:
        """Delete a series by its id."""
        await SeriesRepository.delete_series(db, series_id)