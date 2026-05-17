# Async context manager import
from contextlib import asynccontextmanager

# FastAPI import
from fastapi import FastAPI

# Database and routers import
from config.database import create_db_and_tables
from routes import timeseries_routes


# Initializing database
@asynccontextmanager
async def lifespan(app: FastAPI):
    # create database and tables
    create_db_and_tables()

    # start API
    yield


# Create API app, setting up the database first
app = FastAPI(
    title='Signal Processor API',
    lifespan=lifespan
)

# Routes

## Including timeseries router
app.include_router(timeseries_routes.router)


@app.get('/')
def root():
    return {
        'message': 'Welcome to Signal Processor API',
        # pensar se colocar a documentação aqui
        'routes': 'http://127.0.0.1:8000/docs'
        }
