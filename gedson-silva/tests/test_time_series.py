import pytest
from httpx import AsyncClient

PAYLOAD = {
    "name": "sensor-test",
    "points": [
        {"timestamp": "2024-01-01T00:00:00Z", "value": 1.0},
        {"timestamp": "2024-01-01T00:01:00Z", "value": 2.0},
        {"timestamp": "2024-01-01T00:02:00Z", "value": 3.0},
        {"timestamp": "2024-01-01T00:03:00Z", "value": 4.0},
        {"timestamp": "2024-01-01T00:04:00Z", "value": 5.0},
    ]
}

@pytest.mark.asyncio
async def test_create_series(client: AsyncClient):
    res = await client.post("/api/v1/series/", json=PAYLOAD)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "sensor-test"
    assert len(data["points"]) == 5

@pytest.mark.asyncio
async def test_create_series_empty_points(client: AsyncClient):
    res = await client.post("/api/v1/series/", json={"points": []})
    assert res.status_code == 422

@pytest.mark.asyncio
async def test_get_series(client: AsyncClient):
    created = await client.post("/api/v1/series/", json=PAYLOAD)
    series_id = created.json()["id"]

    res = await client.get(f"/api/v1/series/{series_id}")
    assert res.status_code == 200
    assert res.json()["id"] == series_id

@pytest.mark.asyncio
async def test_get_series_not_found(client: AsyncClient):
    res = await client.get("/api/v1/series/id-inexistente")
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_metrics(client: AsyncClient):
    created = await client.post("/api/v1/series/", json=PAYLOAD)
    series_id = created.json()["id"]

    res = await client.get(f"/api/v1/series/{series_id}/metrics")
    assert res.status_code == 200
    data = res.json()
    assert data["min"] == 1.0
    assert data["max"] == 5.0
    assert data["mean"] == 3.0
    assert data["count"] == 5

@pytest.mark.asyncio
async def test_predict(client: AsyncClient):
    created = await client.post("/api/v1/series/", json=PAYLOAD)
    series_id = created.json()["id"]

    res = await client.get(f"/api/v1/series/{series_id}/predict?steps=5")
    assert res.status_code == 200
    data = res.json()
    assert len(data["predicted_points"]) == 5
    assert data["method"] == "linear_regression"

@pytest.mark.asyncio
async def test_delete_series(client: AsyncClient):
    created = await client.post("/api/v1/series/", json=PAYLOAD)
    series_id = created.json()["id"]

    res = await client.delete(f"/api/v1/series/{series_id}")
    assert res.status_code == 204

    res = await client.get(f"/api/v1/series/{series_id}")
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_count(client: AsyncClient):
    res = await client.get("/api/v1/series/count")
    assert res.status_code == 200
    initial = res.json()["count"]

    await client.post("/api/v1/series/", json=PAYLOAD)
    await client.post("/api/v1/series/", json=PAYLOAD)

    res = await client.get("/api/v1/series/count")
    assert res.json()["count"] == initial + 2

# --- Testes de borda ---

@pytest.mark.asyncio
async def test_predict_insufficient_points(client: AsyncClient):
    res = await client.post("/api/v1/series/", json={
        "name": "single-point",
        "points": [
            {"timestamp": "2024-01-01T00:00:00Z", "value": 1.0},
        ]
    })
    series_id = res.json()["id"]

    res = await client.get(f"/api/v1/series/{series_id}/predict")
    assert res.status_code == 422

@pytest.mark.asyncio
async def test_metrics_not_found(client: AsyncClient):
    res = await client.get("/api/v1/series/id-inexistente/metrics")
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_predict_not_found(client: AsyncClient):
    res = await client.get("/api/v1/series/id-inexistente/predict")
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_delete_not_found(client: AsyncClient):
    res = await client.delete("/api/v1/series/id-inexistente")
    assert res.status_code == 404

@pytest.mark.asyncio
async def test_predict_steps_out_of_range(client: AsyncClient):
    created = await client.post("/api/v1/series/", json=PAYLOAD)
    series_id = created.json()["id"]

    res = await client.get(f"/api/v1/series/{series_id}/predict?steps=0")
    assert res.status_code == 422

    res = await client.get(f"/api/v1/series/{series_id}/predict?steps=101")
    assert res.status_code == 422

