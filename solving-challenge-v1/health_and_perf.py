import requests
import time
import sys
import statistics

class DynamoxValidator:
    def __init__(self, base_url):
        self.base_url = base_url

    def wait_for_services(self, timeout=30):
        print("🔍 [1/3] Aguardando API e Banco de Dados...")
        start = time.time()
        while time.time() - start < timeout:
            try:
                # Verifica se o root responde
                res = requests.get(f"{self.base_url}/", timeout=2)
                if res.status_code == 200:
                    print("✅ API Online!")
                    return True
            except:
                pass
            time.sleep(2)
        return False

    def run_business_logic_tests(self):
        print("\n🧪 [2/3] Rodando testes de lógica de negócio...")
        
        # Ajustado para bater com seu main.py:
        # Passando name e data como query parameters na URL
        series_name = "sensor_test_01"
        series_values = [10.0, 20.0, 30.0]
        
        # Teste 1: Ingestão (POST /series?name=...&data=...)
        # O requests.post com 'params' envia na URL como o seu FastAPI espera
        res_post = requests.post(
            f"{self.base_url}/series", 
            params={"name": series_name}, 
            json=series_values
        )
        
        t1 = res_post.status_code == 200
        print(f"   - Ingestão de dados: {'✅ OK' if t1 else f'❌ ERRO ({res_post.status_code})'}")

        # Teste 2: Métricas (GET /series/{name}/metrics)
        res_met = requests.get(f"{self.base_url}/series/{series_name}/metrics")
        
        t2 = False
        if res_met.status_code == 200:
            data = res_met.json()
            # Verifica se as métricas calculadas pelo Pandas estão lá
            if "metrics" in data and data["metrics"]["mean"] == 20.0:
                t2 = True
        
        print(f"   - Cálculo de métricas: {'✅ OK' if t2 else f'❌ ERRO ({res_met.status_code})'}")
        
        return t1 and t2

    def run_latency_benchmark(self, iterations=10):
        print(f"\n⚡ [3/3] Iniciando benchmark de latência ({iterations} iterações)...")
        latencies = []
        
        for i in range(iterations):
            start = time.perf_counter()
            # Teste rápido de leitura para medir latência pura
            requests.get(f"{self.base_url}/")
            diff = (time.perf_counter() - start) * 1000
            latencies.append(diff)
            
        avg_latency = statistics.mean(latencies)
        p95 = statistics.quantiles(latencies, n=20)[18]
        
        print(f"   - Latência Média: {avg_latency:.2f}ms")
        print(f"   - P95 (Latência de cauda): {p95:.2f}ms")
        
        status = "✅ DENTRO DO REQUISITO (<350ms)" if avg_latency < 350 else "❌ FORA DO REQUISITO"
        print(f"   - Status: {status}")
        return avg_latency < 350

if __name__ == "__main__":
    # Define o alvo (container 'api' ou localhost)
    target_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    
    validator = DynamoxValidator(target_url)
    
    if not validator.wait_for_services():
        print("❌ Falha crítica: API não respondeu.")
        sys.exit(1)
        
    logic_ok = validator.run_business_logic_tests()
    latency_ok = validator.run_latency_benchmark()
    
    print("\n" + "="*40)
    if logic_ok and latency_ok:
        print("🚀 DESAFIO DYNAMOX: PRONTO PARA SUBMISSÃO!")
    else:
        print("⚠️ DESAFIO COM PENDÊNCIAS. VERIFIQUE OS ERROS ACIMA.")
    print("="*40)