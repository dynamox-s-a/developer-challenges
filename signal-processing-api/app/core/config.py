import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is required. "
        "Example: postgresql://postgres:postgres@localhost:5432/timeseries_db"
    )
