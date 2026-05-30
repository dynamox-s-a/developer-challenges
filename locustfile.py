from locust import HttpUser
from locust import task


class TimeSeriesUser(
    HttpUser
):

    @task
    def health_check(
        self,
    ):
        self.client.get("/")