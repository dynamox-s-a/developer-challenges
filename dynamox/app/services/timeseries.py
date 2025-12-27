import json
from datetime import datetime

from sqlalchemy import select, func, insert
from sqlalchemy.orm import Session

from app.models.timeseries import TimeSeries, DataPoint


def create_timeseries(db: Session, name: str, metadata: dict | None, points: list[dict]) -> TimeSeries:
    """
    Create a new TimeSeries record and persist all its DataPoints.

    Key design choices:
    - The TimeSeries metadata is stored as JSON (serialized to TEXT) for SQLite friendliness.
    - Data points are sorted by timestamp before insertion to provide predictable retrieval order.
    - Data points are inserted using a bulk insert (SQLAlchemy Core insert) to reduce Python/ORM overhead.

    Parameters
    ----------
    db:
        SQLAlchemy Session (unit of work) for this request.
    name:
        Human-readable name of the time series.
    metadata:
        Optional dictionary with extra information (stored as JSON).
    points:
        List of dicts with {"timestamp": datetime, "value": float}.

    Returns
    -------
    TimeSeries:
        The newly created TimeSeries ORM object (refreshed from DB).
    """
    # Create the parent entity first.
    ts = TimeSeries(name=name, metadata_json=json.dumps(metadata) if metadata is not None else None)
    db.add(ts)

    # Flush sends pending changes to the DB without committing.
    # This ensures ts.id is available for the foreign key in datapoints.
    db.flush()

    # Sort points by timestamp to keep storage and retrieval consistent.
    sorted_points = sorted(points, key=lambda p: p["timestamp"])

    # Prepare rows for bulk insert.
    rows = [
        {"timeseries_id": ts.id, "timestamp": p["timestamp"], "value": float(p["value"])}
        for p in sorted_points
    ]

    # Bulk insert datapoints. This is typically much faster than creating ORM objects
    # for each DataPoint when the payload is large.
    if rows:
        db.execute(insert(DataPoint), rows)

    # Commit the transaction and refresh the object to obtain DB-generated fields.
    db.commit()
    db.refresh(ts)
    return ts


def get_timeseries_or_none(db: Session, ts_id: str) -> TimeSeries | None:
    """
    Retrieve a TimeSeries by ID or return None if it does not exist.

    This is a small helper to keep routing logic clean.
    """
    return db.get(TimeSeries, ts_id)


def delete_timeseries(db: Session, ts: TimeSeries) -> None:
    """
    Delete a TimeSeries and commit the transaction.

    Cascading behavior:
    - Related DataPoints are removed automatically via FK ondelete="CASCADE"
      and ORM cascade settings.
    """
    db.delete(ts)
    db.commit()


def count_timeseries(db: Session) -> int:
    """
    Return the total number of stored time series.
    """
    return db.scalar(select(func.count()).select_from(TimeSeries)) or 0


def fetch_points(
    db: Session,
    ts_id: str,
    from_dt: datetime | None,
    to_dt: datetime | None,
    limit: int | None,
    offset: int | None,
) -> tuple[list[DataPoint], int]:
    """
    Fetch datapoints for a specific time series, optionally filtered by a time window,
    and optionally paginated with limit/offset.

    Notes:
    - Results are ordered by timestamp ASC to represent time evolution.
    - The function returns both the selected page and the total count in the window.

    Returns
    -------
    (points, total):
        points: list of DataPoint ORM objects in the requested page
        total: total number of datapoints matching the window (ignoring pagination)
    """
    q = select(DataPoint).where(DataPoint.timeseries_id == ts_id)

    # Apply optional time window filters.
    if from_dt is not None:
        q = q.where(DataPoint.timestamp >= from_dt)
    if to_dt is not None:
        q = q.where(DataPoint.timestamp <= to_dt)

    # Compute the total count in the given window (before pagination).
    total = db.scalar(select(func.count()).select_from(q.subquery())) or 0

    # Apply ordering and pagination.
    q = q.order_by(DataPoint.timestamp.asc())
    if offset:
        q = q.offset(offset)
    if limit:
        q = q.limit(limit)

    points = db.execute(q).scalars().all()
    return points, total


def list_timeseries_optimized(
    db: Session,
    limit: int,
    offset: int,
    name: str | None,
):
    """
    List time series using a single query that also returns points_count per series.

    Performance goal:
    - Avoid N+1 queries when computing the number of datapoints per time series.
    - Compute counts via a grouped subquery and an OUTER JOIN.

    Parameters
    ----------
    limit, offset:
        Pagination controls.
    name:
        Optional substring filter applied to the time series name.

    Returns
    -------
    (items, total):
        items: list of dictionaries with id, name, created_at, points_count
        total: total number of time series matching the filter (for pagination)
    """
    # Subquery: count datapoints per time series ID.
    counts_sq = (
        select(
            DataPoint.timeseries_id.label("ts_id"),
            func.count(DataPoint.id).label("points_count"),
        )
        .group_by(DataPoint.timeseries_id)
        .subquery()
    )

    # Main query: time series plus the aggregated points_count (coalesced to 0).
    base = (
        select(
            TimeSeries.id,
            TimeSeries.name,
            TimeSeries.created_at,
            func.coalesce(counts_sq.c.points_count, 0).label("points_count"),
        )
        .outerjoin(counts_sq, counts_sq.c.ts_id == TimeSeries.id)
    )

    # Optional filtering by name substring.
    if name:
        base = base.where(TimeSeries.name.like(f"%{name}%"))

    # Total rows matching filter, used for pagination metadata.
    total = db.scalar(select(func.count()).select_from(base.subquery())) or 0

    # Apply ordering and pagination.
    rows = (
        db.execute(
            base.order_by(TimeSeries.created_at.desc()).limit(limit).offset(offset)
        )
        .all()
    )

    # Convert SQLAlchemy row objects into plain dictionaries for response schemas.
    items = [
        {
            "id": r.id,
            "name": r.name,
            "points_count": int(r.points_count),
            "created_at": r.created_at,
        }
        for r in rows
    ]

    return items, total
