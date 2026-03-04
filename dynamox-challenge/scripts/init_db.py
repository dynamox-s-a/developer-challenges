"""Post-migration DB initialisation script.

Run this once after `alembic upgrade head`:
    python scripts/init_db.py

What it does:
1. Attempts to promote timeseries_data to a TimescaleDB hypertable.
   - Succeeds silently in production (TimescaleDB installed).
   - Skips silently in local dev (plain PostgreSQL).
2. Creates extra performance indexes not managed by Alembic.
"""
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root))

from sqlalchemy import text
from app.database import engine


def create_hypertable() -> None:

    sql = "SELECT create_hypertable('timeseries_data', 'timestamp', if_not_exists => TRUE);"
    with engine.begin() as conn:
        try:
            conn.execute(text(sql))
            print("[OK] timeseries_data promoted to TimescaleDB hypertable.")
        except Exception as e:
            print(f"[SKIP] TimescaleDB hypertable not created: {e}")


def create_indexes() -> None:

    indexes = [
        (
            "ix_timeseries_created_at",
            "CREATE INDEX IF NOT EXISTS ix_timeseries_created_at "
            "ON timeseries (created_at DESC);",
        ),
        (
            "ix_timeseries_data_timestamp",
            "CREATE INDEX IF NOT EXISTS ix_timeseries_data_timestamp "
            "ON timeseries_data (timestamp DESC);",
        ),
    ]

    with engine.begin() as conn:
        for name, sql in indexes:
            try:
                conn.execute(text(sql))
                print(f"[OK] Index created: {name}")
            except Exception as e:
                print(f"[SKIP] Index {name}: {e}")


if __name__ == "__main__":
    print("Running post-migration DB initialisation...\n")
    create_hypertable()
    create_indexes()
    print("\nDone.")
