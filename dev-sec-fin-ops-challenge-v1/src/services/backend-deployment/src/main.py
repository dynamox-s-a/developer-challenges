import json

from fastapi import FastAPI
from fastapi.responses import Response

PERSISTENCE_FILE = "requests.json"

def read_count():
  request_count = 0
  with open(PERSISTENCE_FILE, "r") as f:
    request_count = json.load(f).get("requests")
  return request_count

def read_json():
  with open(PERSISTENCE_FILE, "r") as f:
    data = json.load(f)
    return data

def write_count(new_value: int):
  with open(PERSISTENCE_FILE, "w+") as f:
    json.dump({"requests": new_value}, f)
  
def increment_count():
  value = read_count()
  new_value = value +1
  write_count(new_value)
  return new_value

async def lifespan(app: FastAPI):
  # init
  with open(PERSISTENCE_FILE, "w+") as f:
    json.dump({"requests": 0}, f)

  # provide API
  yield

  # shutdown
  print(f"Final count: {read_json()}")

app = FastAPI(lifespan=lifespan)

@app.get("/")
@app.get("/request")
def increment_request_counter():
  try:
    increment_count()
    value = read_json()
    return value
  except:
    return {"status": Response(status_code=500)}

@app.get("/count")
def request_count():
  try:
    value = read_json()
    return value
  except:
    return {"status": Response(status_code=500)}

@app.get("/favicon.ico", include_in_schema=False)
async def get_favicon():
    return Response(status_code=204)