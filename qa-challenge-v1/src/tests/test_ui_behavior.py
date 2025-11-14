from conftest import BASE_URL

def test_no_js_errors(page):
    """Verifica se não há erros JS durante o carregamento da página"""
    errors = []
    def on_page_error(exception):
        errors.append(str(exception))
    page.on('pageerror', lambda e: on_page_error(e))
    page.goto(BASE_URL)
    page.wait_for_timeout(1000)
    assert not errors, f"Erros de JS detectados: {errors}"

