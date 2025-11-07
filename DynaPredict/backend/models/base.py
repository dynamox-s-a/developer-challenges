import enum
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/dynapredict_db"

# Engine and session factory
db = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=db)

# Declarative base
Base = declarative_base()
