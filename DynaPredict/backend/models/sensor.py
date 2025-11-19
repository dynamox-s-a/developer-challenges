from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Sensor(Base):
    __tablename__ = 'sensors'

    SENSOR_MODELS = [
        ("TC_AGM", "TC-AGM"),
        ("TC_AS", "TC-AS"),
        ("HF_PLUS", "HF+"),
    ]

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    model = Column("model", String, nullable=False)
    # Relacionamento de volta para User (muitos sensores -> 1 usuário)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship("User", back_populates="sensors")

    # Relacionamento 1:1 com MonitoringPoint.
    # A chave estrangeira fica em MonitoringPoint.sensor_id (uma coluna única em monitoring_points).
    monitoring_point = relationship(
        "MonitoringPoint", back_populates="sensor", uselist=False)

    def __init__(self, model: str, user_id: int):
        self.model = model
        self.user_id = user_id
