from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from uuid import UUID

class DataPointCreate(BaseModel):
    """Esquema para um único ponto de dado lido pelo sensor"""
    timestamp: datetime = Field(..., description="Data e hora exata da leitura")
    value: float = Field(..., description="Valor numérico registado pelo sensor")

class SeriesCreate(BaseModel):
    """Esquema principal para o payload de criação de uma nova série"""
    name: str = Field(..., min_length=1, max_length=100, description="Nome identificador do sensor/equipamento")
    unit: str = Field(..., min_length=1, max_length=20, description="Unidade de medida (ex: °C, mm/s, Hz)")
    data_points: List[DataPointCreate] = Field(..., min_items=1, description="Lista de pontos de dados a serem inseridos")

class SeriesResponse(BaseModel):
    """Esquema para devolver os metadados de uma série"""
    id: UUID
    name: str
    unit: str
    created_at: datetime

    class Config:
        # Habilitado para ler dos modelos SQLAlchemy
        from_attributes = True 

class DataPointResponse(BaseModel):
    """Esquema para devolver os dados brutos de uma série"""
    timestamp: datetime
    value: float

    class Config:
        from_attributes = True

class SeriesFullResponse(SeriesResponse):
    """Esquema para devolver a série completa"""
    data: List[DataPointResponse]

class MetricsResponse(BaseModel):
    """Esquema para devolver os cálculos estatísticos"""
    series_id: UUID
    count: int = Field(description="Total de pontos de dados nesta série")
    average: Optional[float] = Field(None, description="Média de todos os valores")
    max_value: Optional[float] = Field(None, description="Valor máximo registado")
    min_value: Optional[float] = Field(None, description="Valor mínimo registado")