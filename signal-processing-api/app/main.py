
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.database import get_db, Base, engine


from app.models.device import Device
from app.models.raw_data import RawData
from app.routes.raw_data_route import router as raw_data_router
from app.routes.device_route import router as device_router
from app.core.exceptions import DomainException
from app.core.exception_handlers import (
    domain_exception_handler,
    http_exception_handler,
    validation_exception_handler,
)


app = FastAPI(
    title="Signal Processing API",
    version="1.0.0"
)

app.add_exception_handler(DomainException, domain_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
# Criar as tabelas no banco de dados
# Base.metadata.create_all(bind=engine)

app.include_router(raw_data_router)
app.include_router(device_router)




@app.get("/")
def health_check():
    return {"status": "ok"}



    
