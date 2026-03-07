"""
Timeseries Count
"""

def test_count_timeseries(client):
    client.post("/timeseries/", json={"label": "count-ts-1"})
    client.post("/timeseries/", json={"label": "count-ts-2"})

    response = client.get("/timeseries/count")

    assert response.status_code == 200
    assert response.json()["count"] == 2


def test_count_timeseries_empty(client):
    response = client.get("/timeseries/count")

    assert response.status_code == 200
    assert response.json()["count"] == 0