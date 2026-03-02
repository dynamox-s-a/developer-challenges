# tests/test_latency/test_latency.py
import pytest
import time
from statistics import mean

# Configurações do teste
NUM_REQUESTS = 50
MAX_LATENCY_MS = 350


@pytest.mark.latency
def test_machines_list_latency(client, db_session):
    for i in range(5):
        response = client.post("/machines", json={
            "name": f"Test Machine {i}",
            "location": f"Location {i}"
        })
        assert response.status_code == 200
    
    latencies = []
    
    for i in range(NUM_REQUESTS):
        start = time.time()
        response = client.get("/machines?limit=10")
        latency = (time.time() - start) * 1000
        
        latencies.append(latency)
        assert response.status_code == 200, f"Request {i} failed"
    
    avg_latency = mean(latencies)
    max_latency = max(latencies)
    p95 = sorted(latencies)[int(len(latencies) * 0.95)]
    
    print(f"Listagem de máquinas - {NUM_REQUESTS} requisições:")
    print(f"   Média: {avg_latency:.2f}ms")
    print(f"   Máxima: {max_latency:.2f}ms")
    print(f"   P95: {p95:.2f}ms")
    print(f"   Requisito: < {MAX_LATENCY_MS}ms")
    
    assert max_latency < MAX_LATENCY_MS, f"Falhou: {max_latency:.2f}ms > {MAX_LATENCY_MS}ms"


@pytest.mark.latency
def test_create_machine_latency(client, db_session):
    latencies = []
    
    for i in range(20):
        start = time.time()
        response = client.post("/machines", json={
            "name": f"Latency Test Machine {i}",
            "location": "Test Location"
        })
        latency = (time.time() - start) * 1000
        
        latencies.append(latency)
        assert response.status_code == 200
    
    avg_latency = mean(latencies)
    max_latency = max(latencies)
    
    print(f"\n Criação de máquina - {len(latencies)} requisições:")
    print(f"   Média: {avg_latency:.2f}ms")
    print(f"   Máxima: {max_latency:.2f}ms")
    print(f"   Requisito: < {MAX_LATENCY_MS}ms")
    
    assert max_latency < MAX_LATENCY_MS


@pytest.mark.latency
def test_get_full_time_series_latency(client, db_session, create_signal, create_metric):
    signal = create_signal()
    
    for i in range(100):
        create_metric(signal_id=signal.id, value=float(i))
    
    latencies = []
    for i in range(10):
        start = time.time()
        response = client.get(f"/signals/{signal.id}/full")
        latency = (time.time() - start) * 1000
        
        latencies.append(latency)
        assert response.status_code == 200
    
    avg_latency = mean(latencies)
    max_latency = max(latencies)
    
    print(f"\n Série temporal completa (100 pontos) - {len(latencies)} requisições:")
    print(f"   Média: {avg_latency:.2f}ms")
    print(f"   Máxima: {max_latency:.2f}ms")
    print(f"   Requisito: < {MAX_LATENCY_MS}ms")
    
    assert max_latency < MAX_LATENCY_MS