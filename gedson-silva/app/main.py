from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from app.routers.api import router as series_router
from app.core.database import TORTOISE_ORM

app = FastAPI(
    title="Dynamox Time-Series API",
    version="1.0.0",
)

register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,
    add_exception_handlers=True,
)

app.include_router(series_router)

@app.get("/health")
async def health():
    return {"status": "ok"}