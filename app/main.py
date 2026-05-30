from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import TimeSeries
from app.schemas import TimeSeriesResponse, TimeSeriesCreate
from app.crud import create_timeseries
app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def Health_check():
    return {"status": "ok"}

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