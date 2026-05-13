from fastapi import FastAPI, HTTPException, Depends # Import FastAPI core tools
from sqlalchemy import Column, Integer, String, JSON, create_engine # Import SQL structure types
from sqlalchemy.ext.declarative import declarative_base # Tool to create the base class for models
from sqlalchemy.orm import sessionmaker, Session # Tools to manage database conversations (sessions)
import pandas as pd # Math library for signal processing
import os # To read system variables like Database URL

# --- DATABASE ENGINE SETUP ---
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/signals_db") # Get DB address from environment
engine = create_engine(DATABASE_URL) # Create the main connection engine to Postgres
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # Create a factory for DB sessions
Base = declarative_base() # Create a base class that maps Python classes to SQL tables

# --- DATABASE MODEL DEFINITION ---
class TimeSeriesModel(Base): # Define the table structure in Python
    __tablename__ = "time_series" # Set the actual table name in PostgreSQL
    id = Column(Integer, primary_key=True, index=True) # Unique ID for each record
    name = Column(String, unique=True, index=True) # Series name (unique and indexed for fast lookup)
    data = Column(JSON) # The actual list of numbers stored as a JSON object

Base.metadata.create_all(bind=engine) # Command to physically create the table in Postgres if it doesn't exist

app = FastAPI(title="Dynamox API - Postgres Edition") # Initialize the FastAPI application

# --- DEPENDENCY INJECTION ---
def get_db(): # Function to manage DB connection lifecycle
    db = SessionLocal() # Open a new connection to the database
    try:
        yield db # Provide the connection to the route function
    finally:
        db.close() # Always close the connection after the request finishes to prevent leaks

# --- API ROUTES ---

@app.get("/") # Root endpoint for health check
async def root(): # Asynchronous function for non-blocking execution
    return {"status": "Online", "database": "Connected"} # Returns a simple JSON response

@app.post("/series") # Endpoint to receive and save data
async def create_series(name: str, data: list[float], db: Session = Depends(get_db)): # Request name, data, and DB session
    db_series = db.query(TimeSeriesModel).filter(TimeSeriesModel.name == name).first() # Check if series already exists
    if db_series: # If found in database
        db_series.data = data # Update the existing data with new values
    else: # If it's a new series
        db_series = TimeSeriesModel(name=name, data=data) # Create a new instance of the model
        db.add(db_series) # Add the new object to the database session
    db.commit() # Save the changes permanently to PostgreSQL
    return {"message": f"Series '{name}' stored successfully"} # Return success message

@app.get("/series/{name}/metrics") # Endpoint to calculate signal metrics
async def get_metrics(name: str, db: Session = Depends(get_db)): # Request name and DB session
    db_series = db.query(TimeSeriesModel).filter(TimeSeriesModel.name == name).first() # Fetch record from Postgres
    if not db_series: # If record was not found
        raise HTTPException(status_code=404, detail="Series not found") # Return 404 Error
    
    series_data = pd.Series(db_series.data) # Convert the stored JSON list into a Pandas series for math
    return { # Return the calculated metrics
        "series_name": name,
        "metrics": {
            "mean": series_data.mean(), # Calculate average
            "max": series_data.max(), # Find highest value
            "min": series_data.min(), # Find lowest value
            "count": len(series_data) # Total number of data points
        }
    }

@app.delete("/series/{name}") # Endpoint to remove a series
async def delete_series(name: str, db: Session = Depends(get_db)): # Request name and DB session
    db_series = db.query(TimeSeriesModel).filter(TimeSeriesModel.name == name).first() # Look for the series
    if not db_series: # If not found
        raise HTTPException(status_code=404, detail="Series not found") # Return 404 Error
    db.delete(db_series) # Mark the record for deletion
    db.commit() # Apply the deletion to the database
    return {"message": f"Series '{name}' deleted"} # Return confirmation