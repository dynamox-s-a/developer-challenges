


from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Index, func, String, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class RawData(Base):
    __tablename__ = "raw_data"

    # O banco já cria um índice automático para a Primary Key (PK)
    id = Column(Integer, primary_key=True, autoincrement=True)

    device_id = Column(
        Integer,
        ForeignKey("devices.id", ondelete="CASCADE"),
        nullable=False
        # Removido index=True aqui porque o índice composto abaixo 
        # já otimiza as buscas que começam com device_id
    )

    # Mantemos o índice aqui para acelerar buscas que filtram apenas por período de tempo
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    
    # Float(precision=53) força o uso de DOUBLE PRECISION no PostgreSQL,
    # garantindo precisão matemática crucial para séries temporais e sinais
    value = Column(Float(precision=53), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamento com a tabela de dispositivos
    device = relationship(
        "Device",
        back_populates="raw_data"
    )

    # REGRAS DA TABELA: Define o índice composto único da forma correta para o SQLAlchemy.
    # Isso evita leituras/inserções duplicadas no mesmo instante por device e
    # garante performance máxima nas queries de agregação de métricas.
    __table_args__ = (
    UniqueConstraint("device_id", "timestamp"),
    )   
        
    