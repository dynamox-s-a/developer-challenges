import numpy as np
from app.enums.messages import TimeSeriesMessage
from app.models.models import TimeSeries
from app.schemas.responses import PredictedPoint, TimeSeriesPrediction


def predict_linear(series: TimeSeries, steps: int = 10) -> TimeSeriesPrediction:
    if len(series.points) < 2:
        raise ValueError(TimeSeriesMessage.INSUFFICIENT_POINTS)

    values = np.array([p.value for p in series.points])
    x = np.arange(len(values))

    # Regressão linear: y = a*x + b
    coeffs = np.polyfit(x, values, deg=1)
    poly = np.poly1d(coeffs)

    # Predizer os próximos `steps` pontos
    future_x = np.arange(len(values), len(values) + steps)
    predicted = poly(future_x)

    return TimeSeriesPrediction(
        series_id=series.id,
        method="linear_regression",
        steps=steps,
        predicted_points=[
            PredictedPoint(step=i + 1, value=round(float(v), 6))
            for i, v in enumerate(predicted)
        ],
    )