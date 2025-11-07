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
    # model = Column("model", ChoiceType(choices=SENSOR_MODELS), nullable=False)
    model = Column("model", String, nullable=False)
    monitoring_point_id = Column(Integer, ForeignKey(
        'monitoring_points.id'), unique=True, nullable=False)

    # Relacionamento de volta para MonitoringPoint
    monitoring_point = relationship("MonitoringPoint", back_populates="sensor")

    def __init__(self, model: str, monitoring_point_id: int):
        self.model = model
