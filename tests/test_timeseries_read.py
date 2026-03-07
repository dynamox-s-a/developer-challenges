"""
Timeseries Read
"""


def test_get_timeseries(client):
    ts = client.post("/timeseries/", json={"label": "read-ts"}).json()

    payload = {
        "points": [
            {"timestamp": "2026-01-01T22:00:00Z", "value": 1},
            {"timestamp": "2026-01-01T22:00:01Z", "value": 2},
        ]
    }

    client.post(f"/timeseries/{ts['id']}/points", json=payload)

    response = client.get(f"/timeseries/{ts['id']}")

    assert response.status_code == 200
    data = response.json()

    assert data["id"] == ts["id"]
    assert len(data["points"]) == 2


def test_get_timeseries_limit(client):
    ts = client.post("/timeseries/", json={"label": "read-ts"})
    ts_id = ts.json()["id"]

    payload = {
        "points": [
            {"timestamp": f"2026-01-01T10:00:0{i}Z", "value": i}
            for i in range(5)
        ]
    }

    client.post(f"/timeseries/{ts_id}/points", json=payload)

    response = client.get(f"/timeseries/{ts_id}?limit=2")

    assert response.status_code == 200
    data = response.json()
    assert len(data["points"]) == 2


def test_get_timeseries_time_window(client):
    ts = client.post("/timeseries/", json={"label": "read-ts"})
    ts_id = ts.json()["id"]

    payload = {
        "points": [
            {"timestamp": "2026-01-01T10:00:00Z", "value": 1},
            {"timestamp": "2026-01-01T10:00:01Z", "value": 2},
            {"timestamp": "2026-01-01T10:00:02Z", "value": 3},
        ]
    }

    client.post(f"/timeseries/{ts_id}/points", json=payload)

    response = client.get(
        f"/timeseries/{ts_id}?from_ts=2026-01-01T10:00:01Z&to_ts=2026-01-01T10:00:02Z"
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data["points"]) == 2


def test_get_timeseries_cursor(client):
    ts = client.post("/timeseries/", json={"label": "read-ts"})
    ts_id = ts.json()["id"]

    payload = {
        "points": [
            {"timestamp": f"2026-01-01T10:00:0{i}Z", "value": i}
            for i in range(5)
        ]
    }

    client.post(f"/timeseries/{ts_id}/points", json=payload)

    first = client.get(f"/timeseries/{ts_id}?limit=2")
    assert first.status_code == 200

    data1 = first.json()
    cursor = data1["next_after_ts"]

    second = client.get(
        f"/timeseries/{ts_id}?after_ts={cursor}&limit=2"
    )

    assert second.status_code == 200
    data2 = second.json()
    assert len(data2["points"]) == 2


def test_get_timeseries_not_found(client, mock_uuid):
    response = client.get(f"/timeseries/{mock_uuid}")
    assert response.status_code == 404


def test_get_timeseries_invalid_limit(client, mock_uuid):
    response = client.get(f"/timeseries/{mock_uuid}?limit=-1")
    assert response.status_code == 400


def test_get_timeseries_invalid_window(client, mock_uuid):
    response = client.get(
        f"/timeseries/{mock_uuid}?from_ts=2026-01-01T10:00:02Z&to_ts=2026-01-01T10:00:01Z"
    )
    assert response.status_code == 400


def test_get_timeseries_cursor_conflict(client, mock_uuid):
    response = client.get(
        f"/timeseries/{mock_uuid}?after_ts=2026-01-01T10:00:00Z&from_ts=2026-01-01T10:00:01Z"
    )
    assert response.status_code == 400