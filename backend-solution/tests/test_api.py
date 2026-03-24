from http import HTTPStatus


def test_root_returns_message(client):
    response = client.get('/')

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {'message': 'Signal Processing API'}


def test_create_time_series_success(client):
    payload = {
        'name': 'Sensor Temperatura',
        'data_points': [
            {'timestamp': '2024-01-01T10:00:00', 'value': 25.5},
            {'timestamp': '2024-01-01T10:01:00', 'value': 26.0},
        ],
    }

    response = client.post('/time-series/', json=payload)

    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data['name'] == 'Sensor Temperatura'
    assert data['id'] is not None
    assert len(data['data_points']) == int(2)


def test_create_time_series_empty_data_points(client):
    payload = {
        'name': 'Sensor Vazio',
        'data_points': [],
    }

    response = client.post('/time-series/', json=payload)

    assert response.status_code == HTTPStatus.CREATED
    assert response.json()['data_points'] == []


def test_get_time_series_success(client):
    create_response = client.post(
        '/time-series/',
        json={
            'name': 'Sensor Pressao',
            'data_points': [
                {'timestamp': '2024-01-01T10:00:00', 'value': 100.0},
            ],
        },
    )
    series_id = create_response.json()['id']

    response = client.get(f'/time-series/{series_id}')

    assert response.status_code == HTTPStatus.OK
    assert response.json()['name'] == 'Sensor Pressao'


def test_get_time_series_not_found(client):
    response = client.get('/time-series/999')

    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json()['detail'] == 'Time series not found'


def test_get_count_empty(client):
    response = client.get('/time-series/count')

    assert response.status_code == HTTPStatus.OK
    assert response.json()['total'] == 0


def test_get_count_with_series(client):
    for i in range(3):
        client.post(
            '/time-series/',
            json={
                'name': f'Series {i}',
                'data_points': [
                    {'timestamp': '2024-01-01T10:00:00', 'value': 1.0}
                ],
            },
        )

    response = client.get('/time-series/count')

    assert response.status_code == HTTPStatus.OK
    assert response.json()['total'] == int(3)


def test_get_metrics_success(client):
    create_response = client.post(
        '/time-series/',
        json={
            'name': 'Metrics Test',
            'data_points': [
                {'timestamp': '2024-01-01T10:00:00', 'value': 10.0},
                {'timestamp': '2024-01-01T10:01:00', 'value': 20.0},
                {'timestamp': '2024-01-01T10:02:00', 'value': 30.0},
            ],
        },
    )
    series_id = create_response.json()['id']

    response = client.get(f'/time-series/{series_id}/metrics')

    assert response.status_code == HTTPStatus.OK
    metrics = response.json()
    assert metrics['count'] == int(3)
    assert metrics['min_value'] == float(10.0)
    assert metrics['max_value'] == float(30.0)
    assert metrics['mean_value'] == float(20.0)


def test_get_metrics_not_found(client):
    response = client.get('/time-series/999/metrics')

    assert response.status_code == HTTPStatus.NOT_FOUND


def test_get_metrics_no_data_points(client):
    create_response = client.post(
        '/time-series/',
        json={'name': 'Empty Series', 'data_points': []},
    )
    series_id = create_response.json()['id']

    response = client.get(f'/time-series/{series_id}/metrics')

    assert response.status_code == HTTPStatus.BAD_REQUEST


def test_delete_time_series_success(client):
    create_response = client.post(
        '/time-series/',
        json={
            'name': 'Para Deletar',
            'data_points': [
                {'timestamp': '2024-01-01T10:00:00', 'value': 1.0}
            ],
        },
    )
    series_id = create_response.json()['id']

    delete_response = client.delete(f'/time-series/{series_id}')

    assert delete_response.status_code == HTTPStatus.OK

    get_response = client.get(f'/time-series/{series_id}')
    assert get_response.status_code == HTTPStatus.NOT_FOUND


def test_delete_time_series_not_found(client):
    response = client.delete('/time-series/999')

    assert response.status_code == HTTPStatus.NOT_FOUND


def test_predict_time_series_success(client):
    create_response = client.post(
        '/time-series/',
        json={
            'name': 'Prediction Test',
            'data_points': [
                {'timestamp': '2024-01-01T10:00:00', 'value': 10.0},
                {'timestamp': '2024-01-01T10:01:00', 'value': 20.0},
                {'timestamp': '2024-01-01T10:02:00', 'value': 30.0},
                {'timestamp': '2024-01-01T10:03:00', 'value': 40.0},
            ],
        },
    )
    series_id = create_response.json()['id']

    response = client.get(f'/time-series/{series_id}/predict?steps=3')

    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data['series_id'] == series_id
    assert data['historical_count'] == int(4)
    assert len(data['predictions']) == int(3)


def test_predict_time_series_not_found(client):
    response = client.get('/time-series/999/predict')

    assert response.status_code == HTTPStatus.NOT_FOUND


def test_predict_time_series_insufficient_data(client):
    create_response = client.post(
        '/time-series/',
        json={
            'name': 'Single Point',
            'data_points': [
                {'timestamp': '2024-01-01T10:00:00', 'value': 10.0},
            ],
        },
    )
    series_id = create_response.json()['id']

    response = client.get(f'/time-series/{series_id}/predict')

    assert response.status_code == HTTPStatus.BAD_REQUEST
