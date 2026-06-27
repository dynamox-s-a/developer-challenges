import statistics
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.time_series_repository import TimeSeriesRepository
from app.schemas.time_series import (
    TimeSeriesCreate,
    TimeSeriesMetricsResponse,
    TimeSeriesResponse,
    TimeSeriesSummaryResponse,
)


class TimeSeriesService:
    def __init__(self, db: Session):
        self.repository = TimeSeriesRepository(db)

    def create(self, payload: TimeSeriesCreate):
        return self.repository.create(payload)

    def get_all(self) -> list[TimeSeriesSummaryResponse]:
        series_list = self.repository.find_all()

        return [
            TimeSeriesSummaryResponse(
                id=series.id,
                name=series.name,
                created_at=series.created_at,
                points_count=len(series.points),
            )
            for series in series_list
        ]

    def get_by_id(self, series_id: UUID) -> TimeSeriesResponse:
        series = self.repository.find_by_id(series_id)

        if not series:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Time series not found",
            )

        ordered_points = sorted(series.points, key=lambda point: point.timestamp)

        return TimeSeriesResponse(
            id=series.id,
            name=series.name,
            created_at=series.created_at,
            data=[
                {
                    "timestamp": point.timestamp,
                    "value": point.value,
                }
                for point in ordered_points
            ],
        )

    def count(self) -> int:
        return self.repository.count()

    def delete(self, series_id: UUID) -> None:
        series = self.repository.find_by_id(series_id)

        if not series:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Time series not found",
            )

        self.repository.delete(series)

    def get_metrics(self, series_id: UUID) -> TimeSeriesMetricsResponse:
        series = self.repository.find_by_id(series_id)

        if not series:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Time series not found",
            )

        values = [point.value for point in series.points]

        if not values:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Time series has no points",
            )

        return TimeSeriesMetricsResponse(
            count=len(values),
            min=min(values),
            max=max(values),
            mean=statistics.mean(values),
            median=statistics.median(values),
            std=statistics.stdev(values) if len(values) > 1 else None,
        )