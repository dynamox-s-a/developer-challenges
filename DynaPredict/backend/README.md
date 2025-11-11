# Backend

**Sumário**

- [Backend](#backend)
  - [Descrição do Projeto](#descrição-do-projeto)
  - [API Endpoints](#api-endpoints)
    - [Auth (Autenticação)](#auth-autenticação)
    - [Machine (Máquina)](#machine-máquina)
    - [Monitoring Point (Ponto de Monitoramento)](#monitoring-point-ponto-de-monitoramento)
    - [Sensor](#sensor)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Executar o Projeto](#executar-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Passos para Executar](#passos-para-executar)

## Descrição do Projeto

Este repositório contém o backend como parte do desafio full-stack da Dynamox. Ele contém uma API desenvolvida com Python e FastAPI e ORM SQLAlchemy para manipulação do banco de dados PostgreSQL e Alembic para migrações de esquema.

O backend é responsável por gerenciar máquinas, sensores e pontos de monitoramento, fornecendo uma API REST para o frontend interagir.

**Sumario:**

## API Endpoints

Este documento lista todos os endpoints disponíveis na API, organizados por categoria.

---

### Auth (Autenticação)

| Método   | Endpoint               | Descrição       | Protegido |
| :------- | :--------------------- | :-------------- | :-------- |
| **POST** | `/auth/create-account` | Criar conta     | ❌        |
| **POST** | `/auth/login`          | Fazer login     | ❌        |
| **GET**  | `/auth/refresh-token`  | Atualizar token | ✅        |

---

### Machine (Máquina)

| Método     | Endpoint                | Descrição                 | Protegido |
| :--------- | :---------------------- | :------------------------ | :-------- |
| **GET**    | `/machine`              | Listar máquinas           | ✅        |
| **POST**   | `/machine`              | Criar máquina             | ✅        |
| **DELETE** | `/machine/{machine_id}` | Excluir máquina           | ✅        |
| **GET**    | `/machine/{machine_id}` | Obter detalhes da máquina | ✅        |
| **PUT**    | `/machine/{machine_id}` | Atualizar máquina         | ✅        |

---

### Monitoring Point (Ponto de Monitoramento)

| Método     | Endpoint                                         | Descrição                                | Protegido |
| :--------- | :----------------------------------------------- | :--------------------------------------- | :-------- |
| **GET**    | `/monitoring-point`                              | Listar pontos de monitoramento           | ✅        |
| **POST**   | `/monitoring-point`                              | Criar ponto de monitoramento             | ✅        |
| **POST**   | `/monitoring-point/assign`                       | Associar sensor                          | ✅        |
| **DELETE** | `/monitoring-point/{monitoring_point_id}/sensor` | Remover sensor do ponto de monitoramento | ✅        |
| **DELETE** | `/monitoring-point/{monitoring_point_id}`        | Excluir ponto de monitoramento           | ✅        |

---

### Sensor

| Método     | Endpoint              | Descrição       | Protegido |
| :--------- | :-------------------- | :-------------- | :-------- |
| **GET**    | `/sensor`             | Listar sensores | ✅        |
| **POST**   | `/sensor`             | Criar sensor    | ✅        |
| **DELETE** | `/sensor/{sensor_id}` | Excluir sensor  | ✅        |

---

**Observação:**

> Todos os endpoints marcados como **“✅ ”** exigem um **token JWT válido** no cabeçalho `Authorization` no formato:

```bash
curl -X GET http://localhost:8000/machine \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

> [!NOTE]
> Refresh token está implementado no backend, mas não está sendo utilizado no frontend atualmente.

## Tecnologias Utilizadas

- Python 3.9+
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL

## Executar o Projeto

### Pré-requisitos

- Python 3.9 ou superior
- git
- Docker e Docker Compose (opcional, para facilitar a configuração do PostgreSQL)

### Passos para Executar

> Antes de seguir, execute o banco de dados PostgreSQL usando Docker Compose dentro do diretório `DynaPredict`:
>
> ```bash
> docker compose down -v
> docker compose up db
> ```

1. Clone este repositório:

   ```bash
    git clone https://github.com/MatheusDMedeiros/developer-challenges.git
    cd developer-challenges
    git switch matheus-medeiros
   ```

2. Navegue até o diretório do backend:
   ```bash
   cd ./DynaPredict/backend
   ```
3. Crie um ambiente virtual e ative-o:
   ```bash
    python3 -m venv venv
    source venv/bin/activate
   ```
4. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
5. Execute as migrações do banco de dados:
   ```bash
   alembic upgrade head
   ```
6. Inicie o servidor FastAPI:
   ```bash
   uvicorn main:app --reload
   ```
   :clap : Parabéns! O backend do projeto deve estar rodando agora em `http://localhost:8000`. Você pode acessar a documentação interativa da API em `http://localhost:8000/docs`.
