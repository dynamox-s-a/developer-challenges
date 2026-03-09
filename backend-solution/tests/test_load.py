import pytest


@pytest.mark.load
def test_create_series_load(client, benchmark):
    def create_series():
        return client.post(
            '/time-series/',
            json={
                'name': 'Load Test',
                'data_points': [
                    {'timestamp': '2024-01-01T10:00:00', 'value': 10.0},
                    {'timestamp': '2024-01-01T10:01:00', 'value': 20.0},
                ],
            },
        )

    result = benchmark(create_series)
    assert result.status_code == int(201)


@pytest.mark.load
def test_get_series_load(client, benchmark):
    response = client.post(
        '/time-series/',
        json={
            'name': 'Load Test Read',
            'data_points': [
                {'timestamp': '2024-01-01T10:00:00', 'value': 10.0},
            ],
        },
    )
    series_id = response.json()['id']

    result = benchmark(client.get, f'/time-series/{series_id}')
    assert result.status_code == int(200)


@pytest.mark.load
def test_predict_load(client, benchmark):
    response = client.post(
        '/time-series/',
        json={
            'name': 'Load Test Predict',
            'data_points': [
                {'timestamp': '2024-01-01T10:00:00', 'value': 10.0},
                {'timestamp': '2024-01-01T10:01:00', 'value': 20.0},
                {'timestamp': '2024-01-01T10:02:00', 'value': 30.0},
                {'timestamp': '2024-01-01T10:03:00', 'value': 40.0},
            ],
        },
    )
    series_id = response.json()['id']

    result = benchmark(client.get, f'/time-series/{series_id}/predict?steps=5')
    assert result.status_code == int(200)
