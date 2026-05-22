from contextlib import asynccontextmanager

from fastapi import FastAPI

from config.database import create_db_and_tables
from routes import timeseries_routes


# Initializing database
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()

    # starts API here
    yield


# Create API app, setting up the database first
app = FastAPI(
    title='Signal Processor API',
    lifespan=lifespan
)

### Routers ###

# time-series router
app.include_router(timeseries_routes.router)


@app.get('/')
def root():
    return {
        'message': 'Welcome to Signal Processor API',
        'api_docs': 'http://127.0.0.1:80/docs'
        }
