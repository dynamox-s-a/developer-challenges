import pytest
from pytest_bdd import scenarios, given, when, then, parsers
from fastapi.testclient import TestClient

scenarios('features/sensors.feature')

# ==================== GIVEN ====================

@given("I am an authenticated user")
def authenticated_user(auth_headers):
    return auth_headers

@given(parsers.parse('I have created a machine with name "{name}" and type "{machine_type}"'))
def create_machine(client: TestClient, auth_headers, name: str, machine_type: str, context):
    response = client.post("/machines/", json={"name": name, "type": machine_type}, headers=auth_headers)
    assert response.status_code == 201
    context["current_machine"] = response.json()
    return response.json()

@given(parsers.parse('the machine has a monitoring point "{point_name}" with correct payload'))
def create_point(client: TestClient, auth_headers, point_name: str, context):
    machine_id = context["current_machine"]["id"]
    response = client.post(
        f"/machines/{machine_id}/monitoring-points",
        json={"name": point_name, "machine_id": machine_id},
        headers=auth_headers
    )
    assert response.status_code == 201
    context["current_point"] = response.json()

@given(parsers.parse('the monitoring point has a sensor with id "{sensor_id}", model "{model}"'))
def create_sensor(client: TestClient, auth_headers, sensor_id: str, model: str, context):
    point_id = context["current_point"]["id"]
    response = client.post(
        "/sensors/",
        json={"id": sensor_id, "model": model, "monitoring_point_id": point_id},
        headers=auth_headers
    )
    assert response.status_code == 201

# ==================== WHEN ====================

@when(parsers.parse('I associate a sensor with id "{sensor_id}", model "{model}" to the monitoring point'))
def associate_sensor(client: TestClient, auth_headers, sensor_id: str, model: str, context):
    point_id = context["current_point"]["id"]
    response = client.post(
        "/sensors/",
        json={"id": sensor_id, "model": model, "monitoring_point_id": point_id},
        headers=auth_headers
    )
    context["response"] = response
    if response.status_code == 201:
        context["current_sensor"] = response.json()

@when(parsers.parse('I try to associate a sensor with id "{sensor_id}", model "{model}" to the monitoring point'))
def try_associate_sensor(client: TestClient, auth_headers, sensor_id: str, model: str, context):
    point_id = context["current_point"]["id"]
    response = client.post(
        "/sensors/",
        json={"id": sensor_id, "model": model, "monitoring_point_id": point_id},
        headers=auth_headers
    )
    context["response"] = response

# ==================== THEN ====================

@then(parsers.parse('the response status should be {status:d}'))
def check_status(context, status: int):
    assert context["response"].status_code == status

@then(parsers.parse('the sensor model should be "{expected_model}"'))
def check_sensor_model(context, expected_model: str):
    sensor = context["current_sensor"]
    assert sensor["model"] == expected_model

@then(parsers.parse('the error should mention "{text}"'))
def check_error_message(context, text: str):
    data = context["response"].json()
    assert text in data["detail"]

@pytest.fixture
def context():
    return {}
