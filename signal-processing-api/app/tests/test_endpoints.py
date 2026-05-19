def test_bulk_insert_success_clean_data(client):
    """Deve aceitar e processar lote totalmente válido."""
    payload = {
        "serial_device": "DEV-TEST-OK",
        "data": [
            {"timestamp": "2026-05-18T22:00:00Z", "value": 23.5},
            {"timestamp": "2026-05-18T22:01:00Z", "value": 24.0}
        ]
    }

    response = client.post("/raw_data", json=payload)

    assert response.status_code == 200

    body = response.json()

    assert body["inserted"] == 2
    assert body["rejected"] == 0


def test_bulk_insert_should_reject_future_date(client):
    """Deve rejeitar registros com timestamp futuro, mas manter resposta 200."""
    payload = {
        "serial_device": "DEV-TEST-FUTURE",
        "data": [
            {"timestamp": "2028-12-25T00:00:00Z", "value": 99.9}
        ]
    }

    response = client.post("/raw_data", json=payload)

    assert response.status_code == 200

    body = response.json()

    assert body["inserted"] == 0
    assert body["rejected"] == 1
    assert body["details"][0]["reason"] == "future_timestamp"


def test_bulk_insert_handle_duplicate_timestamps(client):
    """Deve rejeitar timestamp duplicado no mesmo payload."""
    payload = {
        "serial_device": "DEV-TEST-DUP",
        "data": [
            {"timestamp": "2026-05-18T22:00:00Z", "value": 20.0},
            {"timestamp": "2026-05-18T22:00:00Z", "value": 25.5}
        ]
    }

    response = client.post("/raw_data", json=payload)

    assert response.status_code == 200

    body = response.json()

    assert body["inserted"] == 1
    assert body["rejected"] == 1
    assert body["details"][0]["reason"] == "duplicate_in_payload"


def test_get_metrics_calculates_correctly(client):
    """Deve calcular min, max e média corretamente."""
    
    payload = {
        "serial_device": "DEV-MATH-01",
        "data": [
            {"timestamp": "2026-05-18T20:00:00Z", "value": 10.0},
            {"timestamp": "2026-05-18T21:00:00Z", "value": 30.0}
        ]
    }

    # insere dados
    client.post("/raw_data", json=payload)

    # busca métricas
    response = client.get("/raw_data/1/metrics")

    assert response.status_code == 200

    body = response.json()
    metrics = body["metrics"]

    assert metrics["min"]["value"] == 10.0
    assert metrics["max"]["value"] == 30.0
    assert metrics["average_value"] == 20.0
    assert metrics["total_records"] == 2



def test_get_device_raw_data_success(client):
    response_post = client.post("/raw_data", json={
        "serial_device": "DEV-RAW",
        "data": [
            {"timestamp": "2026-05-18T10:00:00Z", "value": 10}
        ]
    })

    device_id = response_post.json()["device_id"]

    response = client.get(f"/devices/{device_id}/raw-data")

    assert response.status_code == 200

    body = response.json()
    assert isinstance(body, list)
    assert len(body) > 0


def test_get_device_raw_data_not_found(client):
    response = client.get("/999/raw-data")

    assert response.status_code == 404


def test_delete_by_device_success(client):
    # cria device com dado
    response_post = client.post("/raw_data", json={
        "serial_device": "DEV-DELETE",
        "data": [
            {"timestamp": "2026-05-18T10:00:00Z", "value": 10}
        ]
    })

    device_id = response_post.json()["device_id"]

    # garante que existe dado antes do delete
    response_before = client.get(f"/devices/{device_id}/raw-data")
    assert len(response_before.json()) == 1

    # faz delete
    response_delete = client.delete(f"/raw_data/{device_id}")

    assert response_delete.status_code == 200

    body = response_delete.json()
    assert body["success"] is True
    assert body["deleted_records"] == 1

    # valida que apagou
    response_after = client.get(f"/devices/{device_id}/raw-data")
    assert response_after.json() == []

def test_delete_by_device_not_found(client):
    response = client.delete("/raw_data/999")

    assert response.status_code == 404

    body = response.json()

    assert body["success"] is False
    assert body["error"] == "Device not found"



def test_delete_is_idempotent(client):
    r = client.post("/raw_data", json={
        "serial_device": "DEV-IDEMPOTENT",
        "data": [{"timestamp": "2026-05-18T10:00:00Z", "value": 10}]
    })

    device_id = r.json()["device_id"]

    r1 = client.delete(f"/raw_data/{device_id}")
    assert r1.status_code == 200
    assert r1.json()["deleted_records"] == 1

    r2 = client.delete(f"/raw_data/{device_id}")
    assert r2.status_code == 200
    assert r2.json()["deleted_records"] == 0

def test_get_active_devices_count(client):
    client.post("/raw_data", json={
        "serial_device": "DEV-COUNT-1",
        "data": [
            {"timestamp": "2026-05-18T10:00:00Z", "value": 10}
        ]
    })

    client.post("/raw_data", json={
        "serial_device": "DEV-COUNT-2",
        "data": [
            {"timestamp": "2026-05-18T11:00:00Z", "value": 20}
        ]
    })

    response = client.get("/devices/count/active")

    assert response.status_code == 200

    body = response.json()

    assert "active_devices_count" in body
    assert body["active_devices_count"] == 2

def test_get_active_devices_count_empty(client):
    response = client.get("/devices/count/active")

    assert response.status_code == 200

    body = response.json()

    assert body["active_devices_count"] == 0


def test_active_devices_count_does_not_duplicate(client):
    client.post("/raw_data", json={
        "serial_device": "DEV-SAME",
        "data": [{"timestamp": "2026-05-18T10:00:00Z", "value": 10}]
    })

    client.post("/raw_data", json={
        "serial_device": "DEV-SAME",
        "data": [{"timestamp": "2026-05-18T11:00:00Z", "value": 20}]
    })

    response = client.get("/devices/count/active")

    body = response.json()

    assert body["active_devices_count"] == 1


def test_full_time_series_grouping(client):
    client.post("/raw_data", json={
        "serial_device": "DEV-A",
        "data": [
            {"timestamp": "2026-05-18T10:00:00Z", "value": 10},
            {"timestamp": "2026-05-18T11:00:00Z", "value": 20}
        ]
    })

    response = client.get("/raw_data/full_time_series")

    assert response.status_code == 200

    body = response.json()

    assert isinstance(body, list)
    assert len(body) >= 1

    device_series = body[0]
    assert "device_id" in device_series
    assert "series_data" in device_series
    assert len(device_series["series_data"]) == 2


def test_full_time_series_structure(client):
    client.post("/raw_data", json={
        "serial_device": "DEV-B",
        "data": [
            {"timestamp": "2026-05-18T10:00:00Z", "value": 15}
        ]
    })

    response = client.get("/raw_data/full_time_series")
    body = response.json()

    item = body[0]["series_data"][0]

    assert "id" in item
    assert "timestamp" in item
    assert "value" in item

def test_full_time_series_empty(client):
    response = client.get("/raw_data/full_time_series")

    assert response.status_code == 200
    assert response.json() == []

    





