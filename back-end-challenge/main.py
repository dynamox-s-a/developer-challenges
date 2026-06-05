"""
main.py

A API completa com os 5 endpoints do desafio:
1. POST /series — armazenar uma série de dados
2. GET /series/{id} — recuperar uma série inteira
3. GET /series/{id}/metrics — obter métricas sobre a série
4. DELETE /series/{id} — deletar uma série
5. GET /series/count — contar séries armazenadas

Estrutura: Pydantic schemas (input/output) + endpoints CRUD
"""

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional
from statistics import mean, stdev

from database import get_db, Series, DataPoint, engine, Base

app = FastAPI(title="Dynamox - API de Processamento de Sinais")


# ============================================================================
# PYDANTIC SCHEMAS (validação de input/output)
# ============================================================================

class DataPointSchema(BaseModel):
    """Schema para um ponto de dados: timestamp + valor"""
    timestamp: datetime
    value: float


class SeriesCreateSchema(BaseModel):
    """Schema pra criar uma série: nome (opcional) + lista de pontos"""
    name: Optional[str] = None
    data_points: List[DataPointSchema]


class SeriesResponseSchema(BaseModel):
    """Schema da resposta quando retorna uma série completa"""
    id: int
    name: Optional[str] = None
    created_at: datetime
    data_points: List[DataPointSchema]

    # Permite o Pydantic ler direto de objetos SQLAlchemy (forma moderna do Pydantic 2)
    model_config = ConfigDict(from_attributes=True)


class MetricsSchema(BaseModel):
    """Schema das métricas calculadas sobre uma série"""
    count: int  # Quantos pontos
    media: float  # Média
    minimo: float  # Mínimo
    maximo: float  # Máximo
    desvio_padrao: Optional[float] = None  # Desvio padrão (None se houver < 2 pontos)


# ============================================================================
# ENDPOINTS (CRUD)
# ============================================================================

@app.post("/series", response_model=dict)
def create_series(series_data: SeriesCreateSchema, db: Session = Depends(get_db)):
    """
    HISTÓRIA 1: Armazenar uma série de dados brutos.
    
    POST /series
    Body: { "name": "sensor_1", "data_points": [{"timestamp": "...", "value": 10}, ...] }
    Retorno: { "id": 1, "message": "Série armazenada com sucesso" }
    """
    try:
        # Criar a série (tabela series)
        new_series = Series(name=series_data.name)
        db.add(new_series)
        db.flush()  # Executa a inserção pra pegar o ID gerado
        
        # Adicionar cada ponto de dados (tabela data_points)
        for point in series_data.data_points:
            data_point = DataPoint(
                series_id=new_series.id,
                timestamp=point.timestamp,
                value=point.value
            )
            db.add(data_point)
        
        # Commit = "salva tudo no banco"
        db.commit()
        
        return {
            "id": new_series.id,
            "message": "Série armazenada com sucesso",
            "points_count": len(series_data.data_points)
        }
    except Exception as e:
        db.rollback()  # Se der erro, desfaz tudo (rollback)
        raise HTTPException(status_code=400, detail=f"Erro ao armazenar: {str(e)}")


@app.get("/series/count", response_model=dict)
def count_series(db: Session = Depends(get_db)):
    """
    HISTÓRIA 4: Recuperar o número de séries temporais que armazenei.
    
    GET /series/count
    Retorno: { "count": 5 }
    
    IMPORTANTE: Esta rota vem ANTES de /series/{series_id} porque FastAPI
    avalia as rotas em ordem. Se viesse depois, /series/count seria capturado
    como /series/{series_id} com series_id="count", e daria erro.
    """
    count = db.query(Series).count()
    return {"count": count}


@app.get("/series/{series_id}", response_model=SeriesResponseSchema)
def get_series(series_id: int, db: Session = Depends(get_db)):
    """
    HISTÓRIA 5: Recuperar toda a série temporal que armazenei.
    
    GET /series/1
    Retorno: { "id": 1, "name": "...", "created_at": "...", "data_points": [...] }
    """
    # Buscar a série no banco
    series = db.query(Series).filter(Series.id == series_id).first()
    
    # Se não existir, retorna erro 404
    if not series:
        raise HTTPException(status_code=404, detail="Série não encontrada")
    
    # Convertendo os DataPoints pra lista de dicts pra o schema
    data_points = [
        DataPointSchema(timestamp=dp.timestamp, value=dp.value)
        for dp in series.data_points
    ]
    
    return SeriesResponseSchema(
        id=series.id,
        name=series.name,
        created_at=series.created_at,
        data_points=data_points
    )


@app.get("/series/{series_id}/metrics", response_model=MetricsSchema)
def get_metrics(series_id: int, db: Session = Depends(get_db)):
    """
    HISTÓRIA 2: Obter métricas sobre a série temporal.

    GET /series/1/metrics
    Retorno: { "count": 10, "media": 15.5, "minimo": 5, "maximo": 25, "desvio_padrao": 2.3 }

    Métricas escolhidas (padrão pra sinais de vibração/sensores):
    - count: número de leituras
    - media: valor médio
    - minimo/maximo: extremos
    - desvio_padrao: variabilidade (desvio padrão)
    """
    series = db.query(Series).filter(Series.id == series_id).first()
    
    if not series:
        raise HTTPException(status_code=404, detail="Série não encontrada")
    
    if not series.data_points:
        raise HTTPException(status_code=400, detail="Série vazia, sem métricas")
    
    # Extrair só os valores numéricos
    valores = [dp.value for dp in series.data_points]

    # Calcular métricas
    quantidade = len(valores)
    media = mean(valores)
    valor_minimo = min(valores)
    valor_maximo = max(valores)

    # Desvio padrão só faz sentido com 2+ pontos
    desvio_padrao = stdev(valores) if quantidade >= 2 else None

    return MetricsSchema(
        count=quantidade,
        media=media,
        minimo=valor_minimo,
        maximo=valor_maximo,
        desvio_padrao=desvio_padrao
    )


@app.delete("/series/{series_id}", response_model=dict)
def delete_series(series_id: int, db: Session = Depends(get_db)):
    """
    HISTÓRIA 3: Excluir uma série temporal que enviei.
    
    DELETE /series/1
    Retorno: { "message": "Série deletada com sucesso" }
    """
    series = db.query(Series).filter(Series.id == series_id).first()
    
    if not series:
        raise HTTPException(status_code=404, detail="Série não encontrada")
    
    db.delete(series)
    db.commit()
    
    return {"message": "Série deletada com sucesso"}


@app.get("/", response_model=dict)
def home():
    """Endpoint raiz pra confirmar que a API está rodando"""
    return {
        "aplicacao": "Dynamox - API de Processamento de Sinais",
        "versao": "1.0",
        "endpoints": {
            "POST /series": "Armazenar uma série",
            "GET /series/{id}": "Recuperar uma série",
            "GET /series/{id}/metrics": "Obter métricas",
            "DELETE /series/{id}": "Deletar uma série",
            "GET /series/count": "Contar séries"
        }
    }


@app.get("/status")
def status():
    """Health check"""
    return {"status": "ok"}
