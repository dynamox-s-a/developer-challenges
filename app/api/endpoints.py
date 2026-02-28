from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, select, func, delete
from uuid import UUID
from datetime import timedelta
import logging

from app.core.database import get_db
from app.models.series import Series, SeriesData
from app.schemas.series import SeriesCreate, SeriesResponse, SeriesFullResponse, MetricsResponse, PredictionResponse

router = APIRouter(prefix="/series", tags=["Series de Tempo"])

logger = logging.getLogger(__name__)

@router.get("/count")
async def get_series_count(db: AsyncSession = Depends(get_db)):
    """
    Retorna a quantidade total de séries armazenadas no servidor.
    """
    result = await db.execute(select(func.count(Series.id)))
    total = result.scalar() or 0
    return {"total_series": total}

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

@router.get("/{series_id}", response_model=SeriesFullResponse)
async def get_full_series(
    series_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    """
    Retorna a série temporal completa, incluindo todos os pontos de dados armazenados.
    """

    # Busca aos metadados da série
    result = await db.execute(select(Series).where(Series.id == series_id))
    series = result.scalar_one_or_none()

    if not series:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Série não encontrada."
        )

    # Busca os pontos de dados associados a série, ordenados por tempo
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

@router.get("/{series_id}/predict", response_model=PredictionResponse)
async def predict_series(
    series_id: UUID,
    steps: int = 5,
    db: AsyncSession = Depends(get_db)
):
    """
    Prevê os próximos pontos ('steps') da série temporal usando Regressão Linear Simples.
    """
    
    result = await db.execute(select(Series).where(Series.id == series_id))
    series = result.scalar_one_or_none()
    
    if not series:
        raise HTTPException(status_code=404, detail="Série não encontrada.")

    data_result = await db.execute(
        select(SeriesData)
        .where(SeriesData.series_id == series_id)
        .order_by(SeriesData.timestamp.asc())
    )
    data_points = data_result.scalars().all()

    # Requisito mínimo de 2 pontos para traçar uma reta
    n = len(data_points)
    if n < 2:
        raise HTTPException(status_code=400, detail="Pontos insuficientes para predição. Necessário pelo menos 2.")

    # Tornando o timestamp em segundos relativos
    t0 = data_points[0].timestamp
    x_vals = [(pt.timestamp - t0).total_seconds() for pt in data_points]
    y_vals = [pt.value for pt in data_points]

    # Cálculo da Regressão Linear
    sum_x = sum(x_vals)
    sum_y = sum(y_vals)
    sum_xy = sum(x * y for x, y in zip(x_vals, y_vals))
    sum_x2 = sum(x**2 for x in x_vals)

    denominator = (n * sum_x2) - (sum_x ** 2)
    
    # Evita divisão por zero (teórico para caso todos os pontos tenham exatamente o mesmo timestamp)
    if denominator == 0:
        m = 0.0
        b = sum_y / n
    else:
        m = ((n * sum_xy) - (sum_x * sum_y)) / denominator
        b = (sum_y - (m * sum_x)) / n

    # Cálculo do intervalo médio de tempo para saber quando serão os pontos futuros
    avg_interval_seconds = (x_vals[-1] - x_vals[0]) / (n - 1)
    if avg_interval_seconds == 0:
        avg_interval_seconds = 1.0

    # Gera os pontos previstos
    last_x = x_vals[-1]
    last_time = data_points[-1].timestamp
    predictions = []

    for i in range(1, steps + 1):
        next_x = last_x + (avg_interval_seconds * i)
        next_time = last_time + timedelta(seconds=avg_interval_seconds * i)
        
        # Fórmula da reta: y = mx + b
        next_y = (m * next_x) + b

        predictions.append({
            "timestamp": next_time,
            "predicted_value": round(next_y, 4)
        })

    return {
        "series_id": series.id,
        "name": series.name,
        "unit": series.unit,
        "predictions": predictions
    }