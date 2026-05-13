from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    """Valida se o root responde com o status correto do banco"""
    response = client.get("/")
    assert response.status_code == 200
    # Ajustado para bater com seu main.py: {"status": "Online", "database": "Connected"}
    assert response.json()["status"] == "Online"
    assert response.json()["database"] == "Connected"

def test_create_and_read_metrics():
    """Valida a ingestão via Query Params e o cálculo de métricas"""
    # 1. Create a series
    # No seu main.py: async def create_series(name: str, data: list[float])
    # O FastAPI espera 'name' na URL e 'data' no corpo
    series_name = "engine_01"
    payload = [10.0, 20.0, 30.0]
    
    response = client.post(f"/series?name={series_name}", json=payload)
    assert response.status_code == 200
    assert "stored successfully" in response.json()["message"]
    
    # 2. Get metrics and check if average is 20.0
    response = client.get(f"/series/{series_name}/metrics")
    assert response.status_code == 200
    assert response.json()["metrics"]["mean"] == 20.0
    assert response.json()["metrics"]["count"] == 3

def test_delete_series():
    """Valida a remoção e confirma o 404 após deletar"""
    series_name = "engine_01"
    
    # Delete the series
    response = client.delete(f"/series/{series_name}")
    assert response.status_code == 200
    
    # Try to get it again, should be 404
    response = client.get(f"/series/{series_name}/metrics")
    assert response.status_code == 404