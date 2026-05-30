from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/")

    assert response.status_code == 200

    assert response.json() == {
        "status": "ok"
    }

def test_create_timeseries():
    response = client.post(
        "/timeseries",
        json={
            "values": [10, 20, 30]
        }
    )


    assert response.status_code == 200

    data = response.json()

    assert 'id' in data

def test_count_timeseries():
    response = client.get(
        "/timeseries/count"
    )

    assert response.status_code == 200

    assert "count" in response.json()


def test_get_timeseries_by_id():

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

def test_get_metrics():

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
    assert data["mean"] == 26.666666666666668

def test_delete_timeseries():

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

    get_response = client.get(
        f"/timeseries/{timeseries_id}"
    )

    assert get_response.status_code == 404

    assert get_response.json() == {
        "detail": "Time series not found"
    }

def test_predict_timeseries():

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
    assert len(data["predictions"]) == 3