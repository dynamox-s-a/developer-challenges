import pytest

from app.services.prediction import linear_regression_predict, predict_values


def test_predict_with_linear_trend():
    values = [10.0, 20.0, 30.0, 40.0]
    steps = 3

    predictions = predict_values(values, steps)

    assert len(predictions) == steps
    assert predictions[0] == pytest.approx(50.0, rel=0.1)
    assert predictions[1] == pytest.approx(60.0, rel=0.1)
    assert predictions[2] == pytest.approx(70.0, rel=0.1)


def test_predict_with_constant_values():
    values = [25.0, 25.0, 25.0, 25.0]
    steps = int(2)

    predictions = predict_values(values, steps)

    assert len(predictions) == steps
    assert predictions[0] == pytest.approx(25.0, rel=0.1)
    assert predictions[1] == pytest.approx(25.0, rel=0.1)


def test_predict_with_minimum_data_points():
    values = [10.0, 20.0]
    steps = int(1)

    predictions = predict_values(values, steps)

    assert len(predictions) == steps
    assert predictions[0] == pytest.approx(30.0, rel=0.1)


def test_predict_raises_error_with_insufficient_data():
    values = [10.0]
    steps = int(1)

    with pytest.raises(ValueError, match='Need at least 2 data points'):
        predict_values(values, steps)


def test_predict_raises_error_with_empty_list():
    values = []
    steps = int(1)

    with pytest.raises(ValueError, match='Need at least 2 data points'):
        predict_values(values, steps)


def test_predict_returns_rounded_values():
    values = [10.0, 20.0, 30.0, 40.0]
    steps = int(2)

    predictions = predict_values(values, steps)

    for pred in predictions:
        assert pred == round(pred, 2)


def test_linear_regression_with_perfect_trend():
    values = [0.0, 10.0, 20.0, 30.0]
    steps = int(2)

    predictions = linear_regression_predict(values, steps)

    assert len(predictions) == steps
    assert predictions[0] == pytest.approx(40.0, rel=0.01)
    assert predictions[1] == pytest.approx(50.0, rel=0.01)


def test_linear_regression_with_negative_trend():
    values = [100.0, 90.0, 80.0, 70.0]
    steps = int(2)

    predictions = linear_regression_predict(values, steps)

    assert predictions[0] == pytest.approx(60.0, rel=0.01)
    assert predictions[1] == pytest.approx(50.0, rel=0.01)


def test_linear_regression_single_step():
    values = [5.0, 10.0, 15.0]
    steps = int(1)

    predictions = linear_regression_predict(values, steps)

    assert len(predictions) == int(1)
    assert predictions[0] == pytest.approx(20.0, rel=0.01)
