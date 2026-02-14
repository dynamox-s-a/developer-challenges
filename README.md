# Projeto de Testes Automatizados – Playwright

Este projeto contém testes automatizados end-to-end utilizando Playwright.

## Pré-requisitos

Antes de começar, você precisa ter instalado na máquina:

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Tecnologias
- **Framework:** [Playwright](https://playwright.dev/)
- **Linguagem:** TypeScript
- **Arquitetura:** Page Object Model (POM)
- **Containerização:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

## Instalação
1. Clone este repositório para a sua máquina local:

```bash
git clone https://github.com/dynamox-s-a/developer-challenges.git
```
2. Mova para a branch `douglas-figueiredo`:

```bash
git switch douglas-figueiredo
```
3. Instale as dependências do projeto:

```bash
npm install
```
## Executando os Testes
Para executar os testes, use o seguinte comando:

instale os browsers do playwright:
```bash
npx playwright install
```
Para executar os testes:

```bash
npx playwright test
```

### Executando com Docker
Se você tem o Docker instalado, não precisa configurar o ambiente Node.js localmente. Basta rodar o comando abaixo na raiz do projeto.

```bash
docker compose up --build
```