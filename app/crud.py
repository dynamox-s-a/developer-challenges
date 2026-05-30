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