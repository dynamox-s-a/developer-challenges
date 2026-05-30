from fastapi import FastAPI
from app.database import Base, engine
from app.models import TimeSeries
app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def Health_check():
    return {"status": "ok"}