import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session

from app.core.config import MAX_POINTS
from app.database.session import get_db
from app.schemas.timeseries import (
    TimeSeriesCreate,
    TimeSeriesCreated,
    TimeSeriesOut,
    CountOut,
    MetricsOut,
    TimeSeriesListOut,
)
from app.services.timeseries import (
    create_timeseries,
    get_timeseries_or_none,
    delete_timeseries,
    count_timeseries,
    fetch_points,
    list_timeseries_optimized,
)
from app.services.metrics import compute_metrics

# APIRouter groups related endpoints together.
# Here we define all endpoints under the "/timeseries" prefix.
router = APIRouter(prefix="/timeseries", tags=["timeseries"])


def _metadata_dict(metadata_json: str | None) -> dict | None:
    """
    Helper function to deserialize the metadata JSON stored in the database.

    Metadata is stored as a JSON string (TEXT) to keep the project SQLite-friendly.
    This function converts it back to a Python dict for API responses.

    If parsing fails, we return None to avoid breaking the response.
    """
    if metadata_json is None:
        return None
    try:
        return json.loads(metadata_json)
    except Exception:
        return None


@router.post("", response_model=TimeSeriesCreated, status_code=201)
def post_timeseries(payload: TimeSeriesCreate, db: Session = Depends(get_db)):
    """
    Create a new time series and persist its datapoints.

    Workflow:
    1) Validate payload using Pydantic (TimeSeriesCreate).
    2) Enforce an upper limit of datapoints to protect API resources.
    3) Store the time series and datapoints using the service layer.
    4) Return metadata including the generated UUID.

    Status codes:
    - 201: created successfully
    - 413: payload too large (exceeds MAX_POINTS)
    - 422: validation errors (handled by FastAPI/Pydantic)
    """
    # Reject extremely large payloads early to avoid heavy CPU/memory usage.
    if len(payload.points) > MAX_POINTS:
        raise HTTPException(
            status_code=413,
            detail=f"Too many points: {len(payload.points)} > MAX_POINTS({MAX_POINTS})",
        )

    ts = create_timeseries(
        db,
        name=payload.name,
        metadata=payload.metadata,
        points=[{"timestamp": p.timestamp, "value": p.value} for p in payload.points],
    )

    return {
        "id": ts.id,
        "name": ts.name,
        "metadata": _metadata_dict(ts.metadata_json),
        "points_count": len(payload.points),
        "created_at": ts.created_at,
    }


@router.get("/count", response_model=CountOut)
def get_count(db: Session = Depends(get_db)):
    """
    Return the number of stored time series.

    This endpoint is useful for quickly checking storage usage and for
    validating create/delete operations during testing.
    """
    return {"count": count_timeseries(db)}


@router.get("", response_model=TimeSeriesListOut)
def get_list(
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    name: str | None = Query(None),
):
    """
    List time series with pagination and optional substring filtering by name.

    Query parameters:
    - limit: page size (1..200)
    - offset: pagination offset (>=0)
    - name: optional substring filter

    Implementation note:
    - Uses an optimized query (subquery + OUTER JOIN) to include points_count
      per series without triggering N+1 queries.
    """
    items, total = list_timeseries_optimized(db, limit=limit, offset=offset, name=name)
    return {"items": items, "limit": limit, "offset": offset, "total": total}


@router.get("/{ts_id}", response_model=TimeSeriesOut)
def get_series(
    ts_id: str,
    db: Session = Depends(get_db),
    from_dt: datetime | None = Query(None, alias="from"),
    to_dt: datetime | None = Query(None, alias="to"),
    limit: int | None = Query(None, ge=1, le=5000),
    offset: int | None = Query(None, ge=0),
):
    """
    Retrieve a time series and its datapoints.

    Supports:
    - optional time filtering using 'from' and 'to'
    - pagination of datapoints using limit/offset

    Important response detail:
    - points_count represents the TOTAL number of datapoints matching the time window
      (ignoring pagination), which is useful for client-side pagination logic.

    Status codes:
    - 200: found
    - 404: time series not found
    - 422: invalid query params (e.g., from > to)
    """
    ts = get_timeseries_or_none(db, ts_id)
    if not ts:
        raise HTTPException(status_code=404, detail="Time series not found")

    # Validate time window ordering.
    if from_dt and to_dt and from_dt > to_dt:
        raise HTTPException(status_code=422, detail="'from' must be <= 'to'")

    points, total = fetch_points(
        db,
        ts_id=ts_id,
        from_dt=from_dt,
        to_dt=to_dt,
        limit=limit,
        offset=offset,
    )

    return {
        "id": ts.id,
        "name": ts.name,
        "metadata": _metadata_dict(ts.metadata_json),
        "points": [{"timestamp": p.timestamp, "value": p.value} for p in points],
        "points_count": total,
        "created_at": ts.created_at,
    }


@router.get("/{ts_id}/metrics", response_model=MetricsOut)
def get_metrics(
    ts_id: str,
    db: Session = Depends(get_db),
    from_dt: datetime | None = Query(None, alias="from"),
    to_dt: datetime | None = Query(None, alias="to"),
):
    """
    Compute aggregated metrics for a given time series.

    Supports:
    - optional time filtering using 'from' and 'to'

    Metrics are computed via SQL aggregation (see services/metrics.py),
    which avoids loading all datapoints into memory.

    Status codes:
    - 200: found and computed
    - 404: time series not found
    - 422: invalid query params (e.g., from > to)
    """
    ts = get_timeseries_or_none(db, ts_id)
    if not ts:
        raise HTTPException(status_code=404, detail="Time series not found")

    if from_dt and to_dt and from_dt > to_dt:
        raise HTTPException(status_code=422, detail="'from' must be <= 'to'")

    m = compute_metrics(db, ts_id=ts_id, from_dt=from_dt, to_dt=to_dt)

    return {
        "id": ts_id,
        "window": {"from": from_dt, "to": to_dt},
        **m,
    }


@router.delete("/{ts_id}", status_code=204)
def delete_series(ts_id: str, db: Session = Depends(get_db)):
    """
    Delete a time series and all its datapoints.

    Status codes:
    - 204: deleted successfully (no response body)
    - 404: time series not found
    """
    ts = get_timeseries_or_none(db, ts_id)
    if not ts:
        raise HTTPException(status_code=404, detail="Time series not found")

    delete_timeseries(db, ts)
    return Response(status_code=204)
