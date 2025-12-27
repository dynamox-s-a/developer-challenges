import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database connection URL.
#
# By default, the application uses a local SQLite database file (app.db).
# The value can be overridden using the DATABASE_URL environment variable.
#
# Examples:
# - sqlite:///./app.db          (local file, relative path)
# - sqlite:////data/app.db     (absolute path, commonly used inside Docker)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")


# Create the SQLAlchemy engine.
#
# The engine is the core interface between the application and the database.
# It is responsible for:
# - managing database connections
# - executing SQL statements
# - handling low-level communication with the database
#
# For SQLite, "check_same_thread=False" is required when the database
# is accessed from different threads (e.g. FastAPI request handlers).
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    pool_pre_ping=True,
)


# Create a session factory.
#
# A Session represents a single unit of work with the database.
# Each request to the API will typically use its own session.
#
# Configuration choices:
# - autocommit=False: changes are committed explicitly
# - autoflush=False: database writes occur only when explicitly requested
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    """
    Database session dependency.

    This function is used by FastAPI's dependency injection system
    to provide a database session to each request.

    Lifecycle:
    - A new Session is created at the beginning of the request.
    - The Session is yielded to the request handler.
    - The Session is always closed at the end of the request,
      even if an exception occurs.

    This pattern ensures:
    - Proper resource cleanup
    - No connection leaks
    - Safe concurrent access to the database
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
