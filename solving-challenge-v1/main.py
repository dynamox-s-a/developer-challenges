from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd # Our math scientist

app = FastAPI(title="Dynamox Signal Processing API")

# In-memory database
db = {}

class TimeSeries(BaseModel):
    name: str
    data: List[float]

@app.get("/")
async def root():
    return {"message": "Dynamox API is running"}

# STORY 1: Store raw data
@app.post("/series")
async def create_series(series: TimeSeries):
    db[series.name] = series.data
    return {"message": f"Series '{series.name}' stored successfully"}

# STORY 2: Get metrics about the time series
@app.get("/series/{name}/metrics")
async def get_metrics(name: str):
    if name not in db:
        raise HTTPException(status_code=404, detail="Series not found")
    
    # Using Pandas to calculate everything in 2 lines
    series_data = pd.Series(db[name])
    
    return {
        "series_name": name,
        "metrics": {
            "mean": series_data.mean(),
            "max": series_data.max(),
            "min": series_data.min(),
            "count": len(series_data),
            "std_dev": series_data.std()
        }
    }

# STORY 5: Retrieve all stored time series
@app.get("/series")
async def list_all_series():
    return {"all_series": db}

# STORY 3: Delete a series
@app.delete("/series/{name}")
async def delete_series(name: str):
    if name in db:
        del db[name]
        return {"message": f"Series '{name}' deleted"}
    raise HTTPException(status_code=404, detail="Series not found")

@get("/series/{name}/predict")
async def predict_next(name: str):
    if name not in db:
        raise HTTPException(status_code=404, detail="Series not found")
    
    predict = sum(data) / len(data)

    return {
        "series_name": name,
        "predicted_next_value": round(prediction, 2),
        "method": "simple_moving_average"
    }