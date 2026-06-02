from sqlalchemy import create_engine, Column, Integer, Float, DateTime, String, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
from datetime import datetime, timezone

DATABASE_URL = "sqlite:///./dynamox.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Necessário pra FastAPI + threads
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# ============================================================================
# MODELOS (TABELAS)
# ============================================================================

class Series(Base):
    """
    Tabela que representa uma série temporal.
    
    Uma "série" é um conjunto de leituras (timestamp + valor) agrupadas.
    Exemplo: leituras de vibração de uma máquina ao longo do tempo.
    """
    __tablename__ = "series"
    
    # Colunas:
    id = Column(Integer, primary_key=True, index=True)  # primary_key = ID único, index = busca rápida
    name = Column(String, nullable=True)  # Nome opcional da série
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))  # Data de criação (preenchida automaticamente, com fuso UTC)
    
    # Relacionamento: uma série TEM MUITOS data_points
    # Quando você faz `series.data_points`, retorna a lista de pontos daquela série
    data_points = relationship("DataPoint", back_populates="series", cascade="all, delete-orphan")


class DataPoint(Base):
    """
    Tabela que armazena os pontos individuais de uma série temporal.
    
    Cada ponto é: timestamp (quando?) + value (qual era o valor?)
    """
    __tablename__ = "data_points"
    
    id = Column(Integer, primary_key=True, index=True)
    series_id = Column(Integer, ForeignKey("series.id"), nullable=False)  # FK = "qual série é essa?"
    timestamp = Column(DateTime, nullable=False)  # Quando foi coletado
    value = Column(Float, nullable=False)  # Qual era o valor
    
    # Relacionamento inverso: cada DataPoint PERTENCE A uma Series
    series = relationship("Series", back_populates="data_points")


# Criar todas as tabelas no banco (se não existirem já)
Base.metadata.create_all(bind=engine)


def get_db():
    """
    Função auxiliar do FastAPI.
    Entrega uma sessão de banco pra cada requisição e garante que fecha no final.
    
    Uso: def minha_rota(db: Session = Depends(get_db)):
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
