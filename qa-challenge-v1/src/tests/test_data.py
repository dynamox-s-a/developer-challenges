import requests
import json
from conftest import BASE_URL

def test_data_api():
    """Valida o endpoint data.json """
    url = BASE_URL.rstrip('/') + "/data.json"
    resp = requests.get(url, timeout=10)
    if resp.status_code == 200:
        data = resp.json()
        assert isinstance(data, dict) or isinstance(data, list)
        # validação leve: verificar presença de arrays de séries
        # aceita formatos variados; adapta conforme o retorno real
        assert data, "Resposta /data vazia"
        print(json.dumps(data, indent=4, ensure_ascii=False))        
        return
    assert False, "Nenhum endpoint /data.json retornou 200"

