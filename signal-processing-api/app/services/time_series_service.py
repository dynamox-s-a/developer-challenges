import statistics
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.time_series_repository import TimeSeriesRepository
from app.schemas.time_series import (
    TimeSeriesCreate,
    TimeSeriesForecastResponse,
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

    def forecast(self, series_id: UUID, steps: int) -> TimeSeriesForecastResponse:
        if steps < 1 or steps > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Steps must be between 1 and 100",
            )

        series = self.repository.find_by_id(series_id)

        if not series:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Time series not found",
            )

        ordered_points = sorted(series.points, key=lambda point: point.timestamp)
        values = [point.value for point in ordered_points]

        if len(values) < 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least two points are required to forecast",
            )

        x_values = list(range(len(values)))
        y_values = values

        x_mean = statistics.mean(x_values)
        y_mean = statistics.mean(y_values)

        numerator = sum(
            (x - x_mean) * (y - y_mean)
            for x, y in zip(x_values, y_values)
        )

        denominator = sum(
            (x - x_mean) ** 2
            for x in x_values
        )

        slope = numerator / denominator if denominator != 0 else 0
        intercept = y_mean - slope * x_mean

        forecast = []

        for step in range(1, steps + 1):
            next_x = len(values) + step - 1
            predicted_value = intercept + slope * next_x

            forecast.append(
                {
                    "step": step,
                    "predicted_value": round(predicted_value, 6),
                }
            )

        return TimeSeriesForecastResponse(
            series_id=series.id,
            steps=steps,
            forecast=forecast,
        )