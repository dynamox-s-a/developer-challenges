from locust import HttpUser, between

from tests.load.locustfile import SAMPLE_PAYLOAD


class TimeseriesUser(HttpUser):
    wait_time = between(0.5, 1.5)

    def on_start(self) -> None:
        r = self.client.post("/api/v1/timeseries", json=SAMPLE_PAYLOAD)
        if r.status_code == 201:
            self.series_id = r.json()["id"]
        else:
            self.series_id = None
