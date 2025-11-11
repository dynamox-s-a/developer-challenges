# Desafio full-stack Dynamox

> Este repositório contém o código fonte do desafio full-stack proposto pela Dynamox, incluindo o backend e o frontend.
> Implementação de Matheus Medeiros

**Sumário**

- [Desafio full-stack Dynamox](#desafio-full-stack-dynamox)
  - [Sobre o projeto](#sobre-o-projeto)
  - [Funcionalidades e implementações](#funcionalidades-e-implementações)
  - [Executar Composição](#executar-composição)
    - [Pré-requisitos](#pré-requisitos)
    - [Passos para Executar](#passos-para-executar)

## Sobre o projeto

Este repositório contém um composito de frontend e backend para o desafio full-stack da Dynamox que pode ser executado utilizando Docker Compose para facilitar o processo de configuração e execução.

## Funcionalidades e implementações

As funcionalidades e implementações estão detalhadas nos respectivos READMEs do backend e frontend:

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)

## Executar Composição

### Pré-requisitos

- Docker
- Docker Compose
- git

### Passos para Executar

1. Clone o repositório:

   ```bash
    git clone https://github.com/MatheusDMedeiros/developer-challenges.git
    cd developer-challenges
    git switch matheus-medeiros
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd ./DynaPredict
   ```
3. Inicie a composição Docker:
   ```bash
   docker compose down -v
   docker compose up -d --build
   ```

:clap : Parabéns! O backend e o frontend do projeto devem estar rodando agora. Você pode acessar o frontend em `http://localhost:5173` e o backend em `http://localhost:8000`. A documentação interativa da API do backend está disponível em `http://localhost:8000/docs`.
