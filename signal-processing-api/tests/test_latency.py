import time

from fastapi.testclient import TestClient

from main import app


class TestLatency:
    """Latency Testing Class, which tests the latency of all routes"""

    def test_latency_main(self, client: TestClient):
        """Main root latency test"""

        start_time = time.time()

        response = client.get('/')

        finish_time = time.time()
        response_time = finish_time - start_time

        assert response.status_code == 200
        assert response_time < 0.35

    def test_latency_create_timeseries(self, client: TestClient, sample_data):
        """Creating timeseries latency test"""

        start_time = time.time()

        data = sample_data        
        response = client.post('/series/', json=data)

        finish_time = time.time()
        response_time = finish_time - start_time

        assert response.status_code == 200
        assert response_time < 0.35


    def test_latency_count_series(self, client: TestClient):
        """Count timeseries latency test"""

        start_time = time.time()

        response = client.get('/series/count/')

        finish_time = time.time()
        response_time = finish_time - start_time

        assert response.status_code == 200
        assert response_time < 0.35


    def test_latency_metrics(self, client: TestClient):
        """Metrics latency test"""

        start_time = time.time()

        response = client.get('/series/metrics/1')
        finish_time = time.time()
        response_time = finish_time - start_time

        assert response.status_code == 200
        assert response_time < 0.35


    def test_latency_read_timeseries(self, client: TestClient):
        """Reading first timeseries record latency test"""

        start_time = time.time()

        response = client.get('/series/1')

        finish_time = time.time()
        response_time = finish_time - start_time

        assert response.status_code == 200
        assert response_time < 0.35


    def test_latency_read_all_timeseries(self, client: TestClient):
        """Reading all timeseries records latency test"""

        start_time = time.time()

        response = client.get('/series/')

        finish_time = time.time()
        response_time = finish_time - start_time

        assert response.status_code == 200
        assert response_time < 0.35


    def test_latency_read_full_timeseries(self, client: TestClient):
        """Reading a list of all time-series and its measurements
            latency test"""

        start_time = time.time()

        response = client.get('/series/full_series/')

        finish_time = time.time()
        response_time = finish_time - start_time

        assert response.status_code == 200
        assert response_time < 0.35
        

    def test_latency_delete_timeseries(self, client: TestClient):
        """Deleting time-series latency test"""

        start_time = time.time()

        response = client.delete('/series/1')

        finish_time = time.time()
        response_time = finish_time - start_time

        assert response.status_code == 200
        assert response_time < 0.35