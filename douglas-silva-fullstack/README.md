<div align="center">
  <h1>DynaPredict</h1>
  <p>Sistema de Gerenciamento de Máquinas Industriais</p>
  
  [![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
  [![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?logo=microsoft-sql-server)](https://www.microsoft.com/sql-server/)
  [![Docker](https://img.shields.io/badge/Docker-20.10-2496ED?logo=docker)](https://www.docker.com/)
</div>

## 📋 Visão Geral

O **DynaPredict** é um sistema completo para gerenciamento de máquinas industriais, desenvolvido com uma arquitetura moderna que inclui:

- **Backend**: API RESTful em ASP.NET Core 8.0
- **Frontend**: Aplicação React 18 com TypeScript
- **Banco de Dados**: SQL Server 2022
- **Documentação**: Swagger/OpenAPI
- **Containerização**: Docker e Docker Compose

## 🚀 Guia de Início Rápido

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) ou superior
- [Node.js 18.x](https://nodejs.org/) ou superior
- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (opcional, para execução com Docker)

### 🐳 Executando com Docker (Recomendado)

A forma mais fácil de executar o projeto é usando o Docker Compose:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/douglas-silva-fullstack.git
cd douglas-silva-fullstack

# Inicie os contêineres
docker-compose up --build
```

Após a execução, os serviços estarão disponíveis em:
- Frontend: http://localhost:3000
- Backend (API): http://localhost:5000
- Documentação da API: http://localhost:5000/swagger
- SQL Server Management Studio: localhost,1433 (sa/dockerSqlServer123!)

### 🛠️ Execução Manual

#### 1. Configuração do Banco de Dados

1. Instale o SQL Server 2022 ou superior
2. Crie um banco de dados chamado `DynaPredictDb`
3. Atualize a connection string em `backend/appsettings.Development.json`

#### 2. Backend

```bash
# Navegue até a pasta do backend
cd backend

# Restaure os pacotes
dotnet restore

# Execute as migrações do banco de dados
dotnet ef database update

# Inicie o servidor
dotnet run
```

A API estará disponível em: https://localhost:5001

#### 3. Frontend

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: http://localhost:5173

### 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend com as seguintes variáveis:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## 🏗 Estrutura do Projeto

```
.
├── backend/                     # API .NET Core 8.0
│   ├── Controllers/            # Controladores da API
│   ├── Data/                   # Contexto do banco de dados
│   ├── Extensions/             # Extensões para serviços
│   ├── Filters/                # Filtros da API
│   ├── Middleware/             # Middlewares personalizados
│   ├── Migrations/             # Migrações do Entity Framework
│   ├── Models/                 # Modelos de domínio e DTOs
│   ├── Repositories/           # Implementações do padrão Repository
│   ├── Services/               # Lógica de negócios
│   ├── appsettings.json        # Configurações da aplicação
│   └── Program.cs              # Ponto de entrada da aplicação
│
├── frontend/                   # Aplicação React 18
│   ├── public/                 # Arquivos estáticos
│   └── src/
│       ├── components/         # Componentes reutilizáveis
│       ├── hooks/              # Custom hooks
│       ├── pages/              # Páginas da aplicação
│       │   └── Machines/       # Páginas de gerenciamento de máquinas
│       ├── services/           # Serviços de API
│       ├── types/              # Tipos TypeScript
│       ├── App.tsx             # Componente raiz
│       └── main.tsx            # Ponto de entrada
│
├── docker/                     # Configurações do Docker
│   ├── sql/                   # Scripts SQL para inicialização
│   └── Dockerfile.backend     # Dockerfile para o backend
│   └── Dockerfile.frontend    # Dockerfile para o frontend
│
├── .github/                   # Configurações do GitHub
│   └── workflows/             # GitHub Actions
│
├── .vscode/                   # Configurações do VS Code
├── .editorconfig              # Configurações de estilo de código
├── .gitignore                 # Arquivos ignorados pelo Git
├── docker-compose.yml         # Configuração do Docker Compose
├── README.md                  # Este arquivo
└── LICENSE                   # Licença do projeto
```

## 📚 Documentação da API

A documentação interativa da API está disponível através do Swagger UI quando o backend estiver em execução:

- **URL da Documentação**: http://localhost:5000/swagger
- **Especificação OpenAPI**: http://localhost:5000/swagger/v1/swagger.json

### Recursos da Documentação

- **Endpoints** completos com descrições detalhadas
- **Modelos de requisição/resposta** com exemplos
- **Códigos de status HTTP** e possíveis respostas de erro
- **Parâmetros de consulta** e cabeçalhos suportados
- **Autenticação** (quando implementada)
- **Filtros e ordenação** de resultados
- **Paginação** de listagens

### Tipos de Dados

A API utiliza os seguintes formatos de dados:

- **JSON** para requisições e respostas
- **ISO 8601** para datas e horas (ex: `2023-10-01T14:30:00Z`)
- **UTC** como fuso horário padrão

## 🛠 Desenvolvimento

### Configuração do Ambiente

1. **Backend**
   - .NET 8.0 SDK
   - SQL Server 2019+ ou Docker
   - Visual Studio 2022 ou VS Code com extensão C#

2. **Frontend**
   - Node.js 18.x
   - npm 9.x ou Yarn 1.22.x
   - VS Code com extensões para React e TypeScript

### Convenções de Código

- **Backend**: [Diretrizes de Codificação da Microsoft](https://docs.microsoft.com/pt-br/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- **Frontend**: [Guia de Estilo do Airbnb](https://github.com/airbnb/javascript)
- **Mensagens de Commit**: [Conventional Commits](https://www.conventionalcommits.org/)

### Testes

```bash
# Executar testes do backend
cd backend
dotnet test

# Executar testes do frontend
cd frontend
npm test
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Faça o push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [.NET](https://dotnet.microsoft.com/)
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [SQL Server](https://www.microsoft.com/sql-server/)
- [Docker](https://www.docker.com/)

## 🧪 Testes

Para executar os testes unitários:

```bash
cd backend
dotnet test
```

## 🐳 Executando com Docker

1. **Construa as imagens**
   ```bash
   docker-compose build
   ```

2. **Inicie os containers**
   ```bash
   docker-compose up -d
   ```

3. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - Swagger: http://localhost:5000/swagger

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✉️ Contato

Seu Nome - seu.email@exemplo.com

[![LinkedIn][linkedin-shield]][linkedin-url]

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/seu-linkedin
     - `VITE_API_BASE_URL=http://localhost:5010/api`
   - Rodar: `npm run dev`

## Suposições
- Tipos de máquina fixos em `MachineType` (enum): Press, Lathe, MillingMachine, etc.
- Ordem/drag da árvore visual não é persistida; apenas renomes e nós extras via localStorage.

## Boas práticas implementadas
- Camadas Repository/Service no backend
- Middleware global de erros com payload `{ traceId, message, status }`
- Swagger + XML docs nos endpoints
- Frontend com validação, axios interceptor e baseURL via `.env`

## Próximos passos sugeridos
- Paginação e filtros nos endpoints de listagem
- Testes (unitários/integrados) no backend e frontend
- Docker Compose (API + SQL Server + Frontend)
- Tratamento global de erros mais detalhado (mapear domain exceptions)
