from uuid import UUID

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import TimeSeries
from app.repository.timeseries_repository import get_timeseries


def get_timeseries_or_404(
    timeseries_id: UUID,
    db: Session = Depends(get_db),
) -> TimeSeries:
    timeseries = get_timeseries(
        db=db,
        timeseries_id=timeseries_id,
    )

    if timeseries is None:
        raise HTTPException(
            status_code=404,
            detail="Time series not found",
        )

    return timeseries