import requests
import os
from datetime import datetime, timezone

LOCAL_URL = os.getenv("LOCAL_DEFAULT_URL","http://localhost:8000/count")
DOCKER_URL = os.getenv("DOCKER_DEFAULT_URL","http://host.docker.internal:8000/count")
K8S_URL = os.getenv("K8S_DEFAULT_URL","http://localhost:8000/count")

DEFAULT_URLS = [LOCAL_URL, DOCKER_URL, K8S_URL]
EXTRACTION_URL = os.getenv("EXTRACTION_URL", DEFAULT_URLS[0])

def store_result(data):
  # This function would have the logic to send the data to a persistant storage
  print(data)

def request_handler():
  try:
    req_result = requests.get(EXTRACTION_URL)
    return req_result
  except:
    print(f"Failed to perform request on {EXTRACTION_URL}, trying default URLS")
    for url in DEFAULT_URLS:
      try:
        req_result = requests.get(url)
        print(f"Success extraction from {url}")
        return req_result
      except:
        print(f"Failed to perform request on {url}")
  exit(1)

def run():
  try:
    req_result = request_handler()
    data = req_result.json()
    result = {
        "source": EXTRACTION_URL,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": data
    }
    store_result(result)
  except Exception as e:
    print(f"Job ended in failure: {e}")

run()