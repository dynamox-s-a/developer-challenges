import numpy as np

from app.models import TimeSeries


def calculate_metrics(
        timeseries: TimeSeries,
):
    values = timeseries.values

    return {
        "count": len(values),
        "min": min(values),
        "max": max(values),
        "mean": sum(values) / len(values),
    }

def predict_future_values(
    timeseries: TimeSeries,
    steps: int = 3,
):
    values = timeseries.values

    x = np.arange(len(values))
    y = np.array(values)

    slope, intercept = np.polyfit(x, y, 1)

    predictions = []

    for i in range(
        len(values),
        len(values) + steps,
    ):
        prediction = slope * i + intercept

        predictions.append(
            round(float(prediction), 2)
        )

    return predictions