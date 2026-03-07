"""
Timeseries Creation
"""


def test_create_timeseries(client):
    response = client.post("/timeseries/", json={"label": "create-ts"})

    assert response.status_code == 201
    data = response.json()

    assert data["label"] == "create-ts"
    assert "id" in data


def test_create_timeseries_duplicate_label(client):
    client.post("/timeseries/", json={"label": "create-ts"})
    response = client.post("/timeseries/", json={"label": "create-ts"})

    assert response.status_code == 409


def test_create_timeseries_invalid_label(client):
    response = client.post("/timeseries/", json={"label": "   "})

    assert response.status_code == 422