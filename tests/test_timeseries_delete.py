"""
Timeseries Delete
"""


def test_delete_timeseries(client):
    ts = client.post("/timeseries/", json={"label": "delete-ts"}).json()

    response = client.delete(f"/timeseries/{ts['id']}")

    assert response.status_code == 200
    assert response.json()["deleted_id"] == ts["id"]


def test_delete_timeseries_not_found(client, mock_uuid):
    response = client.delete(f"/timeseries/{mock_uuid}")
    assert response.status_code == 404