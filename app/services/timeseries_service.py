import numpy as np

from app.models import TimeSeries


def calculate_metrics(
    timeseries: TimeSeries,
) -> dict[str, int | float]:
    values = timeseries.values

    return {
        "count": len(values),
        "mean": sum(values) / len(values) if values else 0,
        "min": min(values) if values else 0,
        "max": max(values) if values else 0,
    }


def predict_future_values(
    timeseries: TimeSeries,
    steps: int = 5,
) -> list[float]:
    values = timeseries.values

    if len(values) < 2:
        return values

    x = np.arange(len(values))
    y = np.array(values)

    slope, intercept = np.polyfit(x, y, 1)

    predictions: list[float] = []

    for i in range(
        len(values),
        len(values) + steps,
    ):
        prediction = slope * i + intercept

        predictions.append(
            round(float(prediction), 2)
        )

    return predictions