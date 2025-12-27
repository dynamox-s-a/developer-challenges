from sqlalchemy.orm import DeclarativeBase

# Base class for all SQLAlchemy ORM models.
#
# This class serves as the common ancestor for every database model
# defined in the application (e.g. TimeSeries, DataPoint).
#
# By inheriting from DeclarativeBase, SQLAlchemy is able to:
# - keep track of all mapped ORM models
# - generate database tables from Python classes
# - manage metadata such as table names, columns, and relationships
#
# All ORM models must inherit from this Base class.
class Base(DeclarativeBase):
    pass
