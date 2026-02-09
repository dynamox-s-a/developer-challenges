import requests
import logging
import os
import sys

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

def run_extraction():
    logging.info(f"Starting extraction from {BACKEND_URL}...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/metrics", timeout=5)

        response.raise_for_status() 
        
        data = response.json()
        logging.info(f"SUCCESS: Extracted {data.get('successful_requests')} requests.")
        
    except requests.exceptions.ConnectionError:
        logging.error("FAILED: Backend is unreachable. Check network/DNS.")
        sys.exit(1)
    except requests.exceptions.Timeout:
        logging.error("FAILED: Request timed out.")
        sys.exit(1)
    except Exception as e:
        logging.error(f"FAILED: An unexpected error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_extraction()