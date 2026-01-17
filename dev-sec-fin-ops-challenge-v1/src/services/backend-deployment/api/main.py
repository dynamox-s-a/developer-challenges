from fastapi import FastAPI
from fastapi.responses import Response

PERSISTENCE_FILE = "requests.json"

async def lifespan(app: FastAPI):
  # init
  with open(PERSISTENCE_FILE, "w+") as f:
    f.write("0")

  # provide API
  yield

  # shutdown
  with open(PERSISTENCE_FILE, "r") as f:
    print(f"Final count: {f.read()}")

app = FastAPI(lifespan=lifespan)

def read():
  value = 0
  with open(PERSISTENCE_FILE, "r") as f:
    value = int(f.read().strip())
  return value

def write(new_value: int):
  with open(PERSISTENCE_FILE, "w+") as f:
    f.write(str(new_value))
  
def increment():
  value = read()
  new_value = value +1
  write(new_value)
  return new_value

@app.get("/")
@app.get("/request")
def increment_request_counter():
  try:
    value = increment()
    return {"status": Response(status_code=200)}
  except:
    return {"status": Response(status_code=500)}

@app.get("/count")
def request_count():
  try:
    value = read()
    return value
  except:
    return {"status": Response(status_code=500)}

@app.get("/favicon.ico", include_in_schema=False)
async def get_favicon():
    return Response(status_code=204)