import pytest
from fastapi import status


def test_create_client(authenticated_client):
    """Testa criação de cliente"""
    payload = {
        "name": "Test client",
        "email": "client@example.com",
        "document": "12345678000190"
    }
    
    response = authenticated_client.post("/clients/", json=payload)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Test client"
    assert data["email"] == "client@example.com"
    assert "id" in data


def test_get_all_clients(authenticated_client, test_client):
    """Testa listagem de todos os clientes"""
    response = authenticated_client.get("/clients/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_client_by_id(authenticated_client, test_client):
    """Testa busca de cliente por ID"""
    response = authenticated_client.get(f"/clients/{test_client.id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == test_client.id
    assert data["name"] == test_client.name
    assert data["email"] == test_client.email


def test_get_client_not_found(authenticated_client):
    """Testa busca de cliente inexistente"""
    response = authenticated_client.get("/clients/99999")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_create_client_unauthorized(client):
    """Testa criação de cliente sem autenticação"""
    payload = {
        "name": "Empresa Teste",
        "email": "teste@empresa.com"
    }
    
    response = client.post("/clients/", json=payload)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED