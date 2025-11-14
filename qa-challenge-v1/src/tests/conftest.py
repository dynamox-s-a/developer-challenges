import pytest
from playwright.sync_api import sync_playwright

BASE_URL = "https://frontend-test-for-qa.vercel.app"

@pytest.fixture(scope="session")
def browser():
    # Lança o browser em modo visível (headful)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=50)
        yield browser
        browser.close()

@pytest.fixture
def page(browser):
    context = browser.new_context()
    page = context.new_page()
    yield page
    context.close()
