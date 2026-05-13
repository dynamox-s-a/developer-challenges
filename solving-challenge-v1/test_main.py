from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Dynamox API is running"}

def test_create_and_read_metrics():
    # 1. Create a series
    payload = {"name": "engine_01", "data": [10.0, 20.0, 30.0]}
    response = client.post("/series", json=payload)
    assert response.status_code == 200
    
    # 2. Get metrics and check if average is 20.0
    response = client.get("/series/engine_01/metrics")
    assert response.status_code == 200
    assert response.json()["metrics"]["mean"] == 20.0

def test_delete_series():
    # Delete the series we just created
    response = client.delete("/series/engine_01")
    assert response.status_code == 200
    
    # Try to get it again, should be 404
    response = client.get("/series/engine_01/metrics")
    assert response.status_code == 404