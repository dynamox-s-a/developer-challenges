import pytest


@pytest.mark.benchmark
def test_root_latency(client, benchmark):
    result = benchmark(client.get, '/')
    assert result.status_code == int(200)


@pytest.mark.benchmark
def test_count_latency(client, benchmark):
    result = benchmark(client.get, '/time-series/count')
    assert result.status_code == int(200)
