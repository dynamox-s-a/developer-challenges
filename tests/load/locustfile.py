from locust import HttpUser, task, between, events


class TimeSeriesUser(HttpUser):
    host = "http://localhost:8000"
    wait_time = between(1, 2)

    @task(3)
    def create_timeseries(self):
        self.client.post(
            "/timeseries",
            json={"values": [10, 20, 30, 40]}
        )

    @task(2)
    def get_count(self):
        self.client.get("/timeseries/count")

    @task(1)
    def health_check(self):
        self.client.get("/")

    @events.request.add_listener
    def my_handler(request_type, name, response_time, response_length, response, exception, **kwargs):
        if response_time > 350:
            print(f"⚠ SLA violation: {name} took {response_time}ms")