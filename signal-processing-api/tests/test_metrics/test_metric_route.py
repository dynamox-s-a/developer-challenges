from fastapi import status

def test_create_metric(client, create_signal, db_session):
    """Testa criação de métrica"""
    signal = create_signal()
    
    from app.models.signal import Signal
    signal_db = db_session.query(Signal).filter(Signal.id == signal.id).first()
    assert signal_db is not None

    response = client.post(
        f"/signals/{signal.id}/metrics",
        json={
            "metric_type": "rms",
            "value": 3.14,
            "timestamp": "2024-01-01T10:00:00Z"
        }
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["metric_type"] == "rms"
    assert data["value"] == 3.14

def test_list_signal_metrics(client, create_signal, create_metric):
    """Testa listagem de métricas com paginação"""
    signal = create_signal()
    
    # Cria 10 métricas
    for i in range(10):
        create_metric(signal_id=signal.id, value=float(i))
    
    response = client.get(f"/signals/{signal.id}/metrics?limit=5")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data["data"]) == 5
    assert data["has_next"] == True

def test_get_metric_by_id(client, create_metric):
    """Testa busca de métrica por ID"""
    metric = create_metric()
    
    response = client.get(f"/metrics/{metric.id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == str(metric.id)

def test_delete_metric(client, create_metric):
    """Testa deleção de métrica"""
    metric = create_metric()
    
    response = client.delete(f"/metrics/{metric.id}")
    assert response.status_code == status.HTTP_200_OK
    
    # Verifica se foi deletada
    response = client.get(f"/metrics/{metric.id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND