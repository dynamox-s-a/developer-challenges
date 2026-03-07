"""
Points Creation
"""


def test_insert_points(client):
    ts = client.post("/timeseries/", json={"label": "points-ts"}).json()

    payload = {
        "points": [
            {"timestamp": "2026-01-01T22:00:00Z", "value": 1},
            {"timestamp": "2026-01-01T22:00:01Z", "value": 2},
        ]
    }

    response = client.post(f"/timeseries/{ts['id']}/points", json=payload)

    assert response.status_code == 201
    assert response.json()["inserted"] == 2


def test_insert_points_invalid_value_type(client):
    ts = client.post("/timeseries/", json={"label": "points-ts"}).json()

    payload = {
        "points": [
            {"timestamp": "2026-01-01T22:00:00Z", "value": "abc"}
        ]
    }

    response = client.post(f"/timeseries/{ts['id']}/points", json=payload)

    assert response.status_code == 422


def test_insert_points_timeseries_not_found(client):
    payload = {
        "points": [
            {"timestamp": "2026-01-01T22:00:00Z", "value": 1}
        ]
    }

    response = client.post(
        "/timeseries/00000000-0000-0000-0000-000000000000/points",
        json=payload,
    )

    assert response.status_code == 404


def test_insert_points_duplicate_timestamp_in_payload(client):
    ts = client.post("/timeseries/", json={"label": "points-ts"}).json()

    payload = {
        "points": [
            {"timestamp": "2026-01-01T22:00:00Z", "value": 1},
            {"timestamp": "2026-01-01T22:00:00Z", "value": 2},
        ]
    }

    response = client.post(f"/timeseries/{ts['id']}/points", json=payload)

    assert response.status_code == 400


def test_insert_points_duplicate_timestamp_already_stored(client):
    ts = client.post("/timeseries/", json={"label": "points-ts"}).json()

    payload = {
        "points": [
            {"timestamp": "2026-01-01T22:00:00Z", "value": 1}
        ]
    }

    client.post(f"/timeseries/{ts['id']}/points", json=payload)
    response = client.post(f"/timeseries/{ts['id']}/points", json=payload)

    assert response.status_code == 409