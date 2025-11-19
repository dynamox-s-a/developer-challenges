import pytest
from fastapi import status


def test_create_device(authenticated_client, test_client):
    """Testa criação de dispositivo"""
    from app.devices.sensor_enum import SensorTypeEnum
    
    payload = {
        "name": "Test Device",
        "client_id": test_client.id,
        "sensor_type": SensorTypeEnum.TCAG.value
    }
    
    response = authenticated_client.post("/devices/", json=payload)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Test Device"
    assert "uid" in data


def test_get_device_by_id(authenticated_client, test_device):
    """Testa busca de dispositivo por ID"""
    response = authenticated_client.get(f"/devices/device/{test_device.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == test_device.id
    assert data["name"] == test_device.name


def test_get_device_not_found(authenticated_client):
    """Testa busca de dispositivo inexistente"""
    response = authenticated_client.get("/devices/device/99999")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    detail = response.json()["detail"].lower()
    assert "not found" in detail


def test_get_devices_by_client(authenticated_client, test_device, test_client):
    """Testa listagem de dispositivos por cliente"""
    response = authenticated_client.get(f"/devices/client/{test_client.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_create_device_unauthorized(client, test_client):
    """Testa criação de dispositivo sem autenticação"""
    from app.devices.sensor_enum import SensorTypeEnum
    
    payload = {
        "name": "Test Device",
        "client_id": test_client.id,
        "sensor_type": SensorTypeEnum.TCAG.value
    }
    
    response = client.post("/devices/", json=payload)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED