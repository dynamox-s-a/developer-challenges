from fastapi import FastAPI
import json
import os

app = FastAPI()

COUNT_FILE = "count.json"

def read_count():
    if not os.path.exists(COUNT_FILE):
        return 0
    with open(COUNT_FILE, "r") as f:
        data = json.load(f)
    return data.get("count", 0)

def write_count(value):
    with open(COUNT_FILE, "w") as f:
        json.dump({"count": value}, f)

@app.get("/count")
def get_count():
    count = read_count()
    return {"successful_requests": count}

@app.post("/increment")
def increment_count():
    count = read_count() + 1
    write_count(count)
    return {"successful_requests": count}
