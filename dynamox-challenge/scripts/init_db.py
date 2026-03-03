"""Database setup script - creates tables from SQLAlchemy models."""
import sys
from pathlib import Path

# Ensure app is on path when run as script
root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root))

from app.database import engine, Base

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")
