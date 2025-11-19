import pytest
from fastapi import status
from datetime import datetime


def test_create_series_success(authenticated_client, test_device):
    """Testa criação de série temporal"""
    payload = {
        "device_uid": test_device.uid,
        "values": [
            {
                "value": 1.5,
                "timestamp": "2024-01-15T10:30:00",
                "quality": "good",
                "unit": "g-force"
            },
            {
                "value": 2.3,
                "timestamp": "2024-01-15T10:31:00",
                "quality": "good",
                "unit": "g-force"
            }
        ]
    }
    
    response = authenticated_client.post("/series/", json=payload)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["device_uid"] == test_device.uid
    assert len(data["values"]) == 2

def test_create_series_device_not_found(authenticated_client):
    """Testa criação de série com dispositivo inexistente"""
    payload = {
        "device_uid": "non-existent-device",
        "values": [
            {
                "value": 1.5,
                "timestamp": "2024-01-15T10:30:00",
                "quality": "good",
                "unit": "g-force"
            }
        ]
    }
    
    response = authenticated_client.post("/series/", json=payload)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Device not found" in response.json()["detail"]

def test_get_series_by_id(authenticated_client, test_series):
    """Testa busca de série por ID"""
    response = authenticated_client.get(f"/series/{test_series.id}")
    print("SERIUEES", test_series)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == test_series.id
    assert data["device_uid"] == test_series.device_uid
    assert len(data["values"]) == 3

def test_get_series_not_found(authenticated_client):
    """Testa busca de série inexistente"""
    response = authenticated_client.get("/series/99999")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "Series not found" in response.json()["detail"]

def test_get_series_metrics(authenticated_client, test_series):
    """Testa obtenção de métricas de uma série"""
    response = authenticated_client.get(f"/series/{test_series.id}/metrics")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "mean" in data
    assert "min" in data
    assert "max" in data
    assert "std" in data
    assert "count" in data
    assert data["count"] == 3
    assert data["min"] == 1.5
    assert data["max"] == 2.3

def test_get_series_metrics_not_found(authenticated_client):
    """Testa métricas de série inexistente"""
    response = authenticated_client.get("/series/99999/metrics")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_get_series_by_client(authenticated_client, test_series, test_client):
    """Testa busca de séries por cliente"""
    response = authenticated_client.get(f"/series/client/{test_client.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_series_by_device(authenticated_client, test_series, test_device):
    """Testa busca de séries por dispositivo"""
    response = authenticated_client.get(f"/series/device/{test_device.uid}/list")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert all(series["device_uid"] == test_device.uid for series in data)

def test_count_series_by_client(authenticated_client, test_series, test_client):
    """Testa contagem de séries por cliente"""
    response = authenticated_client.get(f"/series/count/{test_client.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "count" in data
    assert data["count"] >= 1

def test_delete_series(authenticated_client, test_series):
    """Testa exclusão de série (soft delete)"""
    response = authenticated_client.delete(f"/series/{test_series.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] is True
    assert "Series deleted successfully" in data["message"]

def test_delete_series_not_found(authenticated_client):
    """Testa exclusão de série inexistente"""
    response = authenticated_client.delete("/series/99999")
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Series not found" in response.json()["detail"]

def test_create_series_unauthorized(client, test_device):
    """Testa criação de série sem autenticação"""
    payload = {
        "device_uid": test_device.uid,
        "values": [{"value": 1.5, "timestamp": "2024-01-15T10:30:00"}]
    }
    
    response = client.post("/series/", json=payload)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

