import pytest
from pytest_bdd import scenarios, given, when, then, parsers
from fastapi.testclient import TestClient

scenarios('features/monitoring_points.feature')

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
def create_point_with_payload(client: TestClient, auth_headers, point_name: str, context):
    machine_id = context["current_machine"]["id"]
    response = client.post(
        f"/machines/{machine_id}/monitoring-points",
        json={"name": point_name, "machine_id": machine_id},
        headers=auth_headers
    )
    assert response.status_code == 201
    context.setdefault("monitoring_points", []).append(response.json())
    context["current_point"] = response.json()

@given("I have multiple machines with monitoring points")
def create_multiple_machines(client: TestClient, auth_headers, context):
    for i in range(3):
        machine_response = client.post(
            "/machines/",
            json={"name": f"Machine {i}", "type": "Fan"},
            headers=auth_headers
        )
        machine = machine_response.json()
        client.post(
            f"/machines/{machine['id']}/monitoring-points",
            json={"name": f"Point {i}", "machine_id": machine['id']},
            headers=auth_headers
        )

# ==================== WHEN ====================

@when(parsers.parse('I create a monitoring point "{point_name}" with machine_id on the machine'))
def create_point(client: TestClient, auth_headers, point_name: str, context):
    machine_id = context["current_machine"]["id"]
    response = client.post(
        f"/machines/{machine_id}/monitoring-points",
        json={"name": point_name, "machine_id": machine_id},
        headers=auth_headers
    )
    context["response"] = response
    if response.status_code == 201:
        context["current_point"] = response.json()

@when(parsers.parse('I try to create a monitoring point "{point_name}" with machine_id on the machine'))
def try_create_point(client: TestClient, auth_headers, point_name: str, context):
    machine_id = context["current_machine"]["id"]
    response = client.post(
        f"/machines/{machine_id}/monitoring-points",
        json={"name": point_name, "machine_id": machine_id},
        headers=auth_headers
    )
    context["response"] = response

@when("I request monitoring points with pagination")
def list_points_paginated(client: TestClient, auth_headers, context):
    response = client.get("/monitoring-points?page=1&size=5", headers=auth_headers)
    context["response"] = response

# ==================== THEN ====================

@then(parsers.parse('the response status should be {status:d}'))
def check_status(context, status: int):
    assert context["response"].status_code == status

@then(parsers.parse('the monitoring point should have name "{expected_name}"'))
def check_point_name(context, expected_name: str):
    point = context["current_point"]
    assert point["name"] == expected_name

@then(parsers.parse('the error should mention "{text}"'))
def check_error_message(context, text: str):
    data = context["response"].json()
    assert text in data["detail"]

@then("the response should contain paginated items")
def check_pagination(context):
    data = context["response"].json()
    assert "items" in data
    assert "page" in data
    assert "size" in data

@pytest.fixture
def context():
    return {}
