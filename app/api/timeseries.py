import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, insert, func, delete
from datetime import datetime
from fastapi import Query

from app.db.session import get_db
from app.models.timeseries import TimeSeries, TimeSeriesPoint
from app.schemas.timeseries import (
    TimeSeriesCreate, 
    TimeSeriesRead, 
    TimeSeriesPointsBatchCreate, 
    BatchInsertResponse, 
    TimeSeriesFullResponse, 
    TimeSeriesCountResponse, 
    DeleteTimeSeriesResponse,
    TimeSeriesMetricsResponse
)
from app.core.config import MAX_BATCH_SIZE, CHUNK_SIZE, MAX_POINTS_RETURNED
from app.utils.chunking import chunked


router = APIRouter(prefix="/timeseries", tags=["timeseries"])


@router.post(
    "/",
    response_model=TimeSeriesRead,
    status_code=201,
    summary="Create a new time series",
    description="Creates a time series identified by a unique label."
)
async def create_timeseries(
    data: TimeSeriesCreate, 
    db: AsyncSession = Depends(get_db)
):
    ts = TimeSeries(label=data.label)

    try:
        db.add(ts)
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=409, detail="Label already exists")

    await db.refresh(ts)

    return ts


@router.get(
    "/count",
    response_model=TimeSeriesCountResponse,
    status_code=200,
    summary="Get number of stored time series",
    description="Return the total number of stored time series."
)
async def count_timeseries(
    db: AsyncSession = Depends(get_db),
):
    stmt = select(func.count()).select_from(TimeSeries)

    result = await db.execute(stmt)
    count = result.scalar_one()

    return TimeSeriesCountResponse(count=count)


@router.post(
    "/{timeseries_id}/points",
    response_model=BatchInsertResponse,
    status_code=201,
    summary="Insert points into a time series",
    description="""
        Insert a batch of points into a time series.
        Each point must contain a timestamp and a numeric value.
    """
)
async def insert_points(
    timeseries_id: uuid.UUID,
    data: TimeSeriesPointsBatchCreate,
    db: AsyncSession = Depends(get_db),
):
    if len(data.points) > MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Batch size exceeds maximum allowed ({MAX_BATCH_SIZE})"
        )

    # Ensure series exists
    result = await db.execute(
        select(TimeSeries.id).where(TimeSeries.id == timeseries_id)
    )

    series_id = result.scalar_one_or_none()
    if not series_id:
        raise HTTPException(status_code=404, detail="TimeSeries not found")

    # Check duplicates inside request.
    timestamps = [p.timestamp for p in data.points]
    if len(timestamps) != len(set(timestamps)):
        raise HTTPException(
            status_code=400,
            detail="Duplicate timestamps in request payload"
        )

    try:
        for chunk in chunked(data.points, CHUNK_SIZE):
            stmt = insert(TimeSeriesPoint).values([
                {
                    "timeseries_id": timeseries_id,
                    "timestamp": p.timestamp,
                    "value": p.value,
                }
                for p in chunk
            ])

            await db.execute(stmt)

        await db.commit()

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Duplicate timestamp for this timeseries"
        )

    return BatchInsertResponse(inserted=len(data.points))


@router.get(
    "/{timeseries_id}/metrics",
    response_model=TimeSeriesMetricsResponse,
    status_code=200,
    summary="Get metrics of a time series",
    description="""
        Return summary statistics (count, min, max, average, percentiles, etc.)
        for a time series, optionally restricted to a time window.
    """
)
async def get_timeseries_metrics(
    timeseries_id: uuid.UUID,
    from_ts: datetime | None = Query(
        None,
        description="Start of the time window (inclusive)"
    ),
    to_ts: datetime | None = Query(
        None,
        description="End of the time window (inclusive)"
    ),
    db: AsyncSession = Depends(get_db),
):
    
    if from_ts and to_ts and from_ts > to_ts:
        raise HTTPException(status_code=400, detail="from_ts must be <= to_ts")

    conditions = [TimeSeriesPoint.timeseries_id == timeseries_id]
    if from_ts:
        conditions.append(TimeSeriesPoint.timestamp >= from_ts)
    if to_ts:
        conditions.append(TimeSeriesPoint.timestamp <= to_ts)

    exists = await db.execute(
        select(TimeSeries.id).where(TimeSeries.id == timeseries_id)
    )
    if exists.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Time series not found")

    stmt = select(
        func.count(TimeSeriesPoint.id).label("count"),
        func.min(TimeSeriesPoint.value).label("min"),
        func.max(TimeSeriesPoint.value).label("max"),
        func.avg(TimeSeriesPoint.value).label("avg"),
        func.stddev_pop(TimeSeriesPoint.value).label("stddev"),
        func.percentile_cont(0.5).within_group(TimeSeriesPoint.value).label("p50"),
        func.percentile_cont(0.95).within_group(TimeSeriesPoint.value).label("p95"),
        func.min(TimeSeriesPoint.timestamp).label("start"),
        func.max(TimeSeriesPoint.timestamp).label("end"),
    ).where(*conditions)

    row = (await db.execute(stmt)).one()
    return TimeSeriesMetricsResponse(**row._asdict())


@router.get(
    "/{timeseries_id}",
    response_model=TimeSeriesFullResponse,
    status_code=200,
    summary="Retrieve time series points",
    description="""
        Retrieve points from a time series.
        Results can be filtered either by a time window (from_ts, to_ts)
        or by cursor pagination (after_ts). These modes are optional and
        mutually exclusive.
    """
)
async def get_timeseries(
    timeseries_id: uuid.UUID,
    from_ts: datetime | None = Query(
        None,
        description="Start of the time window (inclusive)"
    ),
    to_ts: datetime | None = Query(
        None,
        description="End of the time window (inclusive)"
    ),
    after_ts: datetime | None = Query(
        None,
        description="Cursor for pagination. Returns points after this timestamp"
    ),
    limit: int = Query(
        1000,
        description="Maximum number of points returned"
    ),
    db: AsyncSession = Depends(get_db),
):    
    if limit <= 0:
        raise HTTPException(status_code=400, detail="limit must be positive")
    
    limit = min(limit, MAX_POINTS_RETURNED)

    if from_ts and to_ts and from_ts > to_ts:
        raise HTTPException(status_code=400, detail="from_ts must be <= to_ts")

    if after_ts and (from_ts or to_ts):
        raise HTTPException(status_code=400, detail="after_ts cannot be combined with from_ts or to_ts")

    conditions = [TimeSeriesPoint.timeseries_id == timeseries_id]

    if after_ts:
        conditions.append(TimeSeriesPoint.timestamp > after_ts)

    if from_ts:
        conditions.append(TimeSeriesPoint.timestamp >= from_ts)

    if to_ts:
        conditions.append(TimeSeriesPoint.timestamp <= to_ts)

    # check if timeseries exists
    result = await db.execute(
        select(TimeSeries).where(TimeSeries.id == timeseries_id)
    )
    timeseries = result.scalar_one_or_none()

    if not timeseries:
        raise HTTPException(status_code=404, detail="Time series not found")

    stmt = (
        select(TimeSeriesPoint)
        .where(*conditions)
        .order_by(TimeSeriesPoint.timestamp)
        .limit(limit)
    )

    points_result = await db.execute(stmt)
    points = points_result.scalars().all()

    next_after_ts = None
    if len(points) == limit:
        next_after_ts = points[-1].timestamp

    return {
        "id": timeseries.id,
        "label": timeseries.label,
        "created_at": timeseries.created_at,
        "points": points,
        "next_after_ts": next_after_ts,
    }


@router.delete(
    "/{timeseries_id}",
    response_model=DeleteTimeSeriesResponse,
    status_code=200,
    summary="Delete a time series",
    description="Delete a time series and all its associated points"
)
async def delete_timeseries(
    timeseries_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        delete(TimeSeries)
        .where(TimeSeries.id == timeseries_id)
        .returning(TimeSeries.id)
    )

    result = await db.execute(stmt)
    deleted_id = result.scalar_one_or_none()

    if not deleted_id:
        raise HTTPException(status_code=404, detail="Time series not found")

    await db.commit()

    return {"deleted_id": deleted_id}
