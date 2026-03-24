import pytest
from datetime import datetime, timedelta, timezone
from uuid import uuid4

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

@pytest.mark.asyncio
async def test_get_series_count(client, setup_db):
    """Teste para garantir que a contagem de séries temporais funciona corretamente."""
    
    # Verifica se o banco começa vazio
    res_initial = await client.get("/api/series/count")
    assert res_initial.status_code == 200
    assert res_initial.json()["total_series"] == 0

    # Insere 2 séries diferentes
    for i in range(2):
        payload = {
            "name": f"Sensor de Teste {i}",
            "unit": "V",
            "data_points": [{"timestamp": "2026-01-01T10:00:00Z", "value": 1.5}]
        }
        await client.post("/api/series/", json=payload)

    # Verifica se a contagem atualizou para 2
    res_final = await client.get("/api/series/count")
    assert res_final.status_code == 200
    assert res_final.json()["total_series"] == 2

@pytest.mark.asyncio
async def test_get_full_series_success(client, setup_db):
    """Teste para buscar uma série temporal completa e validar seus pontos."""
    
    # Cria a série temporal com 2 pontos
    payload = {
        "name": "Sensor de Pressão",
        "unit": "Pa",
        "data_points": [
            {"timestamp": "2026-01-01T10:00:00Z", "value": 100.5},
            {"timestamp": "2026-01-01T10:01:00Z", "value": 101.0}
        ]
    }
    create_res = await client.post("/api/series/", json=payload)
    series_id = create_res.json()["id"]

    # Busca a série pelo ID e valida o retorno
    get_res = await client.get(f"/api/series/{series_id}")
    
    assert get_res.status_code == 200
    data = get_res.json()
    
    # Valida metadados
    assert data["id"] == series_id
    assert data["name"] == "Sensor de Pressão"
    assert data["unit"] == "Pa"
    assert "created_at" in data
    
    # Valida a lista de pontos
    assert "data" in data
    assert len(data["data"]) == 2
    assert data["data"][0]["value"] == 100.5
    assert data["data"][1]["value"] == 101.0


@pytest.mark.asyncio
async def test_get_full_series_not_found(client, setup_db):
    """Teste para garantir que buscar um ID inexistente retorna 404."""
    
    # Gera um UUID falso e aleatório
    fake_id = str(uuid4())
    
    # Tenta buscar essa série e retorno '404' com a mensagem esperada
    response = await client.get(f"/api/series/{fake_id}")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Série não encontrada."

@pytest.mark.asyncio
async def test_predict_series_success(client, setup_db):
    """Teste para validar sucesso verificando a precisão matemática da predição."""
    
    # Criando uma série temporal com tendência "óbvia" de 2.0 por degrau
    base_time = datetime.now(timezone.utc)
    payload = {
        "name": "Sensor de Temperatura Crescente",
        "unit": "°C",
        "data_points": [
            {"timestamp": base_time.isoformat(), "value": 10.0},                            # Segundo 0
            {"timestamp": (base_time + timedelta(seconds=1)).isoformat(), "value": 12.0},   # Segundo 1
            {"timestamp": (base_time + timedelta(seconds=2)).isoformat(), "value": 14.0}    # Segundo 2
        ]
    }
    create_res = await client.post("/api/series/", json=payload)
    series_id = create_res.json()["id"]

    # Chama o endpoint de predição pedindo 2 passos (steps) no futuro
    predict_res = await client.get(f"/api/series/{series_id}/predict?steps=2")

    assert predict_res.status_code == 200
    data = predict_res.json()
    
    assert len(data["predictions"]) == 2
    # Previsão 1 (Segundo 3): Deve ser 16.0
    assert data["predictions"][0]["predicted_value"] == 16.0
    # Previsão 2 (Segundo 4): Deve ser 18.0
    assert data["predictions"][1]["predicted_value"] == 18.0


@pytest.mark.asyncio
async def test_predict_series_insufficient_data(client, setup_db):
    """Teste garantindo que a API recusa prever com menos de 2 pontos."""
    
    # Cria uma série temporal com apenas 1 ponto
    payload = {
        "name": "Sensor Novo",
        "unit": "Hz",
        "data_points": [
            {"timestamp": "2026-01-01T10:00:00Z", "value": 50.0}
        ]
    }
    create_res = await client.post("/api/series/", json=payload)
    series_id = create_res.json()["id"]

    # Tenta prever
    predict_res = await client.get(f"/api/series/{series_id}/predict")

    # Deve retornar '400 Bad Request' com a mensagem correta
    assert predict_res.status_code == 400
    assert "menos 2" in predict_res.json()["detail"]


@pytest.mark.asyncio
async def test_predict_series_not_found(client, setup_db):
    """Teste garantindo o erro '404' para IDs inexistentes na predição."""
    
    fake_id = str(uuid4())
    predict_res = await client.get(f"/api/series/{fake_id}/predict")
    
    assert predict_res.status_code == 404
    assert predict_res.json()["detail"] == "Série não encontrada."