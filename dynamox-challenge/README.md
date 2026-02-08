# Dynamox Challenge

Uma aplicação full-stack robusta para gerenciamento de máquinas e pontos de monitoramento, utilizando arquitetura moderna com **React** no Frontend e **NestJS** no Backend.

---

## ✨ Funcionalidades do Sistema

O sistema foi projetado para oferecer uma experiência completa de gerenciamento de ativos industriais:

*   **Autenticação Segura:** Login com JWT e proteção de rotas privadas.
*   **Gestão de Máquinas:**
    *   Listagem visual com cartões informativos.
    *   Criação e edição de máquinas (Bomba, Ventilador, etc.).
    *   Validação de nomes únicos para evitar duplicidade.
*   **Pontos de Monitoramento (Monitoring Points):**
    *   Associação inteligente com máquinas.
    *   Visualização clara dos sensores vinculados.
*   **Gestão de Sensores:**
    *   Adição e remoção de sensores (TcAg, TcAs, HF+).
    *   Regras de negócio aplicadas (ex: restrições de modelos por tipo de máquina).
*   **Interface Responsiva:** Design moderno e adaptável utilizando Material UI.

---

## 🚀 Arquitetura e Tecnologias

### 🎨 Frontend (Aplicação Web)

O frontend foi construído focado em **performance**, **manutenibilidade** e **experiência do desenvolvedor**.

*   **Core:** React 18 + TypeScript + Vite (Build ultra-rápido).
*   **Gerenciamento de Estado:** Redux Toolkit (RTK) + RTK Query para caching e chamadas de API eficientes.
*   **UI Framework:** Material UI (MUI v5) para componentes acessíveis e estéticos.
*   **Forms & Validação:** React Hook Form + Zod (Schema validation).
*   **Testes:** Vitest + React Testing Library (Cobertura de fluxos críticos).

### ⚙️ Backend (API REST)

O backend foi estruturado com foco em **separação de responsabilidades** e **boas práticas de design**, utilizando os recursos de **injeção de dependência** e **modularização** do NestJS, alinhados aos princípios do **SOLID**.


*   **Framework:** NestJS (Estrutura modular: Controllers, Services, Modules).
*   **Banco de Dados:** PostgreSQL.
*   **ORM:** Prisma (Type-safe database queries e Migrations automatizadas).
*   **Segurança:** Passport.js + JWT Strategy.
*   **Validação:** Class-validator e DTOs (Data Transfer Objects) para garantir integridade dos dados.

---

## 🛠️ Pré-requisitos

*   **Node.js** (v18 ou superior)
*   **npm** ou **yarn**
*   **PostgreSQL** rodando localmente (porta 5432) ou via Docker.

---

## 📦 Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <repository-url>
    cd dynamox-challenge
    ```

2.  **Instale as dependências (Raiz):**
    ```bash
    npm install
    ```

3.  **Configuração de Ambiente:**
    Crie um arquivo `.env` dentro de `apps/backend` com suas credenciais do banco:
    ```env
    DATABASE_URL="postgresql://usuario:senha@localhost:5432/dynamox_db?schema=public"
    JWT_SECRET="sua-chave-secreta-aqui"
    ```

---

## 🗄️ Configuração do Banco de Dados (Prisma)

**Importante:** Recomenda-se rodar os comandos do Prisma a partir da pasta `apps/backend` para garantir o carregamento correto do `.env`.

1.  **Gerar o Cliente Prisma:**
    Cria a tipagem TypeScript baseada no seu schema.
    ```bash
    cd apps/backend
    npx prisma generate
    ```

2.  **Rodar Migrations:**
    Cria as tabelas no banco de dados.
    ```bash
    # Certifique-se de estar em apps/backend
    npx prisma migrate dev
    ```

    *Volte para a raiz do projeto antes de rodar a aplicação:*
    ```bash
    cd ../..
    ```

---

## ▶️ Rodando a Aplicação

Este projeto utiliza **Nx** para orquestrar o monorepo.

### 1. Iniciar Backend (API)
Roda em `http://localhost:3000`.
```bash
npx nx serve backend
```

### 2. Iniciar Frontend (Web App)
Roda em `http://localhost:4200`.
```bash
npx nx serve frontend
```

### 3. Rodar Ambos (Paralelo)
```bash
npx nx run-many --target=serve --projects=backend,frontend --parallel
```

---

## 🧪 Testes Automatizados

### Frontend (Testes Sunitários)
Rodam com Vitest, testando componentes e páginas isoladamente.
```bash
# Rodar todos os testes de frontend
npm test

# OU via Nx
npx nx test frontend
```

### Backend
```bash
npx nx test backend
```

---

## 📂 Estrutura do Projeto

```
dynamox-challenge/
├── apps/
│   ├── backend/          # Aplicação NestJS
│   │   ├── src/          # Código Fonte (Modules, Controllers, Services)
│   │   └── prisma/       # Schema do Banco & Migrations
│   │
│   └── frontend/         # Aplicação React
│       ├── src/
│       │   ├── components/ # Componentes UI Reutilizáveis
│       │   ├── pages/      # Páginas e Rotas
│       │   ├── store/      # Estado Global (Redux) & API
│       │   └── ...
│       └── ...
├── libs/                 # Bibliotecas Compartilhadas (se houver)
└── package.json          # Dependências Raiz & Scripts
```