# QA challenge v1 (Python) - Playwright Sync API + pytest-html

Projeto de exemplo para o desafio de QA: testes E2E usando **Playwright (Sync API)**,
**pytest** e **pytest-html**. O navegador roda em **modo visível** (headful).

## Pré-requisitos
- Python 3.8+
- Internet para instalar dependências e para `playwright install`

## Instalação
```bash
python -m venv venv
source venv/bin/activate    # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
```

Instale navegadores do Playwright:
```bash
playwright install
```

## Executando os testes (modo visível)
```bash
pytest -v --html=reports/report.html
```

- O relatório HTML ficará em `reports/report.html`.
- Para executar um arquivo específico:
  `pytest -q tests/test_charts.py -k tooltip --html=reports/report.html`

## Estrutura
```
src/
├── README.md
├── requirements.txt
├── pytest.ini
├── tests/
│   ├── conftest.py
│   ├── test_metadata.py
│   ├── test_data.py
│   ├── test_charts.py
│   └── test_ui_behavior.py
└── reports/
```

## Observações
- O navegador é lançado com `headless=False` para que você visualize a execução.
