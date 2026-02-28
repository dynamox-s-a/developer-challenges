from fastapi import status
from uuid import uuid4

def test_create_machine(client):
    """Testa criação de máquina"""
    response = client.post("/machines", json={
        "name": "Máquina de Teste",
        "location": "Setor A"
    })
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Máquina de Teste"
    assert data["location"] == "Setor A"
    assert "id" in data

def test_list_machines(client, create_machine):
    """Testa listagem de máquinas"""
    # Cria algumas máquinas
    for i in range(3):
        create_machine(name=f"Máquina {i}")
    
    response = client.get("/machines?limit=10")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data["data"]) >= 3
    assert data["limit"] == 10

def test_get_machine_by_id(client, create_machine):
    """Testa busca de máquina por ID"""
    machine = create_machine()
    
    response = client.get(f"/machines/{machine.id}")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == str(machine.id)

def test_delete_machine(client, create_machine):
    """Testa deleção de máquina"""
    machine = create_machine()
    
    response = client.delete(f"/machines/{machine.id}")
    assert response.status_code == status.HTTP_200_OK
    
    # Verifica se foi deletada
    response = client.get(f"/machines/{machine.id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_count_machine_signals(client, create_machine, create_signal):
    """Testa contagem de sinais da máquina"""
    machine = create_machine()
    
    # Cria 3 sinais para a máquina
    for i in range(3):
        create_signal(machine_id=machine.id, value=float(i))
    
    response = client.get(f"/machines/{machine.id}/signals/count")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total_signals"] == 3