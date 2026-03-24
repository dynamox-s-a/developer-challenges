from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.infra.database import get_db

from app.models.signal_model import NumberOfSeriesResponse, SeriesResponse, PaginatedSeriesResponse
from app.models.signal_model import CreateSeriesRequest

from app.services.signal_service import SeriesService

router = APIRouter()

@router.post("/series", response_model=SeriesResponse, status_code=201)
async def create_series(
    payload: CreateSeriesRequest,
    db: AsyncSession = Depends(get_db)
) -> SeriesResponse:

    series = await SeriesService.create_series(db, payload)

    return SeriesResponse.model_validate(series, from_attributes=True)

# Rota estática antes de qualquer rota com parâmetro dinâmico no mesmo prefixo
#  As a user, I want to be able to retrieve the number of time series i've stored in the server.
@router.get("/series/count", status_code=200)
async def get_series_count(
    db: AsyncSession = Depends(get_db)
) -> NumberOfSeriesResponse:

    count = await SeriesService.get_series_count(db)

    return NumberOfSeriesResponse(count=count)

#  As a user, I want to be able to retrieve a paginated time series i've stored.
@router.get("/series/{series_id}/data", response_model=PaginatedSeriesResponse, status_code=200)
async def get_series_paginated(
    series_id: UUID,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
) -> PaginatedSeriesResponse:

    data, has_more, next_offset = await SeriesService.get_full_series_paginated(db, series_id, offset)

    if not data and offset == 0:
        raise HTTPException(status_code=404, detail=f"Series {series_id} not found or has no points")

    return PaginatedSeriesResponse(
        series_id=series_id,
        data=data,
        has_more=has_more,
        next_offset=next_offset
    )

@router.get("/metrics/{series_id}", response_model=SeriesResponse, status_code=200)
async def get_metrics(
    series_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> SeriesResponse:

    metrics = await SeriesService.get_metrics(db, series_id)
    if not metrics:
        raise HTTPException(status_code=404, detail=f"Series {series_id} not found")

    return SeriesResponse.model_validate(metrics, from_attributes=True)

@router.delete("/series/{series_id}", status_code=200)
async def delete_series(
    series_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> dict:

    await SeriesService.delete_series(db, series_id)

    return {"mensagem": f"{series_id} deletado com sucesso"}