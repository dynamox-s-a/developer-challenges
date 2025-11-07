from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Machine(Base):
    __tablename__ = 'machines'

    MACHINE_TYPES = [
        ('PUMP', 'Pump'),
        ('FAN', 'Fan'),
    ]

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", String, nullable=False)
    # type = Column("type", ChoiceType(choices=MACHINE_TYPES), nullable=False)
    type = Column("type", String, nullable=False)

    # Chave estrangeira para o usuário
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # Relacionamento de volta para User
    user = relationship("User", back_populates="machines")

    # Relacionamento: Uma máquina para muitos pontos de monitoramento
    monitoring_points = relationship(
        "MonitoringPoint", back_populates="machine", cascade="all, delete-orphan")

    def __init__(self, name: str, type: str, user_id: int):
        self.name = name
        self.type = type
        self.user_id = user_id
