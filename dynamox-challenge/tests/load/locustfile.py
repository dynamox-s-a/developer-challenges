import random

from locust import HttpUser, between, task

SAMPLE_PAYLOAD = {
    "name": "load-test-series",
    "metadata": {"unit": "mm/s", "sensor": "LOAD-01"},
    "data": [
        {"timestamp": "2024-03-01T09:00:00Z", "value": 0.42},
        {"timestamp": "2024-03-01T09:00:01Z", "value": 0.87},
        {"timestamp": "2024-03-01T09:00:02Z", "value": 1.23},
        {"timestamp": "2024-03-01T09:00:03Z", "value": 0.65},
        {"timestamp": "2024-03-01T09:00:04Z", "value": 0.91},
    ],
}


class TimeseriesUser(HttpUser):
    wait_time = between(0.5, 1.5)

    def on_start(self) -> None:
        """Create one series per user so GET-by-id and GET-metrics have valid IDs."""
        r = self.client.post("/api/v1/timeseries", json=SAMPLE_PAYLOAD)
        if r.status_code == 201:
            self.series_id = r.json()["id"]
        else:
            self.series_id = None

    @task(10)
    def health(self) -> None:
        self.client.get("/health")

    @task(8)
    def count(self) -> None:
        self.client.get("/api/v1/timeseries/count")

    @task(5)
    def get_metrics(self) -> None:
        if self.series_id:
            self.client.get(f"/api/v1/timeseries/{self.series_id}/metrics")

    @task(5)
    def get_timeseries(self) -> None:
        if self.series_id:
            self.client.get(f"/api/v1/timeseries/{self.series_id}")

    @task(2)
    def create_timeseries(self) -> None:
        payload = dict(SAMPLE_PAYLOAD)
        payload["name"] = f"load-test-{random.randint(1000, 9999)}"
        payload["data"] = [
            {"timestamp": f"2024-03-01T09:00:{i:02d}Z", "value": 0.5 + i * 0.1}
            for i in range(5)
        ]
        self.client.post("/api/v1/timeseries", json=payload)
