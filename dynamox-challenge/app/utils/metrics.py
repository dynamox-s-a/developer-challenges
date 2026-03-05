from typing import Any


def _safe_float(value: Any) -> float | None:
    if value is None:
        return None
    return float(value)


def format_metrics_result(series, sql_result) -> dict:
    """Format a raw SQL aggregation row into a metrics dictionary.

    Args:
        series:     The Timeseries ORM object (for id, name, time_range_*)
        sql_result: Named row from SQLAlchemy with labels:
                    mean, stddev, min, max, count

    Returns:
        A dict mapping directly to MetricsResponse fields.
    """
    return {
        "series_id": series.id,
        "name": series.name,
        "mean": _safe_float(sql_result.mean),
        "stddev": _safe_float(sql_result.stddev),
        "min": _safe_float(sql_result.min),
        "max": _safe_float(sql_result.max),
        "count": sql_result.count,
        "time_range_start": series.time_range_start,
        "time_range_end": series.time_range_end,
    }
