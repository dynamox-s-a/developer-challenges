import numpy as np
from app.models.models import TimeSeries
from app.schemas.responses import TimeSeriesMetrics


def calculate_metrics(series: TimeSeries) -> TimeSeriesMetrics:
    if not series.points:
        raise ValueError("Série sem pontos para calcular métricas")

    values = np.array([p.value for p in series.points])

    return TimeSeriesMetrics(
        series_id=series.id,
        count=len(values),
        min=float(np.min(values)),
        max=float(np.max(values)),
        mean=float(np.mean(values)),
        median=float(np.median(values)),
        std=float(np.std(values)),
        range=float(np.max(values) - np.min(values)),
    )