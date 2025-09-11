from fastapi import FastAPI

app = FastAPI()

counter = {"success": 0}

@app.get("/count")
def get_count():
    return {"success": counter["success"]}

@app.post("/increment")
def increment():
    counter["success"] += 1
    return {"message": "Incremented", "success": counter["success"]}
