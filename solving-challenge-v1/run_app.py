from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    """Corrigido: Agora espera o que o seu main.py realmente retorna"""
    response = client.get("/")
    assert response.status_code == 200
    # O seu main.py retorna status e database, não 'message'
    assert response.json() == {"status": "Online", "database": "Connected"}

def test_create_and_read_metrics():
    """Corrigido: Envia name na URL para evitar o erro 422"""
    series_name = "engine_01"
    payload = [10.0, 20.0, 30.0]
    
    # name como query param (?name=...) e data como json body
    response = client.post(f"/series?name={series_name}", json=payload)
    assert response.status_code == 200
    assert response.json() == {"message": f"Series '{series_name}' stored successfully"}
    
    # 2. Buscar métricas
    response = client.get(f"/series/{series_name}/metrics")
    assert response.status_code == 200
    assert response.json()["metrics"]["mean"] == 20.0

def test_delete_series():
    """Valida a remoção"""
    series_name = "engine_01"
    response = client.delete(f"/series/{series_name}")
    assert response.status_code == 200
    assert response.json() == {"message": f"Series '{series_name}' deleted"}
    
    # Confirma o 404
    response = client.get(f"/series/{series_name}/metrics")
    assert response.status_code == 404