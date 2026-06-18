from enum import StrEnum

class TimeSeriesMessage(StrEnum):
    NOT_FOUND = "Série não encontrada"
    CONFLICT = "Registro duplicado"
    INSUFFICIENT_POINTS = "Mínimo de 2 pontos para predição"