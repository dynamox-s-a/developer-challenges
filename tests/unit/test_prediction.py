import pytest
import numpy as np
from unittest.mock import MagicMock

from app.models.timeseries import TimeSeries, DataPoint
from app.services.prediction_service import PredictionService


def mock_series():
    s = MagicMock(spec=TimeSeries)
    s.id = "abc"
    s.name = "motor-01"
    return s


def make_points(values: list[float], interval: float = 1.0) -> list[MagicMock]:
    return [
        MagicMock(spec=DataPoint, timestamp=float(i) * interval, value=v)
        for i, v in enumerate(values)
    ]


# --- linear ---

def test_linear_correct_steps():
    result = PredictionService.predict(mock_series(), make_points(list(range(20))), steps=5, method="linear")
    assert len(result.predictions) == 5
    assert result.method_used == "linear"


def test_linear_extrapolates_trend():
    # y = x, so after 10 points the next ones should be ~10, 11, 12
    points = make_points([float(i) for i in range(10)])
    result = PredictionService.predict(mock_series(), points, steps=3, method="linear")

    for k, pred in enumerate(result.predictions, start=10):
        assert pred.value == pytest.approx(k, abs=0.2)


def test_linear_confidence_intervals():
    points = make_points([i * 0.5 for i in range(20)])
    result = PredictionService.predict(mock_series(), points, steps=5, method="linear")

    assert result.confidence_lower is not None
    assert result.confidence_upper is not None
    for pred, lo, hi in zip(result.predictions, result.confidence_lower, result.confidence_upper):
        assert hi.value >= pred.value >= lo.value


# --- holt winters ---

def test_holt_winters_steps():
    points = make_points([0.5 + 0.02 * i for i in range(30)])
    result = PredictionService.predict(mock_series(), points, steps=10, method="holt_winters")
    assert len(result.predictions) == 10


def test_holt_winters_has_confidence():
    points = make_points([1.0 + 0.01 * i for i in range(30)])
    result = PredictionService.predict(mock_series(), points, steps=5, method="holt_winters")
    assert result.confidence_lower is not None


# --- auto ---

def test_auto_returns_valid_output():
    values = [0.4 + 0.05 * i + 0.1 * (i % 5) for i in range(50)]
    result = PredictionService.predict(mock_series(), make_points(values), steps=10, method="auto")

    assert result.steps == 10
    assert result.method_used in ("linear", "holt_winters")
    assert all(isinstance(p.value, float) for p in result.predictions)


# --- timestamps ---

def test_predictions_start_after_last_known():
    points = make_points(list(range(20)), interval=1.0)
    result = PredictionService.predict(mock_series(), points, steps=5, method="linear")

    last_known_ts = points[-1].timestamp
    assert result.predictions[0].timestamp > last_known_ts


def test_predictions_evenly_spaced():
    points = make_points(list(range(20)), interval=2.0)
    result = PredictionService.predict(mock_series(), points, steps=5, method="linear")

    ts = [p.timestamp for p in result.predictions]
    gaps = [ts[i + 1] - ts[i] for i in range(len(ts) - 1)]
    assert all(abs(g - 2.0) < 0.01 for g in gaps)


# --- edge cases ---

def test_raises_with_single_point():
    with pytest.raises(ValueError, match="at least 2"):
        PredictionService.predict(mock_series(), make_points([1.0]), steps=5, method="linear")


def test_noisy_signal_doesnt_crash():
    rng = np.random.default_rng(42)
    values = list(rng.normal(loc=1.0, scale=0.5, size=50))
    result = PredictionService.predict(mock_series(), make_points(values), steps=10, method="auto")
    assert len(result.predictions) == 10
