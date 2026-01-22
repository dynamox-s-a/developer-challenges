import pytest
from pytest_bdd import scenarios, given, when, then, parsers
from fastapi.testclient import TestClient

scenarios('features/auth.feature')

# ==================== GIVEN ====================

@given("I am a new user")
def new_user():
    return {}

@given(parsers.parse('I am a registered user with email "{email}" and password "{password}"'))
def registered_user(client: TestClient, session, email: str, password: str):
    from app.models import User
    from app.core.security import get_password_hash
    
    user = User(name="Test User", email=email, hash=get_password_hash(password))
    session.add(user)
    session.commit()
    return user

# ==================== WHEN ====================

@when(parsers.parse('I sign up with name "{name}", email "{email}" and password "{password}"'))
def signup_user(client: TestClient, name: str, email: str, password: str, context):
    response = client.post("/auth/signup", json={"name": name, "email": email, "password": password})
    context["response"] = response

@when(parsers.parse('I log in with email "{email}" and password "{password}"'))
def login_user(client: TestClient, email: str, password: str, context):
    response = client.post("/auth/login", data={"username": email, "password": password})
    context["response"] = response

# ==================== THEN ====================

@then(parsers.parse('the signup should return status {status:d}'))
def check_signup_status(context, status: int):
    assert context["response"].status_code == status

@then(parsers.parse('the login should return status {status:d}'))
def check_login_status(context, status: int):
    assert context["response"].status_code == status

@then("I should receive my user id")
def has_user_id(context):
    data = context["response"].json()
    assert "id" in data

@then(parsers.parse('my email should be "{email}"'))
def check_email(context, email: str):
    data = context["response"].json()
    assert data["email"] == email

@then("I should receive an access token")
def has_access_token(context):
    data = context["response"].json()
    assert "access_token" in data

@then(parsers.parse('the token type should be "{token_type}"'))
def check_token_type(context, token_type: str):
    data = context["response"].json()
    assert data["token_type"] == token_type

@then("I should receive my user information")
def has_user_info(context):
    data = context["response"].json()
    assert "user" in data

@pytest.fixture
def context():
    return {}
