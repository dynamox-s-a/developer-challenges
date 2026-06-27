from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_create_time_series():
    payload = {
        "asset_name": "motor-bomba-01",
        "sensor_name": "sensor-vibracao-01",
        "signal_type": "vibration",
        "unit": "mm/s",
        "data": [
            {
                "timestamp": "2026-06-27T12:00:00",
                "value": 2.4,
            },
            {
                "timestamp": "2026-06-27T12:00:01",
                "value": 2.7,
            },
            {
                "timestamp": "2026-06-27T12:00:02",
                "value": 3.1,
            },
        ],
    }

    response = client.post("/api/v1/time-series", json=payload)

    assert response.status_code == 201
    assert "id" in response.json()
    assert response.json()["message"] == "Time series created successfully"


def test_get_all_time_series():
    response = client.get("/api/v1/time-series")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_count_time_series():
    response = client.get("/api/v1/time-series/count")

    assert response.status_code == 200
    assert "count" in response.json()
    assert isinstance(response.json()["count"], int)


def test_get_time_series_by_id_and_metrics():
    payload = {
        "asset_name": "redutor-02",
        "sensor_name": "sensor-temperatura-01",
        "signal_type": "temperature",
        "unit": "celsius",
        "data": [
            {
                "timestamp": "2026-06-27T12:00:00",
                "value": 30.0,
            },
            {
                "timestamp": "2026-06-27T12:00:01",
                "value": 35.0,
            },
            {
                "timestamp": "2026-06-27T12:00:02",
                "value": 40.0,
            },
        ],
    }

    create_response = client.post("/api/v1/time-series", json=payload)

    assert create_response.status_code == 201

    series_id = create_response.json()["id"]

    get_response = client.get(f"/api/v1/time-series/{series_id}")

    assert get_response.status_code == 200
    assert get_response.json()["id"] == series_id
    assert get_response.json()["asset_name"] == "redutor-02"
    assert get_response.json()["sensor_name"] == "sensor-temperatura-01"
    assert get_response.json()["signal_type"] == "temperature"
    assert get_response.json()["unit"] == "celsius"
    assert len(get_response.json()["data"]) == 3

    metrics_response = client.get(f"/api/v1/time-series/{series_id}/metrics")

    assert metrics_response.status_code == 200

    metrics = metrics_response.json()

    assert metrics["count"] == 3
    assert metrics["min"] == 30.0
    assert metrics["max"] == 40.0
    assert metrics["mean"] == 35.0
    assert metrics["median"] == 35.0


def test_delete_time_series():
    payload = {
        "asset_name": "esteira-03",
        "sensor_name": "sensor-corrente-01",
        "signal_type": "current",
        "unit": "ampere",
        "data": [
            {
                "timestamp": "2026-06-27T12:00:00",
                "value": 10.0,
            }
        ],
    }

    create_response = client.post("/api/v1/time-series", json=payload)

    assert create_response.status_code == 201

    series_id = create_response.json()["id"]

    delete_response = client.delete(f"/api/v1/time-series/{series_id}")

    assert delete_response.status_code == 204

    get_response = client.get(f"/api/v1/time-series/{series_id}")

    assert get_response.status_code == 404


def test_forecast_time_series():
    payload = {
        "asset_name": "motor-linear-trend",
        "sensor_name": "sensor-vibracao-02",
        "signal_type": "vibration",
        "unit": "mm/s",
        "data": [
            {
                "timestamp": "2026-06-27T12:00:00",
                "value": 10.0,
            },
            {
                "timestamp": "2026-06-27T12:00:01",
                "value": 20.0,
            },
            {
                "timestamp": "2026-06-27T12:00:02",
                "value": 30.0,
            },
        ],
    }

    create_response = client.post("/api/v1/time-series", json=payload)

    assert create_response.status_code == 201

    series_id = create_response.json()["id"]

    forecast_response = client.get(
        f"/api/v1/time-series/{series_id}/forecast?steps=2"
    )

    assert forecast_response.status_code == 200

    body = forecast_response.json()

    assert body["series_id"] == series_id
    assert body["steps"] == 2
    assert len(body["forecast"]) == 2

    assert body["forecast"][0]["step"] == 1
    assert body["forecast"][0]["predicted_value"] == 40.0

    assert body["forecast"][1]["step"] == 2
    assert body["forecast"][1]["predicted_value"] == 50.0
    
def test_append_points_to_time_series():
    payload = {
        "asset_name": "compressor-01",
        "sensor_name": "sensor-vibracao-03",
        "signal_type": "vibration",
        "unit": "mm/s",
        "data": [
            {
                "timestamp": "2026-06-27T12:00:00",
                "value": 1.0,
            }
        ],
    }

    create_response = client.post("/api/v1/time-series", json=payload)

    assert create_response.status_code == 201

    series_id = create_response.json()["id"]

    append_payload = {
        "data": [
            {
                "timestamp": "2026-06-27T12:00:01",
                "value": 1.5,
            },
            {
                "timestamp": "2026-06-27T12:00:02",
                "value": 2.0,
            },
        ]
    }

    append_response = client.post(
        f"/api/v1/time-series/{series_id}/points",
        json=append_payload,
    )

    assert append_response.status_code == 201

    append_body = append_response.json()

    assert append_body["series_id"] == series_id
    assert append_body["inserted_points"] == 2
    assert append_body["message"] == "Points appended successfully"

    get_response = client.get(f"/api/v1/time-series/{series_id}")

    assert get_response.status_code == 200
    assert len(get_response.json()["data"]) == 3