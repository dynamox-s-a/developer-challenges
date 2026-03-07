import pytest

"""
Timeseries Metrics
"""


def test_timeseries_metrics_basic(client):
    ts = client.post("/timeseries/", json={"label": "metrics-ts"}).json()

    payload = {
        "points": [
            {"timestamp": "2026-01-01T22:00:00Z", "value": 1},
            {"timestamp": "2026-01-01T22:00:01Z", "value": 2},
            {"timestamp": "2026-01-01T22:00:02Z", "value": 3},
        ]
    }

    client.post(f"/timeseries/{ts['id']}/points", json=payload)
    response = client.get(f"/timeseries/{ts['id']}/metrics")

    assert response.status_code == 200
    data = response.json()

    assert data["count"] == 3
    assert data["min"] == 1
    assert data["max"] == 3
    assert data["avg"] == 2
    assert data["p50"] == 2
    assert data["start"] == "2026-01-01T22:00:00Z"
    assert data["end"] == "2026-01-01T22:00:02Z"
    assert data["stddev"] == pytest.approx(0.81649658, rel=1e-6)


def test_timeseries_metrics_with_time_window(client):
    ts = client.post("/timeseries/", json={"label": "metrics-ts"}).json()

    payload = {
        "points": [
            {"timestamp": "2026-01-01T22:00:00Z", "value": 1},
            {"timestamp": "2026-01-01T22:00:01Z", "value": 2},
            {"timestamp": "2026-01-01T22:00:02Z", "value": 3},
            {"timestamp": "2026-01-01T22:00:03Z", "value": 4},
        ]
    }

    client.post(f"/timeseries/{ts['id']}/points", json=payload)

    response = client.get(
        f"/timeseries/{ts['id']}/metrics"
        "?from_ts=2026-01-01T22:00:01Z&to_ts=2026-01-01T22:00:02Z"
    )

    assert response.status_code == 200
    data = response.json()

    assert data["count"] == 2
    assert data["min"] == 2
    assert data["max"] == 3
    assert data["avg"] == 2.5


def test_timeseries_metrics_empty_series(client):
    ts = client.post("/timeseries/", json={"label": "metrics-ts"}).json()

    response = client.get(f"/timeseries/{ts['id']}/metrics")

    assert response.status_code == 200
    data = response.json()

    assert data["count"] == 0
    assert data["min"] is None
    assert data["max"] is None
    assert data["avg"] is None
    assert data["stddev"] is None
    assert data["p50"] is None
    assert data["p95"] is None
    assert data["start"] is None
    assert data["end"] is None


def test_timeseries_metrics_single_point(client):
    ts = client.post("/timeseries/", json={"label": "metrics-ts"}).json()

    payload = {
        "points": [
            {"timestamp": "2026-01-01T22:00:00Z", "value": 10},
        ]
    }

    client.post(f"/timeseries/{ts['id']}/points", json=payload)
    response = client.get(f"/timeseries/{ts['id']}/metrics")

    assert response.status_code == 200
    data = response.json()

    assert data["count"] == 1
    assert data["min"] == 10
    assert data["max"] == 10
    assert data["avg"] == 10
    assert data["p50"] == 10


def test_get_metrics_not_found(client):
    response = client.get("/timeseries/00000000-0000-0000-0000-000000000000/metrics")
    assert response.status_code == 404


def test_timeseries_metrics_invalid_time_window(client):
    ts = client.post("/timeseries/", json={"label": "metrics-ts"}).json()

    response = client.get(
        f"/timeseries/{ts['id']}/metrics"
        "?from_ts=2026-01-01T22:00:03Z&to_ts=2026-01-01T22:00:01Z"
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "from_ts must be <= to_ts"