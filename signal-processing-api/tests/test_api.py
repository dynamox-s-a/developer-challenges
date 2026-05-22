from datetime import datetime

from fastapi.testclient import TestClient

from main import app


class TestAPI:
    """Main Testing Class, which tests all routes"""

    def valid_date_format(self, datetime_string, date_format = '%Y-%m-%dT%H:%M:%S'):
        """Util function that checks if date format is ISO8601"""

        try:
            datetime.strptime(datetime_string, date_format)
            return True
        except ValueError:
            return False

    def test_main_route(self, client: TestClient):
        """Tests if API is running"""

        response = client.get('/')

        assert response.status_code == 200
        assert response.json() == {
                                'message': 'Welcome to Signal Processor API',
                                'api_docs': 'http://127.0.0.1:80/docs'
                            }

    def test_create_timeseries_route(self, client: TestClient, sample_data):
        """Tries to create a new time-series"""

        data = sample_data
        response = client.post('/series/', json=data)
        assert response.status_code == 200

    def test_count_timeseries_route(self, client: TestClient):
        """Checks if the number of time-series stored is correct"""

        response = client.get('/series/count/')

        assert response.status_code == 200
        assert response.json() == {'time_series_count': 1}

    def test_fail_creating_route(self, client: TestClient):
        """Tries to create a time-series with an unprocessable data"""

        unprocessable_data = {
                            "sensor": "SENS_3452",
                            "created_at": "2025-01-01:00:00",
                            "measurements": [
                                    { "timestamp": "2025-01-01T00:00:00","air_humidity": 78},
                                    { "timestamp": "2025-01-01T11:00:00", "air_humidity": 79}
                                ]
                            }
        
        response = client.post('/series/', json=unprocessable_data)

        assert response.status_code == 422


    def test_metrics_route(self, client: TestClient):
        """Checks if the metrics is corrects"""

        response = client.get('/series/metrics/1')

        assert response.status_code == 200
        assert response.json() == {
                                    "average_humidity": 82.5,
                                    "max_humidity": 87,
                                    "min_humidity": 78,
                                    "stddev": 3.1710495984067415
                                }


    def test_non_existent_timeseries_metrics(self, client: TestClient):
        """Tries to retrieve metrics from a non existent time-series"""

        response = client.get('/series/metrics/190')

        assert response.status_code == 404
        assert response.json() == {'detail': 'Time-series not found'}


    def test_read_timeseries(self, client: TestClient, sample_data):
        """Checks if the first time-series record is correct"""

        response = client.get('/series/1')

        assert response.status_code == 200
        assert response.json() == sample_data


    def test_cannot_read_timeseries(self, client: TestClient):
        """Tries to read a non existent time-series"""

        response = client.get('/series/324')

        assert response.status_code == 404
        assert response.json() == {'detail': 'Time-series not found'}


    def test_read_all_timeseries(self, client: TestClient):
        """Tries to read all time-series stored
            Check if the route returns a list of records and
            if data format is expected"""

        response = client.get('/series/')

        data = response.json()

        assert response.status_code == 200

        assert isinstance(data, list)
        assert isinstance(data[0]['sensor'], str)
        assert self.valid_date_format(data[0]['created_at'])
        assert isinstance(data[0]['id'], int)


    def test_failed_delete_timeseries(self, client: TestClient):
        """Checks if request fails trying to delete a non-existent time-series"""

        response = client.delete('/series/999')

        assert response.status_code == 200
        assert response.json() == {'message': 'Time-series not found, please check if the ID is correct'}


    def test_read_full_timeseries(self, client: TestClient):
        """Checks if it returns a list of all time-series and 
            if the data type is correct"""

        response = client.get('/series/full_series/')

        data = response.json()

        assert response.status_code == 200

        assert isinstance(data, list)
        assert isinstance(data[0]['sensor'], str)
        assert self.valid_date_format(data[0]['created_at'])
        assert isinstance(data[0]['id'], int)

        assert isinstance(data[0]['measurements'], list)

        first_timestamp = data[0]['measurements'][0]['timestamp']
        first_air_humidity = data[0]['measurements'][0]['air_humidity']

        assert self.valid_date_format(first_timestamp)
        assert isinstance(first_air_humidity, (int, float))


    def test_delete_timeseries(self, client: TestClient):
        """Checks if can delete a existent time-series"""

        response = client.delete('/series/1')

        assert response.status_code == 200
        assert response.json() == {"message": "Time-series successfully deleted"}


    def test_non_existent_full_timeseries(self, client: TestClient):
        """Checks if the database is empty, if it returns an empty list"""

        response = client.get('/series/full_series/')

        assert response.status_code == 200
        assert response.json() == []