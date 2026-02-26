from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, select, func, delete
from uuid import UUID
import logging

from app.core.database import get_db
from app.models.series import Series, SeriesData
from app.schemas.series import SeriesCreate, SeriesResponse, SeriesFullResponse, MetricsResponse

router = APIRouter(prefix="/series", tags=["Series de Tempo"])

logger = logging.getLogger(__name__)

@router.post("/", response_model=SeriesResponse, status_code=status.HTTP_201_CREATED)
async def create_time_series(
    payload: SeriesCreate, 
    db: AsyncSession = Depends(get_db)
):
    """
    Recebe os dados de um sensor e insere no banco de dados.
    Utilização de Bulk Insert para reduzir a latência.
    """
    try:
        # Criação do registro principal
        new_series = Series(
            name=payload.name,
            unit=payload.unit
        )
        db.add(new_series)
        
        # Flush para gerar o ID sem ainda inserir no banco de dados
        await db.flush() 

        # Mapeando os pontos recebidos no JSON
        data_points_to_insert = [
            {
                "timestamp": point.timestamp,
                "series_id": new_series.id,
                "value": point.value
            }
            for point in payload.data_points
        ]

        # Inserção dos dados no banco de dados
        if data_points_to_insert:
            stmt = insert(SeriesData).values(data_points_to_insert)
            await db.execute(stmt)

        await db.commit()
        await db.refresh(new_series)

        return new_series

    except Exception as e:
        # Desfaz a operação se houver algum erro no processo
        await db.rollback()
        logger.error(f"Erro ao inserir série: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao tentar salvar os dados da série temporal."
        )
    
@router.get("/{series_id}", response_model=SeriesFullResponse)
async def get_series_details(
    series_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """
    Retorna os metadados de uma série e todos os seus pontos de dados.
    """
    
    result = await db.execute(select(Series).where(Series.id == series_id))
    series = result.scalar_one_or_none()

    if not series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Série temporal não encontrada."
        )

    # Busca dos pontos de dados ordenados por tempo
    data_result = await db.execute(
        select(SeriesData)
        .where(SeriesData.series_id == series_id)
        .order_by(SeriesData.timestamp.asc())
    )
    data_points = data_result.scalars().all()

    return {
        "id": series.id,
        "name": series.name,
        "unit": series.unit,
        "created_at": series.created_at,
        "data": data_points
    }

@router.get("/{series_id}/metrics", response_model=MetricsResponse)
async def get_series_metrics(
    series_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """
    Calcula métricas (média, máximo e mínimo).
    """

    metrics_stmt = select(
        func.count(SeriesData.value).label("count"),
        func.avg(SeriesData.value).label("average"),
        func.max(SeriesData.value).label("max_value"),
        func.min(SeriesData.value).label("min_value")
    ).where(SeriesData.series_id == series_id)

    result = await db.execute(metrics_stmt)
    metrics = result.one()

    if metrics.count == 0:
        series_exists = await db.execute(select(Series).where(Series.id == series_id))
        if not series_exists.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Série temporal não encontrada.")
        
        return MetricsResponse(series_id=series_id, count=0)

    return {
        "series_id": series_id,
        "count": metrics.count,
        "average": metrics.average,
        "max_value": metrics.max_value,
        "min_value": metrics.min_value
    }

@router.delete("/{series_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_series(
    series_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """
    Remove uma série e todos os seus dados associados via CASCADE.
    Retorna '204 No Content' em caso de sucesso.
    """

    # Verifica se a série existe
    result = await db.execute(select(Series).where(Series.id == series_id))
    series = result.scalar_one_or_none()

    if not series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Série temporal não encontrada."
        )

    # Comando de deletar os registros associados ao ID
    await db.execute(delete(Series).where(Series.id == series_id))
    
    await db.commit()

    # Retorna 'Status 204' sem corpo de resposta
    return None