from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class User(Base):
    __tablename__ = 'users'

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    email = Column("email", String, nullable=False, unique=True)
    # Lembre-se de armazenar um hash da senha, não a senha em texto plano.
    password = Column("password", String, nullable=False)

    # # Relacionamento: Um usuário para muitas máquinas
    # machines = relationship(
    #     "Machine", back_populates="user", cascade="all, delete-orphan")

    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password
