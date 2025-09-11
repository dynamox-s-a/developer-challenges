import requests
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://backend-service:80")

def run_extraction():
    try:
        res = requests.post(f"{BACKEND_URL}/increment")
        print("Extractor incremented:", res.json())
    except Exception as e:
        print("Extractor failed:", e)

if __name__ == "__main__":
    run_extraction()
