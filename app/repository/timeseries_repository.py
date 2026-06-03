from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import TimeSeries


def get_all_timeseries(
    db: Session,
) -> list[TimeSeries]:

    stmt = (
    select(TimeSeries)
    .order_by(
        TimeSeries.created_at.desc()
    )
)

    return list(
        db.scalars(stmt).all()
    )


def create_timeseries(
    db: Session,
    values: list[float],
) -> TimeSeries:

    timeseries = TimeSeries(
        values=values
    )

    db.add(timeseries)
    db.commit()
    db.refresh(timeseries)

    return timeseries


def get_timeseries(
    db: Session,
    timeseries_id: UUID,
) -> TimeSeries | None:

    stmt = (
        select(TimeSeries)
        .where(TimeSeries.id == timeseries_id)
    )

    return db.scalar(stmt)


def count_timeseries(
    db: Session,
) -> int:

    stmt = (
        select(func.count())
        .select_from(TimeSeries)
    )

    return db.scalar(stmt) or 0


def delete_timeseries(
    db: Session,
    timeseries: TimeSeries,
) -> None:

    db.delete(timeseries)
    db.commit()