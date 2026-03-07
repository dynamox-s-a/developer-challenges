import os
from dotenv import load_dotenv

load_dotenv()

# Constants
MAX_BATCH_SIZE = 50000
CHUNK_SIZE = 5000
MAX_POINTS_RETURNED = 20000

# Functions
def get_db_url() -> str:
    url = os.getenv("DATABASE_URL")

    if not url:
        raise RuntimeError("DATABASE_URL not set")
    
    return url