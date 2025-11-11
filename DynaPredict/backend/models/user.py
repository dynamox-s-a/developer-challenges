from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class User(Base):
    __tablename__ = 'users'

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    email = Column("email", String, nullable=False, unique=True)
    password = Column("password", String, nullable=False)
    # Relacionamento 1:N um usuário pode ter várias máquinas
    machines = relationship(
        "Machine", back_populates="user", cascade="all, delete-orphan")

    # Relacionamento 1:N um usuário pode ter vários sensores
    sensors = relationship(
        "Sensor", back_populates="user", cascade="all, delete-orphan")

    # Relacionamento 1:N um usuário pode ter vários pontos de monitoramento
    monitoring_points = relationship(
        "MonitoringPoint", back_populates="user", cascade="all, delete-orphan")

    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password
