import math
from datetime import datetime

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.timeseries import DataPoint


def compute_metrics(
    db: Session,
    ts_id: str,
    from_dt: datetime | None,
    to_dt: datetime | None,
) -> dict:
    """
    Compute aggregated metrics for a given time series using SQL aggregation.

    Why SQL aggregation?
    - It avoids loading potentially large datasets into application memory.
    - The database is optimized to compute aggregates efficiently.

    Metrics returned:
    - count: number of points in the selected window
    - min: minimum value
    - max: maximum value
    - mean: average value
    - std: population standard deviation (ddof=0)

    Standard deviation strategy (SQLite-friendly):
    - We compute E[x] = AVG(x) and E[x^2] = AVG(x^2) in SQL.
    - Then: variance = E[x^2] - (E[x])^2
    - std = sqrt(variance)

    Parameters
    ----------
    db:
        SQLAlchemy Session for executing queries.
    ts_id:
        Time series ID.
    from_dt, to_dt:
        Optional time window filters. If None, no filtering is applied.

    Returns
    -------
    dict:
        A dictionary containing the metrics.
        If count == 0, numeric metrics are returned as None.
    """
    # Build a single aggregation query.
    q = select(
        func.count().label("count"),
        func.min(DataPoint.value).label("min"),
        func.max(DataPoint.value).label("max"),
        func.avg(DataPoint.value).label("mean"),
        func.avg(DataPoint.value * DataPoint.value).label("mean_sq"),
    ).where(DataPoint.timeseries_id == ts_id)

    # Apply optional time window filters.
    if from_dt is not None:
        q = q.where(DataPoint.timestamp >= from_dt)
    if to_dt is not None:
        q = q.where(DataPoint.timestamp <= to_dt)

    # Execute and fetch the single result row.
    row = db.execute(q).one()
    count = int(row.count or 0)

    # If there are no points in the window, return a consistent payload.
    if count == 0:
        return {"count": 0, "min": None, "max": None, "mean": None, "std": None}

    # Convert SQL results to Python floats where applicable.
    mean = float(row.mean) if row.mean is not None else None
    mean_sq = float(row.mean_sq) if row.mean_sq is not None else None

    # Compute population standard deviation using variance identity.
    #
    # A small clamp is used to avoid negative values caused by floating-point
    # rounding errors (e.g., -1e-16), which would break sqrt().
    std = None
    if mean is not None and mean_sq is not None:
        var = max(0.0, mean_sq - mean * mean)
        std = math.sqrt(var)

    return {
        "count": count,
        "min": float(row.min) if row.min is not None else None,
        "max": float(row.max) if row.max is not None else None,
        "mean": mean,
        "std": std,
    }
