from flask import Flask, jsonify, request
import logging

# Configuração de Logs (Essencial para DevSecOps/Observabilidade)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

stats = {"successful_requests": 0}

@app.route('/')
def home():
    try:
        stats["successful_requests"] += 1
        logging.info("Successful request processed.")
        return "Request successful!", 200
    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    
# Metrics endpoint for cronjob scraping
@app.route('/metrics', methods=['GET'])
def metrics():
    if stats is None:
        logging.warning("Stats dictionary is missing.")
        return jsonify({"error": "Data unavailable"}), 503
    return jsonify(stats)

# Health Check for k8s.
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)