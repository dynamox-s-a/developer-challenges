from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class MonitoringPoint(Base):
    __tablename__ = 'monitoring_points'

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", String, nullable=False)

    # Chave estrangeira para a máquina
    machine_id = Column("machine_id", Integer, ForeignKey(
        'machines.id'), nullable=False)

    # Relacionamento de volta para Machine
    machine = relationship("Machine", back_populates="monitoring_points")

    # Relacionamento: Um ponto de monitoramento para um sensor
    sensor = relationship("Sensor", back_populates="monitoring_point",
                          uselist=False, cascade="all, delete-orphan")

    def __init__(self, name: str, machine_id: int):
        self.name = name
        self.machine_id = machine_id
