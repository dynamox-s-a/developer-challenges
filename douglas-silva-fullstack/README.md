<div align="center">
  <h1>DynaPredict</h1>
  <p>Sistema de Gerenciamento de Máquinas Industriais</p>
  
  [![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
  [![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?logo=microsoft-sql-server)](https://www.microsoft.com/sql-server/)
  [![Docker](https://img.shields.io/badge/Docker-20.10-2496ED?logo=docker)](https://www.docker.com/)
</div>

## 📋 Sobre o Projeto

O **DynaPredict** é uma aplicação web para gerenciamento de máquinas industriais, desenvolvida com uma arquitetura moderna que inclui:

- **Backend**: API RESTful em ASP.NET Core 8.0
- **Frontend**: Aplicação React com TypeScript
- **Banco de Dados**: SQL Server 2022
- **Containerização**: Docker e Docker Compose

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18.x](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (opcional, para execução com containers)
- [SQL Server 2019+](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads) (opcional, se não for usar Docker)

### Configuração Inicial

1. Clone o repositório:
   ```bash
   git clone https://github.com/Douglas-SiIva/developer-challenges.git
   cd douglas-silva-fullstack
   ```

2. Crie um arquivo `appsettings.Development.json` na pasta `backend` baseado no exemplo fornecido:
   ```bash
   cd backend
   copy appsettings.Development.example appsettings.Development.json
   ```

   Atualize a string de conexão no arquivo `appsettings.Development.json` conforme necessário.

### Executando com Docker (Recomendado)

1. Navegue até a raiz do projeto
2. Execute o comando:
   ```bash
   docker compose up --build
   ```

   Isso irá:
   - Construir as imagens do backend e frontend
   - Iniciar os containers do SQL Server, backend e frontend
   - Configurar automaticamente o banco de dados

3. Acesse a aplicação:
   - **Frontend**: http://localhost:5173
   - **Backend (API)**: http://localhost:5000
   - **Documentação Swagger**: http://localhost:5000/swagger

### Executando Localmente (Sem Docker)

#### Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Restaure os pacotes e execute as migrações:
   ```bash
   dotnet restore
   dotnet ef database update
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   dotnet run
   ```

   O servidor estará disponível em: http://localhost:5000

#### Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

   O frontend estará disponível em: http://localhost:5173

## 🛠 Tecnologias Utilizadas

- **Backend**: .NET 8, Entity Framework Core, Swagger
- **Frontend**: React 18, TypeScript, Vite
- **Banco de Dados**: SQL Server 2022
- **Ferramentas**: Docker, Git

## 📚 Documentação

A documentação da API está disponível através do Swagger:
- **Swagger UI**: http://localhost:5000/swagger
- **Especificação OpenAPI**: http://localhost:5000/swagger/v1/swagger.json

## 🤝 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature
3. Adicione suas mudanças
4. Envie um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## ✉️ Contato

Seu Nome - [@seu-usuario](https://github.com/seu-usuario) - seu.email@exemplo.com
