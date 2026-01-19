# Plataforma de Gerenciamento de Eventos

Uma aplicação completa de gerenciamento de eventos com autenticação, painel administrativo e testes automatizados.

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior) - [Baixar](https://nodejs.org/)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Git** (opcional, para clonar o repositório)

## Instalação e Execução Rápida

### 1. Clonar ou Baixar o Projeto

Se você tem Git instalado:
```bash
git clone <seu-repositorio>
cd event-management
```

Ou baixe o arquivo ZIP e extraia em sua máquina.

### 2. Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isto irá instalar todas as dependências necessárias (pode levar alguns minutos).

### 3. Iniciar o Servidor API (JSON Server)

Abra um terminal e execute:

```bash
npm run api
```

Você verá:
```
JSON Server is running on http://localhost:3001
```

**Deixe este terminal aberto enquanto estiver usando a aplicação.**

### 4. Iniciar a Aplicação (Novo Terminal)

Abra um novo terminal na pasta do projeto e execute:

```bash
npm run dev
```

Você verá:
```
> next dev
  ▲ Next.js 16.1.2
  - ready on 0.0.0.0:3000 (open http://localhost:3000)
```

### 5. Acessar a Aplicação

Abra seu navegador e vá para: **http://localhost:3000**

## 👤 Credenciais de Login

A aplicação vem com 2 usuários pré-configurados:

### Admin (pode criar, editar e deletar eventos)
- **Email**: `admin@events.com`
- **Senha**: `admin123`

### Reader (pode apenas visualizar eventos)
- **Email**: `reader@events.com`
- **Senha**: `reader123`

## Estrutura do Projeto

```
event-management/
├── src/
│   ├── app/                    # Páginas Next.js
│   │   ├── admin/             # Painel administrativo
│   │   ├── events/            # Listagem de eventos
│   │   ├── login/             # Página de login
│   │   ├── layout.tsx         # Layout principal
│   │   └── providers.tsx      # Configuração Redux/Material-UI
│   ├── components/            # Componentes reutilizáveis
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Redux store
│   ├── services/              # Serviços (API)
│   ├── types/                 # Tipos TypeScript
│   └── utils/                 # Funções utilitárias
├── cypress/                   # Testes E2E
├── db.json                    # Banco de dados JSON
├── package.json               # Dependências
└── README.md                  # Este arquivo
```

## Funcionalidades Principais

### Para Leitores (Reader)
- Visualizar próximos eventos
- Visualizar eventos passados
- Buscar eventos por nome
- Fazer logout

### Para Administradores (Admin)
- Tudo que o leitor pode fazer
- Criar novos eventos
- Editar eventos existentes
- Deletar eventos
- Ver estatísticas de eventos

## Executar Testes Automatizados (Cypress)

### Opção 1: Interface Gráfica do Cypress

```bash
npx cypress open
```

Isto abrirá a interface do Cypress. Clique em "events.cy.ts" para executar os testes.

### Opção 2: Executar testes em Headless (sem interface)

```bash
npx cypress run
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build otimizado para produção |
| `npm start` | Inicia servidor de produção |
| `npm run api` | Inicia JSON Server (API Mock) |
| `npm run lint` | Executa verificação de linting |
| `npx cypress open` | Abre interface de testes Cypress |
| `npx cypress run` | Executa testes em headless |


### Erro: "PORT 3000 already in use"
A porta 3000 já está em uso. Execute:
```bash
npm run dev -- -p 3001
```
Depois acesse http://localhost:3001

### Erro: "Cannot find module"
Limpe cache e reinstale dependências:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de Hydration no Navegador
Limpe o cache do navegador (Ctrl+Shift+Delete) e recarregue a página.

### JSON Server não inicia
Verifique se a porta 3001 está disponível. Se não estiver:
```bash
npm run api -- --port 3002
```

## Tipos de Eventos

A plataforma suporta os seguintes tipos de eventos:

- Conferência
- Workshop
- Seminário
- Networking
- Outro

## Autenticação

A autenticação é baseada em tokens JWT fake. O token é armazenado no `localStorage` do navegador e validado em cada requisição.

## Banco de Dados

A aplicação usa **JSON Server** como API mock. Os dados são armazenados em `db.json` e são persistidos no disco.

### Estrutura do Banco

**Users:**
```json
{
  "id": "1",
  "email": "admin@events.com",
  "password": "admin123",
  "role": "admin"
}
```

**Events:**
```json
{
  "id": "4a9f",
  "name": "Evento",
  "date": "2026-01-17T11:20",
  "location": "São Paulo",
  "description": "Descrição...",
  "category": "Workshop"
}
```

## Tecnologias Utilizadas

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Redux Toolkit** - Gerenciamento de estado
- **Material-UI (MUI)** - Componentes UI
- **Axios** - Cliente HTTP
- **JSON Server** - API Mock
- **Cypress** - Testes E2E
- **ESLint** - Linter de código

## Licença

Este projeto é fornecido como está para fins educacionais.

---
