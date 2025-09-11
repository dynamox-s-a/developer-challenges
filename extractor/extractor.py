import os, requests, json
from datetime import datetime
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData

BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8000/count")

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "postgres")
DB_NAME = os.getenv("DB_NAME", "requestsdb")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
metadata = MetaData()

extractions_table = Table(
    "extractions", metadata,
    Column("id", Integer, primary_key=True),
    Column("timestamp", String, nullable=False),
    Column("count", Integer, nullable=False),
)

metadata.create_all(engine)

def run_extraction():
    resp = requests.get(BACKEND_URL)
    data = resp.json()
    result = {
        "timestamp": datetime.utcnow().isoformat(),
        "count": data["successful_requests"]
    }
    with engine.connect() as conn:
        conn.execute(extractions_table.insert().values(**result))
        conn.commit()
    print("Saved extraction:", result)

if __name__ == "__main__":
    run_extraction()
