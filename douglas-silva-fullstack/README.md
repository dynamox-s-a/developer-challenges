# DynaPredict - Sistema de Gerenciamento de Ativos Industriais

## Visão Geral

O DynaPredict é uma solução completa para gestão de ativos industriais, fornecendo uma visão unificada de máquinas, equipamentos e suas relações hierárquicas. A aplicação oferece uma interface intuitiva para visualização em árvore dos ativos, permitindo um gerenciamento eficiente do parque industrial.

## 📋 Requisitos Técnicos

- **Sistema Operacional**: Windows 10/11, macOS ou Linux
- **Backend**: .NET 8.0 SDK
- **Frontend**: Node.js 18.x
- **Banco de Dados**: SQL Server 2019 ou superior
- **Gerenciador de Pacotes**: npm ou Yarn
- **Git**: Para controle de versão

## 🚀 Início Rápido

### 1. Configuração do Ambiente

Certifique-se de ter instalado:
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18.x](https://nodejs.org/)
- [SQL Server 2019+](https://www.microsoft.com/sql-server/sql-server-downloads)
- [Git](https://git-scm.com/)

### 2. Configuração do Projeto

```bash
# Clonar o repositório
git clone https://github.com/Douglas-SiIva/developer-challenges.git
cd douglas-silva-fullstack

# Configurar o backend
cd backend
cp appsettings.Development.example appsettings.Development.json
```

Edite o arquivo `appsettings.Development.json` com suas credenciais do SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=seu_servidor;Database=DynaPredictDB;User Id=seu_usuario;Password=sua_senha;TrustServerCertificate=True;"
  }
}
```

### 3. Executando a Aplicação

#### Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

O servidor estará disponível em: http://localhost:5000

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse a aplicação em: http://localhost:5173

## 🔍 Documentação da API

A API segue o padrão REST e está documentada com Swagger:

- **Documentação Interativa**: http://localhost/swagger
- **Acesso direto à UI do Swagger**: http://localhost/swagger/index.html
- **Especificação OpenAPI**: http://localhost/swagger/v1/swagger.json

### Principais Endpoints

- `GET /api/machines` - Lista todas as máquinas
- `GET /api/machines/{id}` - Obtém detalhes de uma máquina específica
- `POST /api/machines` - Cria uma nova máquina
- `PUT /api/machines/{id}` - Atualiza uma máquina existente
- `DELETE /api/machines/{id}` - Remove uma máquina

## 🛠 Estrutura do Projeto

```
douglas-silva-fullstack/
├── backend/             # API .NET Core
│   ├── Controllers/     # Controladores da API
│   ├── Data/            # Configuração do banco de dados
│   └── Models/          # Modelos de dados
└── frontend/            # Aplicação React
    ├── src/
    │   ├── components/  # Componentes reutilizáveis
    │   ├── pages/       # Páginas da aplicação
    │   └── services/    # Serviços de API
    └── public/          # Arquivos estáticos
```

## 📄 Licença

Este projeto está licenciado sob os termos da licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.
