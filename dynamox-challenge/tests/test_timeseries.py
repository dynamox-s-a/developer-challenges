"""Integration and unit tests for the time series API.

Naming convention: test_<action>_<scenario>
  e.g. test_create_timeseries_success
       test_create_timeseries_with_empty_data
       test_get_timeseries_with_not_found_error

Each test follows the Arrange / Act / Assert pattern:
  - expected_* variables are set upfront  (Arrange)
  - one HTTP call is made                 (Act)
  - status code and body are asserted     (Assert)

Requirements:
  - docker-compose up -d db   (TimescaleDB must be running)
  - pytest tests/ -v
"""
from http import HTTPStatus
from unittest.mock import patch

from fastapi.testclient import TestClient
import pytest

from app.services.timeseries_service import TimeseriesService
from tests.fixtures.sample_data import (
    EXPECTED_METRICS_5_POINTS,
    INVALID_PAYLOAD_DUPLICATE_TIMESTAMPS,
    INVALID_PAYLOAD_EMPTY_DATA,
    INVALID_PAYLOAD_MISSING_DATA,
    VALID_PAYLOAD_1_POINT,
    VALID_PAYLOAD_5_POINTS,
    VALID_PAYLOAD_NO_METADATA,
    VALID_PAYLOAD_NO_NAME,
    expected_stddev,
    make_create_payload,
)

# ===========================================================================
# Health check
# ===========================================================================


def test_health_check_returns_ok(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {"status": "ok"}


# ===========================================================================
# POST /api/v1/timeseries
# ===========================================================================


def test_create_timeseries_success(client: TestClient) -> None:
    expected_name = VALID_PAYLOAD_5_POINTS["name"]
    expected_count = len(VALID_PAYLOAD_5_POINTS["data"])

    response = client.post("/api/v1/timeseries", json=VALID_PAYLOAD_5_POINTS)
    body = response.json()

    assert response.status_code == HTTPStatus.CREATED
    assert body["name"] == expected_name
    assert body["data_points_count"] == expected_count
    assert "id" in body
    assert "created_at" in body
    assert body["time_range_start"] is not None
    assert body["time_range_end"] is not None


def test_create_timeseries_without_name(client: TestClient) -> None:
    response = client.post("/api/v1/timeseries", json=VALID_PAYLOAD_NO_NAME)
    body = response.json()

    assert response.status_code == HTTPStatus.CREATED
    assert body["name"] is None
    assert "id" in body


def test_create_timeseries_without_metadata(client: TestClient) -> None:
    response = client.post("/api/v1/timeseries", json=VALID_PAYLOAD_NO_METADATA)

    assert response.status_code == HTTPStatus.CREATED
    assert "id" in response.json()


def test_create_timeseries_with_single_point(client: TestClient) -> None:
    response = client.post("/api/v1/timeseries", json=VALID_PAYLOAD_1_POINT)
    body = response.json()

    assert response.status_code == HTTPStatus.CREATED
    assert body["data_points_count"] == 1


@pytest.mark.parametrize(
    ("invalid_payload", "expected_error"),
    [
        (INVALID_PAYLOAD_EMPTY_DATA, "VALIDATION_ERROR"),
        (INVALID_PAYLOAD_DUPLICATE_TIMESTAMPS, "VALIDATION_ERROR"),
        (INVALID_PAYLOAD_MISSING_DATA, "VALIDATION_ERROR"),
    ],
    ids=["empty_data", "duplicate_timestamps", "missing_data_field"],
)
def test_create_timeseries_with_invalid_payload(
    client: TestClient,
    invalid_payload: dict,
    expected_error: str,
) -> None:
    response = client.post("/api/v1/timeseries", json=invalid_payload)
    body = response.json()

    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY
    assert body["error"] == expected_error
    assert "message" in body


def test_create_timeseries_with_too_many_points(client: TestClient) -> None:
    small_limit = 3
    oversized_payload = make_create_payload(n=small_limit + 1)

    with patch.object(TimeseriesService, "MAX_DATA_POINTS", small_limit):
        response = client.post("/api/v1/timeseries", json=oversized_payload)
    body = response.json()

    assert response.status_code == HTTPStatus.REQUEST_ENTITY_TOO_LARGE
    assert body["error"] == "TIMESERIES_PAYLOAD_TOO_LARGE"


# ===========================================================================
# GET /api/v1/timeseries/count
# ===========================================================================


def test_get_count_when_empty(client: TestClient) -> None:
    response = client.get("/api/v1/timeseries/count")

    assert response.status_code == HTTPStatus.OK
    assert response.json()["count"] == 0


def test_get_count_with_data(client: TestClient) -> None:
    client.post("/api/v1/timeseries", json=make_create_payload(n=2, name="s1"))
    client.post(
        "/api/v1/timeseries", json=make_create_payload(n=2, name="s2", start_offset=10)
    )

    response = client.get("/api/v1/timeseries/count")

    assert response.status_code == HTTPStatus.OK
    assert response.json()["count"] == 2


# ===========================================================================
# GET /api/v1/timeseries/{id}
# ===========================================================================


def test_get_timeseries_success(
    client: TestClient,
    created_timeseries_id: str,
) -> None:
    expected_count = len(VALID_PAYLOAD_5_POINTS["data"])

    response = client.get(f"/api/v1/timeseries/{created_timeseries_id}")
    body = response.json()

    assert response.status_code == HTTPStatus.OK
    assert body["id"] == created_timeseries_id
    assert body["data_points_count"] == expected_count
    assert len(body["data"]) == expected_count
    assert body["time_range_start"] is not None
    assert body["time_range_end"] is not None


def test_get_timeseries_with_not_found_error(client: TestClient) -> None:
    non_existent_id = "00000000-0000-0000-0000-000000000000"

    response = client.get(f"/api/v1/timeseries/{non_existent_id}")
    body = response.json()

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert body["error"] == "TIMESERIES_NOT_FOUND"


def test_get_timeseries_with_pagination(
    client: TestClient,
    created_timeseries_id: str,
) -> None:
    response = client.get(
        f"/api/v1/timeseries/{created_timeseries_id}",
        params={"limit": 2, "offset": 1},
    )
    body = response.json()

    assert response.status_code == HTTPStatus.OK
    assert len(body["data"]) == 2


def test_get_timeseries_with_offset_beyond_data(
    client: TestClient,
    created_timeseries_id: str,
) -> None:
    response = client.get(
        f"/api/v1/timeseries/{created_timeseries_id}",
        params={"limit": 10, "offset": 999},
    )
    body = response.json()

    assert response.status_code == HTTPStatus.OK
    assert len(body["data"]) == 0


# ===========================================================================
# GET /api/v1/timeseries/{id}/metrics
# ===========================================================================


def test_get_metrics_success(
    client: TestClient,
    created_timeseries_id: str,
) -> None:
    response = client.get(f"/api/v1/timeseries/{created_timeseries_id}/metrics")
    body = response.json()

    assert response.status_code == HTTPStatus.OK
    assert body["series_id"] == created_timeseries_id
    assert body["count"] == EXPECTED_METRICS_5_POINTS["count"]
    assert body["min"] == pytest.approx(EXPECTED_METRICS_5_POINTS["min"])
    assert body["max"] == pytest.approx(EXPECTED_METRICS_5_POINTS["max"])
    assert body["mean"] == pytest.approx(EXPECTED_METRICS_5_POINTS["mean"])
    assert body["stddev"] == pytest.approx(
        EXPECTED_METRICS_5_POINTS["stddev"], rel=1e-4
    )


def test_get_metrics_with_not_found_error(client: TestClient) -> None:
    non_existent_id = "00000000-0000-0000-0000-000000000000"

    response = client.get(f"/api/v1/timeseries/{non_existent_id}/metrics")
    body = response.json()

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert body["error"] == "TIMESERIES_NOT_FOUND"


# ===========================================================================
# DELETE /api/v1/timeseries/{id}
# ===========================================================================


def test_delete_timeseries_success(
    client: TestClient,
    created_timeseries_id: str,
) -> None:
    response = client.delete(f"/api/v1/timeseries/{created_timeseries_id}")

    assert response.status_code == HTTPStatus.NO_CONTENT


def test_delete_timeseries_with_not_found_error(client: TestClient) -> None:
    non_existent_id = "00000000-0000-0000-0000-000000000000"

    response = client.delete(f"/api/v1/timeseries/{non_existent_id}")
    body = response.json()

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert body["error"] == "TIMESERIES_NOT_FOUND"


def test_delete_timeseries_verify_data_is_gone(
    client: TestClient,
    created_timeseries_id: str,
) -> None:
    client.delete(f"/api/v1/timeseries/{created_timeseries_id}")

    get_response = client.get(f"/api/v1/timeseries/{created_timeseries_id}")

    assert get_response.status_code == HTTPStatus.NOT_FOUND


def test_delete_timeseries_reduces_count(
    client: TestClient,
    created_timeseries_id: str,
) -> None:
    count_before = client.get("/api/v1/timeseries/count").json()["count"]

    client.delete(f"/api/v1/timeseries/{created_timeseries_id}")

    count_after = client.get("/api/v1/timeseries/count").json()["count"]
    assert count_after == count_before - 1


# ===========================================================================
# Unit tests — pure Python, no database or HTTP
# ===========================================================================


def test_expected_stddev_calculation() -> None:
    values = [1.0, 2.0, 3.0, 4.0, 5.0]

    result = expected_stddev(values)

    assert result == pytest.approx(1.5811388300841898, rel=1e-6)


def test_expected_stddev_with_two_values() -> None:
    values = [0.0, 2.0]

    result = expected_stddev(values)

    assert result == pytest.approx(1.4142135623730951, rel=1e-6)
