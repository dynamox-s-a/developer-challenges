from fastapi import FastAPI
from app.core.database import get_db, Base, engine

from app.models.device import Device
from app.models.raw_data import RawData



app = FastAPI(
    title="Signal Processing API",
    version="1.0.0"
)


# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

@app.get("/")
def health_check():
    return {"status": "ok"}