from fastapi import HTTPException
from fastapi import status
from app.enums.messages import TimeSeriesMessage
from app.models.models import TimeSeries
from app.repositories.time_series import TimeSeriesRepository


async def get_series_or_404(series_id: str) -> TimeSeries:
    repo = TimeSeriesRepository()
    series = await repo.get_by_id(series_id)
    if not series:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=TimeSeriesMessage.NOT_FOUND)
    return series