import requests
import json
from conftest import BASE_URL

def test_metadata_api():
    """Verifica se o endpoint /metadata.json responde corretamente ."""
    url = BASE_URL.rstrip('/') + "/metadata.json"
    resp = requests.get(url, timeout=10)
    if resp.status_code == 200:
        data = resp.json()
        assert isinstance(data, dict)
        # checar chaves esperadas (ajuste conforme resposta real)
        assert any(k.lower() in ("machine","spot","rpm","dynamicRange", "interval" ) for k in data.keys())
        print(json.dumps(data, indent=4, ensure_ascii=False))
        return
    # se nenhum endpoint respondeu 200, falha
    assert False, "Nenhum endpoint /metadata.json retornou 200"
    
def test_metadata_display(page):
    """Verifica se o cabeçalho exibe as informações"""
    page.goto(BASE_URL)
    header = page.locator('head')
    assert header.count() >= 1
    text = header.first.inner_text(timeout=5000)
    assert len(text.strip()) > 0
