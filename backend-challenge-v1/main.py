from fastapi import FastAPI
from app.core.database import Base, engine

from app.series.routes import router as series_router
from app.users.routes import router as users_router
from app.devices.routes import router as device_router
from app.clients.routes import router as client_router

app = FastAPI()

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

app.include_router(series_router)
app.include_router(users_router)
app.include_router(device_router)
app.include_router(client_router)

@app.get("/")
def root():
    return {"message": "API funcionando!"}