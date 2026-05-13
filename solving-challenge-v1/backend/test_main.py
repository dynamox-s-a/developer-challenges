from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "Online", "database": "Connected"}

def test_create_and_read_metrics():
    # 1. Create a series

    series_name = "engine_01"
    series_data = [10.0, 20.0, 30.0]
    
    response = client.post(f"/series?name={series_name}", json=series_data)
    assert response.status_code == 200
    assert response.json()["message"] == f"Series '{series_name}' stored successfully"
    
    # 2. Get metrics and check if average is 20.0
    response = client.get(f"/series/{series_name}/metrics")
    assert response.status_code == 200
    assert response.json()["metrics"]["mean"] == 20.0
    assert response.json()["metrics"]["count"] == 3

def test_delete_series():
    series_name = "engine_01"
    
    # Delete the series we just created
    response = client.delete(f"/series/{series_name}")
    assert response.status_code == 200
    assert response.json() == {"message": f"Series '{series_name}' deleted"}
    
    # Try to get it again, should be 404
    response = client.get(f"/series/{series_name}/metrics")
    assert response.status_code == 404