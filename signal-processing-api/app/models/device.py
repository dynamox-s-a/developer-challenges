from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Device(Base):
    __tablename__ = "devices"

    # O banco já indexa a Primary Key automaticamente, não precisa de index=True
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Mantemos unique=True e index=True para buscas ultra rápidas por nome
    name = Column(String, unique=True, index=True, nullable=False)
    
    # Identificador único do dispositivo (ex: número de série, MAC address, UUID externo)
    serial_device = Column(String, unique=True, index=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relacionamento 1:N (Um dispositivo para muitos dados brutos)
    # O cascade garante a consistência dos dados ao deletar um Device
    raw_data = relationship(
        "RawData",
        back_populates="device",
        cascade="all, delete-orphan"
    )