from datetime import UTC, datetime, timedelta
import math
from typing import Any

# ---------------------------------------------------------------------------
# Base timestamps — a fixed anchor point so tests are deterministic
# ---------------------------------------------------------------------------

BASE_TIME = datetime(2024, 3, 1, 9, 0, 0, tzinfo=UTC)


def _ts(offset_seconds: int) -> str:
    return (BASE_TIME + timedelta(seconds=offset_seconds)).isoformat()


# ---------------------------------------------------------------------------
# Factory functions — call these in tests to get a fresh copy every time
# ---------------------------------------------------------------------------


def make_data_points(n: int, start_offset: int = 0) -> list[dict[str, Any]]:
    return [
        {"timestamp": _ts(start_offset + i), "value": float(i + 1)} for i in range(n)
    ]


def make_create_payload(
    n: int = 5,
    name: str | None = "test-series",
    metadata: dict | None = None,
    start_offset: int = 0,
) -> dict[str, Any]:
    return {
        "name": name,
        "metadata": metadata or {"unit": "mm/s", "sensor": "ACC-01"},
        "data": make_data_points(n, start_offset=start_offset),
    }


# ---------------------------------------------------------------------------
# Expected metrics helpers
# ---------------------------------------------------------------------------


def expected_stddev(values: list[float]) -> float:
    n = len(values)
    mean = sum(values) / n
    variance = sum((v - mean) ** 2 for v in values) / (n - 1)
    return math.sqrt(variance)


# ---------------------------------------------------------------------------
# Pre-built payloads for common scenarios
# ---------------------------------------------------------------------------

VALID_PAYLOAD_5_POINTS: dict[str, Any] = make_create_payload(n=5)

VALID_PAYLOAD_1_POINT: dict[str, Any] = make_create_payload(
    n=1, name="single-point-series"
)

VALID_PAYLOAD_NO_NAME: dict[str, Any] = make_create_payload(n=3, name=None)

VALID_PAYLOAD_NO_METADATA: dict[str, Any] = {
    "name": "no-metadata-series",
    "data": make_data_points(3),
}

INVALID_PAYLOAD_EMPTY_DATA: dict[str, Any] = {
    "name": "empty-series",
    "metadata": {},
    "data": [],
}

INVALID_PAYLOAD_DUPLICATE_TIMESTAMPS: dict[str, Any] = {
    "name": "duplicate-ts-series",
    "metadata": {},
    "data": [
        {"timestamp": _ts(0), "value": 1.0},
        {"timestamp": _ts(0), "value": 2.0},
    ],
}

INVALID_PAYLOAD_MISSING_DATA: dict[str, Any] = {
    "name": "missing-data-field",
    "metadata": {},
}


# ---------------------------------------------------------------------------
# Expected metrics for the standard 5-point series (values 1.0 → 5.0)
# ---------------------------------------------------------------------------

_FIVE_VALUES = [1.0, 2.0, 3.0, 4.0, 5.0]

EXPECTED_METRICS_5_POINTS: dict[str, Any] = {
    "count": 5,
    "min": 1.0,
    "max": 5.0,
    "mean": 3.0,
    "stddev": expected_stddev(_FIVE_VALUES),
}
