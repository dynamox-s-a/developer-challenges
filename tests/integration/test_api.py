import pytest
from httpx import AsyncClient
from tests.conftest import make_payload


@pytest.mark.asyncio
async def test_store_returns_201(client: AsyncClient):
    resp = await client.post("/api/v1/timeseries/", json=make_payload("sensor-A"))
    assert resp.status_code == 201
    assert resp.json()["name"] == "sensor-A"


@pytest.mark.asyncio
async def test_store_duplicate_returns_409(client: AsyncClient):
    await client.post("/api/v1/timeseries/", json=make_payload("sensor-dup"))
    resp = await client.post("/api/v1/timeseries/", json=make_payload("sensor-dup"))
    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_store_empty_data_returns_422(client: AsyncClient):
    resp = await client.post("/api/v1/timeseries/", json={"name": "empty", "data": []})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_get_series_with_data(client: AsyncClient):
    r = await client.post("/api/v1/timeseries/", json=make_payload("sensor-B", n=10))
    sid = r.json()["id"]

    resp = await client.get(f"/api/v1/timeseries/{sid}")
    assert resp.status_code == 200
    assert resp.json()["point_count"] == 10


@pytest.mark.asyncio
async def test_get_nonexistent_returns_404(client: AsyncClient):
    resp = await client.get("/api/v1/timeseries/does-not-exist")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_metrics_values(client: AsyncClient):
    data = [{"timestamp": float(i), "value": float(i)} for i in range(10)]
    r = await client.post("/api/v1/timeseries/", json={"name": "metrics-test", "data": data})
    sid = r.json()["id"]

    resp = await client.get(f"/api/v1/timeseries/{sid}/metrics")
    body = resp.json()

    assert resp.status_code == 200
    assert body["min"] == pytest.approx(0.0)
    assert body["max"] == pytest.approx(9.0)
    assert body["mean"] == pytest.approx(4.5)


@pytest.mark.asyncio
async def test_count_increments(client: AsyncClient):
    r0 = (await client.get("/api/v1/timeseries/count")).json()["count"]

    await client.post("/api/v1/timeseries/", json=make_payload("count-1"))
    await client.post("/api/v1/timeseries/", json=make_payload("count-2"))

    r1 = (await client.get("/api/v1/timeseries/count")).json()["count"]
    assert r1 == r0 + 2


@pytest.mark.asyncio
async def test_delete_removes_series(client: AsyncClient):
    r = await client.post("/api/v1/timeseries/", json=make_payload("delete-me"))
    sid = r.json()["id"]

    await client.delete(f"/api/v1/timeseries/{sid}")
    assert (await client.get(f"/api/v1/timeseries/{sid}")).status_code == 404


@pytest.mark.asyncio
async def test_delete_nonexistent_returns_404(client: AsyncClient):
    resp = await client.delete("/api/v1/timeseries/ghost")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_list_pagination(client: AsyncClient):
    for i in range(5):
        await client.post("/api/v1/timeseries/", json=make_payload(f"pag-{i}"))

    resp = await client.get("/api/v1/timeseries/?page=1&page_size=3")
    body = resp.json()

    assert resp.status_code == 200
    assert len(body["items"]) <= 3
    assert "total" in body


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
