# run with:
#   locust -f load_tests/locustfile.py --host=http://localhost:80
#
# headless (CI):
#   locust -f load_tests/locustfile.py --host=http://localhost:80 \
#          --headless -u 100 -r 10 --run-time 60s --html load_tests/report.html

import random
import string
from locust import HttpUser, TaskSet, task, between, events


def _rand_name(prefix="series"):
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"{prefix}-{suffix}"


def _gen_series(n=50) -> dict:
    base = 1_700_000_000.0
    val = random.uniform(0.4, 0.8)
    data = []
    for i in range(n):
        val += random.gauss(0, 0.05)
        val = max(0.01, val)
        data.append({"timestamp": base + float(i), "value": round(val, 4)})
    return {"name": _rand_name(), "description": "load test", "unit": "mm/s", "data": data}


# shared state so readers can actually find series created by writers
_ids: list[str] = []


class WriteTasks(TaskSet):
    @task
    def store(self):
        payload = _gen_series(n=random.randint(20, 100))
        with self.client.post("/api/v1/timeseries/", json=payload, name="POST /timeseries", catch_response=True) as r:
            if r.status_code == 201:
                _ids.append(r.json()["id"])
            elif r.status_code == 409:
                r.success()  # name collision under high concurrency is fine
            else:
                r.failure(f"unexpected {r.status_code}")


class ReadTasks(TaskSet):
    @task(4)
    def metrics(self):
        if not _ids:
            return
        sid = random.choice(_ids)
        with self.client.get(f"/api/v1/timeseries/{sid}/metrics", name="GET metrics", catch_response=True) as r:
            if r.status_code in (200, 404):
                r.success()
            else:
                r.failure(f"unexpected {r.status_code}")

    @task(3)
    def get_series(self):
        if not _ids:
            return
        sid = random.choice(_ids)
        with self.client.get(f"/api/v1/timeseries/{sid}", name="GET series", catch_response=True) as r:
            if r.status_code in (200, 404):
                r.success()
            else:
                r.failure(f"unexpected {r.status_code}")

    @task(2)
    def predict(self):
        if not _ids:
            return
        sid = random.choice(_ids)
        body = {"steps": random.randint(5, 20), "method": random.choice(["linear", "holt_winters", "auto"])}
        with self.client.post(f"/api/v1/timeseries/{sid}/predict", json=body, name="POST predict", catch_response=True) as r:
            if r.status_code in (200, 404, 422):
                r.success()
            else:
                r.failure(f"unexpected {r.status_code}")

    @task(2)
    def list_series(self):
        page = random.randint(1, 3)
        self.client.get(f"/api/v1/timeseries/?page={page}&page_size=10", name="GET list")

    @task(1)
    def count(self):
        self.client.get("/api/v1/timeseries/count", name="GET count")

    @task(1)
    def health(self):
        self.client.get("/health", name="GET health")


class CleanupTasks(TaskSet):
    @task
    def delete(self):
        if not _ids:
            return
        sid = _ids.pop(0)
        with self.client.delete(f"/api/v1/timeseries/{sid}", name="DELETE series", catch_response=True) as r:
            if r.status_code in (200, 404):
                r.success()
            else:
                r.failure(f"unexpected {r.status_code}")


class Writer(HttpUser):
    tasks = [WriteTasks]
    wait_time = between(0.5, 2)
    weight = 2


class Reader(HttpUser):
    tasks = [ReadTasks]
    wait_time = between(0.2, 1)
    weight = 5


class Cleanup(HttpUser):
    tasks = [CleanupTasks]
    wait_time = between(5, 15)
    weight = 1


@events.quitting.add_listener
def check_slos(environment, **kwargs):
    stats = environment.stats.total
    if not stats.num_requests:
        return

    p95 = stats.get_response_time_percentile(0.95)
    err_rate = stats.fail_ratio * 100

    failed = []
    if p95 and p95 > 350:
        failed.append(f"p95 {p95:.0f}ms > 350ms")
    if err_rate > 1.0:
        failed.append(f"error rate {err_rate:.2f}% > 1%")

    if failed:
        print("\n[FAIL] SLO violations:", ", ".join(failed))
        environment.process_exit_code = 1
    else:
        print(f"\n[OK] p95={p95:.0f}ms  errors={err_rate:.2f}%")
