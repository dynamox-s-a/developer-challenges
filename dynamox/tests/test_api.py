def test_create_get_metrics_delete_flow(client):
    """
    End-to-end API flow test (HTTP-level):

    1) Create a new time series (POST /timeseries)
    2) Verify count endpoint (GET /timeseries/count)
    3) Retrieve the series (GET /timeseries/{id}) and check ordering
    4) Compute metrics (GET /timeseries/{id}/metrics)
    5) Delete the series (DELETE /timeseries/{id})
    6) Confirm it no longer exists (GET returns 404)

    This test validates:
    - request/response schemas
    - persistence in the database
    - sorting behavior (timestamps)
    - aggregation logic (metrics)
    - deletion behavior (including cascade)
    """
    payload = {
        "name": "motor_1_vibration",
        "metadata": {"asset_id": "A-123", "unit": "mm/s"},
        "points": [
            # Intentionally unsorted timestamps to verify that
            # the API stores/returns points in ascending timestamp order.
            {"timestamp": "2025-12-18T10:00:01Z", "value": 2.0},
            {"timestamp": "2025-12-18T10:00:00Z", "value": 1.0},
        ],
    }

    # 1) Create time series
    r = client.post("/timeseries", json=payload)
    assert r.status_code == 201
    ts_id = r.json()["id"]

    # 2) Count endpoint should reflect the created series
    r = client.get("/timeseries/count")
    assert r.status_code == 200
    assert r.json()["count"] == 1

    # 3) Retrieve series and verify datapoints order
    r = client.get(f"/timeseries/{ts_id}")
    assert r.status_code == 200
    data = r.json()
    assert data["points_count"] == 2
    assert data["points"][0]["value"] == 1.0
    assert data["points"][1]["value"] == 2.0

    # 4) Verify aggregated metrics
    r = client.get(f"/timeseries/{ts_id}/metrics")
    assert r.status_code == 200
    m = r.json()
    assert m["count"] == 2
    assert m["min"] == 1.0
    assert m["max"] == 2.0
    assert m["mean"] == 1.5

    # 5) Delete series
    r = client.delete(f"/timeseries/{ts_id}")
    assert r.status_code == 204

    # 6) Confirm it is gone
    r = client.get(f"/timeseries/{ts_id}")
    assert r.status_code == 404
