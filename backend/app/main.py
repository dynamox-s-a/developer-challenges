from fastapi import FastAPI
from sqlalchemy import create_engine, Table, Column, Integer, MetaData
import os

app = FastAPI()

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")
DB_NAME = os.getenv("DB_NAME", "requestsdb")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
metadata = MetaData()

requests_table = Table(
    "requests", metadata,
    Column("id", Integer, primary_key=True),
    Column("count", Integer, nullable=False),
)

metadata.create_all(engine)

@app.get("/count")
def get_count():
    with engine.connect() as conn:
        result = conn.execute(requests_table.select()).fetchone()
        return {"successful_requests": result.count if result else 0}

@app.post("/increment")
def increment_count():
    with engine.connect() as conn:
        result = conn.execute(requests_table.select()).fetchone()
        if result:
            new_count = result.count + 1
            conn.execute(
                requests_table.update().where(requests_table.c.id == result.id).values(count=new_count)
            )
        else:
            new_count = 1
            conn.execute(requests_table.insert().values(count=new_count))
        conn.commit()
    return {"successful_requests": new_count}
