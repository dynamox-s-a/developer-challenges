import enum
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+psycopg2://user:password@localhost/dynapredict_db")

# URL do banco de dados (PostgreSQL). Ajuste conforme o ambiente de execução.
db = create_engine(DATABASE_URL)

# Fábrica de sessões (SessionLocal) para criar sessões SQLAlchemy.
SessionLocal = sessionmaker(bind=db)

# Base declarativa do SQLAlchemy usada por todos os modelos.
Base = declarative_base()
