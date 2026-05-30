from uuid import UUID

from sqlalchemy.orm import Session

from app.models import TimeSeries

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
):
    return(
        db.query(TimeSeries)
        .filter(TimeSeries.id == timeseries_id)
        .first()
    )

def count_timeseries(db:Session) -> int:
    return db.query(TimeSeries).count()

def delete_timeseries(
        db: Session,
        timeseries: TimeSeries,
) -> None:
    db.delete(timeseries)
    db.commit()