from conftest import BASE_URL
import time

def test_three_charts_display(page):
    """Verifica se 3 gráficos são renderizados"""
    page.goto(BASE_URL)
    # espera rápida para os gráficos carregarem
    page.wait_for_timeout(1500)
    # muitos charts são renderizados como canvas ou svg
    charts = page.locator('canvas, svg')
    count = charts.count()
    assert count >= 3, f"Esperado pelo menos 3 gráficos, encontrado {count}"
    
    # verificar títulos visíveis no layout
    assert page.locator('text=Aceleração RMS').count() + page.locator('text=Aceleração RMS'.lower()).count() > 0 , "Título não encontrado: Aceleração RMS" 
    assert page.locator('text=Velocidade RMS').count() + page.locator('text=Velocidade RMS'.lower()).count() > 0, "Título não encontrado: Velocidade RMS" 
    assert page.locator('text=Temperatura').count() + page.locator('text=Temperatura'.lower()).count() > 0, "Título não encontrado: Temperatura" 
    print(f"Foram encontrados 3 gráficos")

def test_tooltip_on_hover(page):
    """Valida tooltip ao passar o mouse sobre um gráfico SVG do Recharts"""
    page.goto(BASE_URL)
    page.wait_for_selector("svg", timeout=10000)

    chart = page.locator("svg").nth(5)
    box = chart.bounding_box()
    assert box is not None, "Não foi possível obter bounding box do gráfico"

    # Tenta várias posições horizontais (como se fosse um mouse movendo sobre o gráfico)
    for offset in range(50, int(box["width"]) - 50, 30):
        x = box["x"] + offset
        y = box["y"] + int(box["height"] / 2)
        page.mouse.move(x, y)
        page.wait_for_timeout(200)
        tooltip = page.locator(".highcharts-tooltip-box")
        if tooltip.count() > 0 and tooltip.first.is_visible():
            print(f"Tooltip detectado na posição x={offset}")
            return

    # Se não encontrou em nenhuma posição:
    page.screenshot(path="reports/screenshots/tooltip_fail.png")
    raise AssertionError("Tooltip não foi detectado após mover o mouse em várias posições.")


