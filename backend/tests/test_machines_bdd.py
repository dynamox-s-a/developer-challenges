import pytest
from pytest_bdd import scenarios, given, when, then, parsers
from fastapi.testclient import TestClient

scenarios('features/machines.feature')

# ==================== GIVEN ====================

@given("I am an authenticated user")
def authenticated_user(auth_headers):
    return auth_headers

@given(parsers.parse('I have created a machine with name "{name}" and type "{machine_type}"'))
def create_machine_given(client: TestClient, auth_headers, name: str, machine_type: str, context):
    response = client.post("/machines/", json={"name": name, "type": machine_type}, headers=auth_headers)
    assert response.status_code == 201
    context["current_machine"] = response.json()
    context.setdefault("machines", []).append(response.json())
    return response.json()

# ==================== WHEN ====================

@when(parsers.parse('I create a machine with name "{name}" and type "{machine_type}"'))
def create_machine(client: TestClient, auth_headers, name: str, machine_type: str, context):
    response = client.post("/machines/", json={"name": name, "type": machine_type}, headers=auth_headers)
    context["response"] = response
    if response.status_code == 201:
        context["current_machine"] = response.json()

@when("I request the list of machines")
def list_machines(client: TestClient, auth_headers, context):
    response = client.get("/machines/", headers=auth_headers)
    context["response"] = response

@when("I request the machine by its id")
def get_machine(client: TestClient, auth_headers, context):
    machine_id = context["current_machine"]["id"]
    response = client.get(f"/machines/{machine_id}", headers=auth_headers)
    context["response"] = response

@when(parsers.parse('I update the machine name to "{new_name}"'))
def update_machine_name(client: TestClient, auth_headers, new_name: str, context):
    machine_id = context["current_machine"]["id"]
    response = client.put(f"/machines/{machine_id}", json={"name": new_name}, headers=auth_headers)
    context["response"] = response
    if response.status_code == 200:
        context["current_machine"] = response.json()

@when("I delete the machine")
def delete_machine(client: TestClient, auth_headers, context):
    machine_id = context["current_machine"]["id"]
    response = client.delete(f"/machines/{machine_id}", headers=auth_headers)
    context["response"] = response

# ==================== THEN ====================

@then(parsers.parse('the response status should be {status:d}'))
def check_status(context, status: int):
    assert context["response"].status_code == status

@then(parsers.parse('the machine should have name "{expected_name}"'))
def check_machine_name(context, expected_name: str):
    if "current_machine" in context:
        machine = context["current_machine"]
    else:
        machine = context["response"].json()
    assert machine["name"] == expected_name

@then(parsers.parse('the machine should have type "{expected_type}"'))
def check_machine_type(context, expected_type: str):
    if "current_machine" in context:
        machine = context["current_machine"]
    else:
        machine = context["response"].json()
    assert machine["type"] == expected_type

@then(parsers.parse('I should see at least {count:d} machines'))
def check_machines_count(context, count: int):
    machines = context["response"].json()
    assert len(machines) >= count

@then("the response should contain a success message")
def check_success_message(context):
    data = context["response"].json()
    assert "message" in data

@pytest.fixture
def context():
    return {}
