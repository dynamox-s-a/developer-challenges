from fastapi.testclient import TestClient
import pytest


def test_health_check(client: TestClient):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok"
    }


def test_create_timeseries(client: TestClient):
    response = client.post(
        "/timeseries",
        json={
            "values": [10, 20, 30]
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert isinstance(data["id"], str)


def test_create_timeseries_invalid_payload(
    client: TestClient,
):
    response = client.post(
        "/timeseries",
        json={}
    )

    assert response.status_code == 422


def test_create_timeseries_empty_values(
    client: TestClient,
):
    response = client.post(
        "/timeseries",
        json={
            "values": []
        }
    )

    assert response.status_code == 422


def test_count_timeseries(
    client: TestClient,
):
    client.post(
        "/timeseries",
        json={
            "values": [1, 2, 3]
        }
    )

    response = client.get(
        "/timeseries/count"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data["count"], int)
    assert data["count"] >= 1


def test_get_timeseries_by_id(
    client: TestClient,
):
    create_response = client.post(
        "/timeseries",
        json={
            "values": [1, 2, 3]
        }
    )

    timeseries_id = create_response.json()["id"]

    response = client.get(
        f"/timeseries/{timeseries_id}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["values"] == [1, 2, 3]
    assert "created_at" in data


def test_get_timeseries_not_found(
    client: TestClient,
):
    response = client.get(
        "/timeseries/00000000-0000-0000-0000-000000000000"
    )

    assert response.status_code == 404

    assert response.json() == {
        "detail": "Time series not found"
    }


def test_get_timeseries_invalid_uuid(
    client: TestClient,
):
    response = client.get(
        "/timeseries/abc"
    )

    assert response.status_code == 422


def test_get_metrics(
    client: TestClient,
):
    create_response = client.post(
        "/timeseries",
        json={
            "values": [10, 20, 50]
        }
    )

    timeseries_id = create_response.json()["id"]

    response = client.get(
        f"/timeseries/{timeseries_id}/metrics"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["count"] == 3
    assert data["min"] == 10
    assert data["max"] == 50

    assert data["mean"] == pytest.approx(
        26.666666666666668
    )


def test_delete_timeseries(
    client: TestClient,
):
    create_response = client.post(
        "/timeseries",
        json={
            "values": [10, 20, 30]
        }
    )

    timeseries_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/timeseries/{timeseries_id}"
    )

    assert delete_response.status_code == 204
    assert delete_response.text == ""

    get_response = client.get(
        f"/timeseries/{timeseries_id}"
    )

    assert get_response.status_code == 404

    assert get_response.json() == {
        "detail": "Time series not found"
    }


def test_predict_timeseries(
    client: TestClient,
):
    create_response = client.post(
        "/timeseries",
        json={
            "values": [10, 20, 30, 40]
        }
    )

    timeseries_id = create_response.json()["id"]

    response = client.get(
        f"/timeseries/{timeseries_id}/predict"
    )

    assert response.status_code == 200

    data = response.json()

    assert "predictions" in data
    assert isinstance(data["predictions"], list)
    assert len(data["predictions"]) == 5

    assert all(
        isinstance(value, (int, float))
        for value in data["predictions"]
    )

def test_get_all_timeseries(
    client: TestClient,
):
    client.post(
        "/timeseries",
        json={
            "values": [10, 20, 30]
        }
    )

    client.post(
        "/timeseries",
        json={
            "values": [40, 50, 60]
        }
    )

    response = client.get(
        "/timeseries"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(
        data,
        list,
    )

    assert len(data) >= 2

    assert "id" in data[0]
    assert "values" in data[0]
    assert "created_at" in data[0]