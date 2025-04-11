# Backend Developer Challenge

Este projeto é um backend desenvolvido com NestJS e Prisma, utilizando PostgreSQL como banco de dados. Abaixo estão as instruções para configurar, rodar e testar o projeto, bem como a documentação dos endpoints disponíveis.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Configuração do Ambiente

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd backend
   ```

2. Instale as dependências do projeto:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

   ```env
   DATABASE_URL=postgresql://postgres:123@localhost:5434/nest
   JWT_SECRET=<sua_chave_secreta>
   ```

   **Nota:** Para este projeto, a imagem Docker já nos fornece o nome do usuário (`postgres`), a senha (`123`) e o nome do banco de dados (`nest`) para serem utilizados na string de conexão.

## Rodando o Banco de Dados

1. Inicie o banco de dados com Docker Compose:

   ```bash
   docker-compose up -d
   ```

2. Execute as migrações do Prisma para criar as tabelas no banco de dados:

   ```bash
   npx prisma migrate dev
   ```

3. (Opcional) Acesse o banco de dados com o Prisma Studio:

   ```bash
   npx prisma studio
   ```

## Rodando o Projeto

1. Inicie o servidor de desenvolvimento:

   ```bash
   npm run start:dev
   ```

2. O servidor estará disponível em `http://localhost:3000`.

## Rodando os Testes

1. Execute os testes unitários:

   ```bash
   npm run test
   ```

2. Execute os testes de integração:

   ```bash
   npm run test:e2e
   ```

## Endpoints Disponíveis

### Autenticação

- **POST /auth/login**
  - Descrição: Realiza o login de um usuário.
  - Corpo da requisição:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

- **POST /auth/signup**
  - Descrição: Registra um novo usuário.
  - Corpo da requisição:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

### Máquinas

- **GET /machine**
  - Descrição: Lista todas as máquinas.

- **POST /machine**
  - Descrição: Cria uma nova máquina.
  - Corpo da requisição:
    ```json
    {
      "name": "string",
      "type": "Pump | Fan"
    }
    ```

- **PATCH /machine/:id**
  - Descrição: Atualiza uma máquina existente.
  - Corpo da requisição:
    ```json
    {
      "name": "string",
      "type": "Pump | Fan"
    }
    ```

- **DELETE /machine/:id**
  - Descrição: Remove uma máquina.

### Pontos de Monitoramento

- **GET /monitoring-point**
  - Descrição: Lista todos os pontos de monitoramento.

- **POST /monitoring-point**
  - Descrição: Cria um novo ponto de monitoramento.
  - Corpo da requisição:
    ```json
    {
      "name": "string",
      "machineId": "number"
    }
    ```

- **PATCH /monitoring-point/:id**
  - Descrição: Atualiza um ponto de monitoramento existente.
  - Corpo da requisição:
    ```json
    {
      "name": "string",
      "machineId": "number"
    }
    ```

- **DELETE /monitoring-point/:id**
  - Descrição: Remove um ponto de monitoramento.

### Sensores

- **GET /sensor**
  - Descrição: Lista todos os sensores.

- **POST /sensor**
  - Descrição: Cria um novo sensor.
  - Corpo da requisição:
    ```json
    {
      "model": "TcAg | TcAs | HFPlus",
      "monitoringPointId": "number"
    }
    ```

- **DELETE /sensor/:id**
  - Descrição: Remove um sensor.
