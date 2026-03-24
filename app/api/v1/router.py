from fastapi import APIRouter
from app.api.v1.endpoints.timeseries import router as timeseries_router

api_router = APIRouter()
api_router.include_router(timeseries_router)
