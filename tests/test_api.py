import pytest
from datetime import datetime, timedelta, timezone

@pytest.mark.asyncio
async def test_create_series_performance(client, setup_db):
    """Validação de desempenho na inserção de pontos no banco de dados"""

    # Teste com 1000 pontos
    data_points = [
        {"timestamp": (datetime.now(timezone.utc) + timedelta(seconds=i)).isoformat(), "value": 20.0 + i}
        for i in range(1000)
    ]
    
    payload = {
        "name": "Sensor de Stress Test",
        "unit": "mm/s",
        "data_points": data_points
    }

    response = await client.post("/api/series/", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    
    # Cálculo da latência para validação de requisito
    raw_header = response.headers.get("X-Process-Time-ms")
    assert raw_header is not None, "Header ausente na resposta."
    
    latency = float(raw_header)
    print(f"\n[LATENCY] {latency}ms")
    assert latency < 350, f"Tempo de {latency}ms excedeu o limite de 350ms"

@pytest.mark.asyncio
async def test_get_metrics(client, setup_db):
    """Validação dos cálculos matemáticos das métricas  """

    payload = {
        "name": "Sensor Metricas",
        "unit": "°C",
        "data_points": [
            {"timestamp": "2026-01-01T10:00:00Z", "value": 10.0},
            {"timestamp": "2026-01-01T10:01:00Z", "value": 20.0},
            {"timestamp": "2026-01-01T10:02:00Z", "value": 30.0}
        ]
    }
    create_res = await client.post("/api/series/", json=payload)
    series_id = create_res.json()["id"]

    response = await client.get(f"/api/series/{series_id}/metrics")
    
    assert response.status_code == 200
    metrics = response.json()
    assert metrics["count"] == 3
    assert metrics["average"] == 20.0
    assert metrics["max_value"] == 30.0
    assert metrics["min_value"] == 10.0