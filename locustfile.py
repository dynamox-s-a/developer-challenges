from locust import HttpUser, task, between
from datetime import datetime, timezone, timedelta
import random

class SensorSimulationUser(HttpUser):
    
    # Simulação de espera de envio dos sensores
    wait_time = between(1, 3)

    @task(3)
    def simulate_sensor_data_insertion(self):
        """Simula um sensor enviando um lote de 500 pontos de uma vez."""
        
        # Gera 500 pontos de dados com timestamps sequenciais
        base_time = datetime.now(timezone.utc)
        data_points = [
            {
                "timestamp": (base_time + timedelta(seconds=i)).isoformat(),
                "value": random.uniform(20.0, 80.0)
            }
            for i in range(500)
        ]
        
        payload = {
            "name": f"Sensor de Carga {random.randint(1, 100)}",
            "unit": "Hz",
            "data_points": data_points
        }

        self.client.post("/api/series/", json=payload, name="POST /api/series/ (500 pts)")

    @task(1)
    def simulate_dashboard_read(self):
        """Simula uma leitura moderada no banco de dados por parte de um usuário."""
        self.client.get("/api/series/count", name="GET /api/series/count")