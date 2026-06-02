"""
test_api.py

Como rodar:
  pytest test_api.py -v
"""

from fastapi.testclient import TestClient
from main import app
import json
from datetime import datetime

# O TestClient faz requisições fake pra API sem precisar rodar o servidor
client = TestClient(app)


def test_create_series():
    """HISTÓRIA 1: Armazenar uma série de dados brutos"""
    payload = {
        "name": "sensor_vibração_máquina_1",
        "data_points": [
            {"timestamp": "2026-05-29T10:00:00", "value": 10.5},
            {"timestamp": "2026-05-29T10:01:00", "value": 12.3},
            {"timestamp": "2026-05-29T10:02:00", "value": 11.8},
        ]
    }
    
    response = client.post("/series", json=payload)
    
    # Verificar que a resposta foi bem-sucedida (status 200)
    assert response.status_code == 200, f"Status {response.status_code}: {response.text}"
    
    data = response.json()
    assert "id" in data
    assert data["message"] == "Série armazenada com sucesso"
    assert data["points_count"] == 3


def test_get_series():
    """HISTÓRIA 5: Recuperar uma série inteira"""
    # Primeiro criar uma série
    payload = {
        "name": "test_series",
        "data_points": [
            {"timestamp": "2026-05-29T10:00:00", "value": 5.0},
            {"timestamp": "2026-05-29T10:01:00", "value": 6.0},
        ]
    }
    
    create_response = client.post("/series", json=payload)
    series_id = create_response.json()["id"]
    
    # Buscar a série
    get_response = client.get(f"/series/{series_id}")
    
    assert get_response.status_code == 200
    data = get_response.json()
    
    assert data["id"] == series_id
    assert data["name"] == "test_series"
    assert len(data["data_points"]) == 2
    assert data["data_points"][0]["value"] == 5.0


def test_get_metrics():
    """HISTÓRIA 2: Obter métricas sobre a série temporal"""
    # Criar uma série com números que dão contas fáceis
    payload = {
        "name": "metrics_test",
        "data_points": [
            {"timestamp": "2026-05-29T10:00:00", "value": 10.0},
            {"timestamp": "2026-05-29T10:01:00", "value": 20.0},
            {"timestamp": "2026-05-29T10:02:00", "value": 30.0},
        ]
    }
    
    create_response = client.post("/series", json=payload)
    series_id = create_response.json()["id"]
    
    # Buscar as métricas
    metrics_response = client.get(f"/series/{series_id}/metrics")
    
    assert metrics_response.status_code == 200
    metrics = metrics_response.json()
    
    assert metrics["count"] == 3
    assert metrics["mean"] == 20.0  # (10 + 20 + 30) / 3
    assert metrics["min"] == 10.0
    assert metrics["max"] == 30.0
    assert metrics["std_dev"] is not None  # Deve calcular o desvio padrão


def test_delete_series():
    """HISTÓRIA 3: Deletar uma série temporal"""
    # Criar uma série
    payload = {
        "name": "delete_test",
        "data_points": [
            {"timestamp": "2026-05-29T10:00:00", "value": 1.0},
        ]
    }
    
    create_response = client.post("/series", json=payload)
    series_id = create_response.json()["id"]
    
    # Deletar a série
    delete_response = client.delete(f"/series/{series_id}")
    
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Série deletada com sucesso"
    
    # Tentar buscar a série deletada deve retornar 404
    get_response = client.get(f"/series/{series_id}")
    assert get_response.status_code == 404


def test_count_series():
    """HISTÓRIA 4: Recuperar o número de séries armazenadas"""
    # Limpar o banco criando uma resposta limpa é complicado em teste,
    # então a gente só verifica que o endpoint funciona
    
    response = client.get("/series/count")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "count" in data
    assert isinstance(data["count"], int)
    assert data["count"] >= 0  # Deve haver pelo menos 0 séries


def test_api_home():
    """Endpoint raiz funciona"""
    response = client.get("/")
    
    assert response.status_code == 200
    data = response.json()
    
    assert "aplicacao" in data
    assert "endpoints" in data


def test_status():
    """Health check funciona"""
    response = client.get("/status")
    
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
