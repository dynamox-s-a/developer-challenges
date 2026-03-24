import numpy as np
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.holtwinters import ExponentialSmoothing


def predict_values(values: list[float], steps: int) -> list[float]:
    if len(values) < int(2):
        raise ValueError('Need at least 2 data points for prediction')

    try:
        model = ExponentialSmoothing(values, trend='add', seasonal=None)
        fitted = model.fit()
        predictions = fitted.forecast(steps).tolist()

    except Exception:
        predictions = linear_regression_predict(values, steps)

    return [round(p, 2) for p in predictions]


def linear_regression_predict(values: list[float], steps: int) -> list[float]:
    X = np.array(range(len(values))).reshape(-1, 1)
    y = np.array(values)

    model = LinearRegression()
    model.fit(X, y)

    future_X = np.array(range(len(values), len(values) + steps)).reshape(-1, 1)
    return model.predict(future_X).tolist()
