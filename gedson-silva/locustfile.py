from locust import HttpUser, task, between
from uuid import uuid4

class TimeSeriesUser(HttpUser):
    wait_time = between(1, 2)

    def on_start(self):
        res = self.client.post("/api/v1/series/", json={
            "name": f"load-test-{uuid4()}",
            "points": [
                {"timestamp": f"2024-01-01T00:0{i}:00Z", "value": float(i)}
                for i in range(5)
            ]
        })
        self.series_id = res.json().get("id")

    @task(3)
    def get_series(self):
        self.client.get(f"/api/v1/series/{self.series_id}")

    @task(2)
    def get_metrics(self):
        self.client.get(f"/api/v1/series/{self.series_id}/metrics")

    @task(1)
    def count(self):
        self.client.get("/api/v1/series/count")