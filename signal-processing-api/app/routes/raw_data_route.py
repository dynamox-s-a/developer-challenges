from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.service.raw_data_service import RawDataService
from app.schemas.raw_data import RawDataCreate

router = APIRouter()


@router.post("/create")
def create_raw_data(
    payload: RawDataCreate,
    db: Session = Depends(get_db)
):
    service = RawDataService(db)
    return service.create_raw_data(payload)