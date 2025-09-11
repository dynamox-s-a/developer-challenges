import requests
import json
import os
from datetime import datetime, timezone

BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8000/count")
OUTPUT_FILE = "extracted.json"

def run_extraction():
    resp = requests.get(BACKEND_URL)
    data = resp.json()
    result = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "count": data["successful_requests"]
    }
    with open(OUTPUT_FILE, "a") as f:
        f.write(json.dumps(result) + "\n")
    print("Extracted:", result)

if __name__ == "__main__":
    run_extraction()
