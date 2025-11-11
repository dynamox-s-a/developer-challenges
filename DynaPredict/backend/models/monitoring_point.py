from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class MonitoringPoint(Base):
    __tablename__ = 'monitoring_points'

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", String, nullable=False)

    # Chave estrangeira para a máquina proprietária
    machine_id = Column("machine_id", Integer, ForeignKey(
        'machines.id'), nullable=False)

    # Chave estrangeira para o usuário proprietário
    user_id = Column("user_id", Integer, ForeignKey(
        'users.id'), nullable=False)

    # Chave estrangeira para o sensor associado (1:1)
    sensor_id = Column("sensor_id", Integer, ForeignKey(
        'sensors.id'), unique=True, nullable=True)

    # Relacionamento de volta para Machine (muitos pontos -> 1 máquina)
    machine = relationship("Machine", back_populates="monitoring_points")

    # Relacionamento de volta para User (muitos pontos -> 1 usuário)
    user = relationship("User", back_populates="monitoring_points")

    # Relacionamento 1:1 com Sensor (um ponto tem um sensor)
    sensor = relationship(
        "Sensor",
        back_populates="monitoring_point",
        uselist=False,
        cascade="all, delete-orphan",
        single_parent=True,
    )

    def __init__(self, name: str, machine_id: int, user_id: int):
        self.name = name
        self.machine_id = machine_id
        self.user_id = user_id
        self.sensor_id = None
