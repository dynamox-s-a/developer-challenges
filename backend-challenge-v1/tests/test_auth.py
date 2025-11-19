import pytest
from fastapi import status

def test_login_success(client, db, test_user):
    """Testa login bem-sucedido"""
    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert len(data["access_token"]) > 0


def test_login_invalid_email(client):
    """Testa login com email inválido"""
    response = client.post(
        "/auth/login",
        json={"email": "invalid@example.com", "password": "testpassword123"}
    )
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Invalid email or password" in response.json()["detail"]


def test_login_invalid_password(client, test_user):
    """Testa login com senha inválida"""
    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"}
    )
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_login_missing_fields(client):
    """Testa login com campos faltando"""
    response = client.post(
        "/auth/login",
        json={"email": "test@example.com"}
    )
    
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

