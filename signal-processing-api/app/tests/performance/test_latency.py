import time

import pytest


pytestmark = pytest.mark.performance

MAX_LATENCY_SECONDS = 0.350


def assert_latency_under_350ms(start_time):
    elapsed = time.perf_counter() - start_time
    assert elapsed < MAX_LATENCY_SECONDS, f"Request took {elapsed:.4f}s"


def create_time_series(client, serial_device="DEV-PERF"):
    response = client.post("/raw_data", json={
        "serial_device": serial_device,
        "data": [
            {"timestamp": "2026-05-18T10:00:00Z", "value": 10.0},
            {"timestamp": "2026-05-18T10:01:00Z", "value": 20.0},
            {"timestamp": "2026-05-18T10:02:00Z", "value": 30.0}
        ]
    })
    assert response.status_code == 200
    return response.json()["device_id"]


def test_create_raw_data_latency(client):
    payload = {
        "serial_device": "DEV-PERF-POST",
        "data": [
            {"timestamp": "2026-05-18T10:00:00Z", "value": 10.0},
            {"timestamp": "2026-05-18T10:01:00Z", "value": 20.0}
        ]
    }

    start = time.perf_counter()
    response = client.post("/raw_data", json=payload)
    assert_latency_under_350ms(start)

    assert response.status_code == 200


def test_get_metrics_latency(client):
    device_id = create_time_series(client, "DEV-PERF-METRICS")

    start = time.perf_counter()
    response = client.get(f"/raw_data/{device_id}/metrics")
    assert_latency_under_350ms(start)

    assert response.status_code == 200


def test_get_device_raw_data_latency(client):
    device_id = create_time_series(client, "DEV-PERF-RAW")

    start = time.perf_counter()
    response = client.get(f"/devices/{device_id}/raw-data?limit=100&offset=0")
    assert_latency_under_350ms(start)

    assert response.status_code == 200


def test_get_active_devices_count_latency(client):
    create_time_series(client, "DEV-PERF-COUNT")

    start = time.perf_counter()
    response = client.get("/devices/count/active")
    assert_latency_under_350ms(start)

    assert response.status_code == 200


def test_delete_raw_data_latency(client):
    device_id = create_time_series(client, "DEV-PERF-DELETE")

    start = time.perf_counter()
    response = client.delete(f"/raw_data/{device_id}")
    assert_latency_under_350ms(start)

    assert response.status_code == 200
