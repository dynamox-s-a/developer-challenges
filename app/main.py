from uuid import UUID

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import TimeSeries
from app.schemas import TimeSeriesResponse, TimeSeriesCreate, TimeSeriesDetail
from app.crud import create_timeseries, get_timeseries
app = FastAPI()

Base.metadata.create_all(bind=engine)

# @app.get("/")
# def Health_check():
#     return {"status": "ok"}

@app.post(
    "/timeseries",
    response_model=TimeSeriesResponse
)
def create_timeseries_endpoint(
        payload:TimeSeriesCreate,
        db: Session = Depends(get_db)
):
    timeseries = create_timeseries(
        db=db,
        values=payload.values,
    )
    return TimeSeriesResponse(
        id=timeseries.id,
    )

@app.get(
    "/timeseries/{timeseries_id}",
         response_model=TimeSeriesDetail,
)
def get_timeseries_endpoint(
        timeseries_id: UUID,
        db: Session = Depends(get_db),
):
    timeseries = get_timeseries(
        db=db,
        timeseries_id=timeseries_id,
    )
    if not timeseries:
        raise HTTPException(
            status_code=404,
            detail="Time series not found",
        )
    return timeseries