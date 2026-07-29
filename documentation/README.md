# Desafio QA Dynamox - Robot Framework

Este repositório contém um projeto de automação em Robot Framework para o dashboard hospedado em https://frontend-test-for-qa.vercel.app/. 
O projeto fornece testes automatizados de contrato de API (RequestsLibrary) e testes de interface via navegador (Browser Library / Playwright) organizados.

O repositório foi criado pra demonstrar a lógica de pensamento e organização dos cenários de testes e divisões de automações e testes manuais explicados, escritos e documentados.
Então:
- Demonstra boas práticas e boa lógica de Robot Framework: separação de testes, keywords, pages e variáveis; localizadores centralizados; keywords reutilizáveis; e documentação clara.
- Valida tanto os contratos JSON do backend quanto a renderização/interação do frontend.
- Preparado para futura integração em CI e manutenção.

Aplicação sob teste
- Endpoint de metadados: https://frontend-test-for-qa.vercel.app/metadata.json
- Endpoint de dados: https://frontend-test-for-qa.vercel.app/data.json
- Página da UI: https://frontend-test-for-qa.vercel.app/

O que é testado
- Validações de API para metadados e dados de séries temporais.
- Renderização da UI dos metadados do cabeçalho (documentado como defeito de exibição de valor) e presença de três seções de gráfico.
- Comportamento de refresh da página para garantir que os dados sejam requisitados novamente.
- Interação do tooltip do gráfico (documentado como defeito de produto quando ausente).

Estrutura do projeto
- `tests/`
  - `smoke/` - Jornada principal de landing page e verificações de sanidade
  - `header/` - Validações da UI do cabeçalho/metadados
  - `charts/` - Testes de presença e interação dos gráficos
  - `api/` - Testes de dados de API para `metadata.json` e `data.json`
  - `refresh/` - Testes de comportamento de refresh
- `resources/`
  - `pages/` - Recursos Robot no estilo page object
  - `keywords/` - Keywords reutilizáveis de navegador e API
  - `variables/` - Variáveis de ambiente e localizadores
  - `common/` - Configurações e imports compartilhados
- `documentation/` - Plano de testes, relatórios de bug e feedback de design
- `reports/` - Saídas do Robot Framework (report.html, log.html, output.xml)

Pré-requisitos
- Windows, macOS ou Linux
- Python 3.12+
- Node.js e npm (necessários para o Browser Library instalar o Playwright)

Instalação (recomendada)
1. Crie e ative um ambiente virtual Python:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1    # Windows PowerShell
# ou
source .venv/bin/activate         # macOS / Linux
```

2. Instale as dependências Python (versões fixas são fornecidas):

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

3. Inicialize o Browser Library (instala os pacotes Node e os navegadores Playwright):

```powershell
rfbrowser init
```

Observação: garanta que `npm` e `node` estejam no PATH antes de executar `rfbrowser init`.

Executando os testes
- Execute toda a suíte e escreva os relatórios em `reports/`:

```powershell
python -m robot -d reports tests
```

- Execute uma única suite de testes:

```powershell
python -m robot -d reports tests/smoke/smoke_dashboard.robot
```

Visualizando os resultados
- Após a execução, abra `reports/report.html` em um navegador para inspecionar acertos e falhas.
- `reports/output.xml` pode ser consumido por ferramentas de CI ou analisado para relatórios adicionais.

Limitação conhecida descoberta durante os testes
- Ao passar o mouse sobre o gráfico de Temperatura, não foi renderizado um elemento de tooltip no gráfico. O teste de interação do gráfico marca isso como um defeito de produto e inclui um relatório formal em `documentation/BUG_REPORTS/TOOLTIP_MISSING.md`.
