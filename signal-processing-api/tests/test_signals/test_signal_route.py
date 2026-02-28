from fastapi import status
from uuid import uuid4

def test_create_signal(client, create_machine):
    """Testa criação de sinal"""
    machine = create_machine()
    
    response = client.post(
        f"/machines/{machine.id}/signals",
        json={
            "signal_type": "vibration",
            "value": 15.7,
            "timestamp": "2024-01-01T10:00:00Z"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["signal_type"] == "vibration"
    assert data["value"] == 15.7

def test_get_signal(client, create_signal):
    """Testa busca de sinal por ID"""
    signal = create_signal()
    
    response = client.get(f"/signals/{signal.id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == str(signal.id)

def test_delete_signal(client, create_signal, create_metric):
    """Testa deleção de sinal (deve deletar métricas em cascata)"""
    signal = create_signal()
    
    # Cria métricas associadas
    metric1 = create_metric(signal_id=signal.id)
    metric2 = create_metric(signal_id=signal.id)
    
    response = client.delete(f"/signals/{signal.id}")
    assert response.status_code == status.HTTP_200_OK
    
    # Verifica se o sinal foi deletado
    response = client.get(f"/signals/{signal.id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_get_full_time_series(client, create_signal, create_metric):
    """Testa recuperação da série temporal completa"""
    signal = create_signal()
    
    # Cria 5 métricas para o sinal
    for i in range(5):
        create_metric(signal_id=signal.id, value=float(i))
    
    response = client.get(f"/signals/{signal.id}/full")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["signal_id"] == str(signal.id)
    assert data["total_points"] == 5
    assert len(data["data"]) == 5