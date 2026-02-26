from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert
import logging

from app.core.database import get_db
from app.models.series import Series, SeriesData
from app.schemas.series import SeriesCreate, SeriesResponse

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