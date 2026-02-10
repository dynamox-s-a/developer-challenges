# Sistema de Gestão de Eventos 🎟️

Sistema completo de gerenciamento de eventos com controle de acesso baseado em funções (RBAC), desenvolvido com Next.js, TypeScript e Material UI.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Material UI](https://img.shields.io/badge/Material_UI-6-blue)](https://mui.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-purple)](https://redux-toolkit.js.org/)

---

## 🚀 Demo

- **Frontend:** [FRONT](https://test-dynamox-front.vercel.app/)
- **API (json-server):** [API](https://api-mock-test-dynamox-2.onrender.com/)

---

## 📋 Sobre o Projeto

Sistema web que permite:
- **Administradores:** Criar, editar, visualizar e deletar eventos
- **Leitores:** Visualizar, filtrar, buscar e ordenar eventos

### 👥 Usuários Pré-configurados

| Tipo | Email | Senha | Permissões |
|------|-------|-------|------------|
| **Admin** | admin@events.com | admin123 | CRUD completo de eventos |
| **Reader** | reader@events.com | reader123 | Visualização e filtros |

---

## 🛠️ Tecnologias Utilizadas

### Core
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **React 19** - Biblioteca UI

### Estado & Dados
- **Redux Toolkit** - Gerenciamento de estado global
- **json-server** - API REST simulada
- **Axios** - Cliente HTTP

### UI & Estilo
- **Material UI 6** - Biblioteca de componentes
- **Emotion** - CSS-in-JS
- **Tema customizado** - Cores e componentes personalizados

### Autenticação
- **JWT fake** - Tokens simulados com base64
- **localStorage** - Persistência de sessão
- **HOC ProtectedRoute** - Proteção de rotas por role

### Testes
- **Vitest** - Framework de testes unitários
- **Happy-DOM** - Ambiente DOM para testes
- **31 testes** - Cobertura de lógica de negócio

---

## 📁 Estrutura do Projeto
```
front-end-challenge-2/
├── src/
│   ├── app/                    # Páginas Next.js (App Router)
│   │   ├── admin/             # Área administrativa
│   │   │   ├── components/    # Componentes do admin
│   │   │   ├── layout.tsx     # Layout com proteção
│   │   │   └── page.tsx       # Dashboard admin
│   │   ├── events/            # Área de visualização
│   │   │   ├── components/    # Componentes de eventos
│   │   │   ├── layout.tsx     # Layout com proteção
│   │   │   └── page.tsx       # Lista de eventos
│   │   ├── login/             # Autenticação
│   │   └── not-found.tsx      # Página 404
│   ├── components/            # Componentes globais
│   │   └── ProtectedRoute.tsx # HOC de proteção
│   ├── constants/             # Constantes da aplicação
│   ├── providers/             # Providers React
│   ├── services/              # Camada de API
│   ├── store/                 # Redux Store
│   │   ├── slices/            # Redux slices
│   │   ├── hooks.ts           # Hooks tipados
│   │   └── index.ts           # Configuração store
│   ├── theme/                 # Tema Material UI
│   ├── types/                 # Tipos TypeScript
│   └── utils/                 # Funções utilitárias
├── db.json                    # Banco de dados json-server
├── vitest.config.ts           # Configuração Vitest
└── package.json
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/Mp455/developer-challenges.git
cd developer-challenges/front-end-challenge-2
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Para produção, aponte para sua API hospedada:
```env
NEXT_PUBLIC_API_URL=https://sua-api.railway.app
```

### 4. Execute o projeto

**Desenvolvimento (Local):**
```bash
# Roda Next.js + json-server simultaneamente
npm run dev:all
```

**OU execute separadamente:**
```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: json-server
npm run server

## 🧪 Testes

### Testes Unitários (Vitest)
```bash
# Modo watch (desenvolvimento)
npm test

# Rodar uma vez
npm run test:run

# Com cobertura
npm run test:coverage
```

**Cobertura:**
- ✅ **31 testes automatizados**
- ✅ Funções de autenticação (12 testes)
- ✅ Redux slices (19 testes)
- ✅ Lógica de negócio validada

**Arquivos testados:**
- `src/utils/auth.test.ts` - Geração de tokens, localStorage
- `src/store/slices/authSlice.test.ts` - Estado de autenticação
- `src/store/slices/eventsSlice.test.ts` - Estado de eventos

---

## ✨ Funcionalidades

### 🔐 Autenticação
- [x] Login com email e senha
- [x] Geração de tokens JWT fake
- [x] Persistência no localStorage
- [x] Logout
- [x] Redirecionamento baseado em role
- [x] Proteção de rotas com HOC

### 👨‍💼 Admin (Administrador)
- [x] Criar eventos com validações:
  - Nome obrigatório
  - Data futura obrigatória
  - Local obrigatório
  - Descrição mínima de 50 caracteres
  - Categoria obrigatória
- [x] Editar eventos existentes
- [x] Excluir eventos (com confirmação)
- [x] Visualizar todos os eventos em tabela
- [x] Interface responsiva

### 📖 Reader (Leitor)
- [x] Visualizar eventos
- [x] Separação eventos futuros/passados
- [x] Busca por nome/descrição/local
- [x] Filtro por categoria
- [x] Ordenação por:
  - Data (crescente/decrescente)
  - Nome (A-Z / Z-A)
- [x] Layout em cards responsivo

### 🎨 UI/UX
- [x] Design responsivo (mobile/tablet/desktop)
- [x] Tema Material UI customizado
- [x] Feedback visual (loading, erros)
- [x] Página 404 personalizada
- [x] Validações em tempo real

---

## 🏗️ Arquitetura

### Gerenciamento de Estado (Redux)
```typescript
store/
├── slices/
│   ├── authSlice.ts      # Estado de autenticação
│   └── eventsSlice.ts    # Estado de eventos
├── hooks.ts              # useAppDispatch, useAppSelector
└── index.ts              # Configuração da store
```

### Proteção de Rotas

Implementado via **Higher-Order Component (HOC)**:
```typescript
<ProtectedRoute allowedRoles={['admin']}>
  <AdminContent />
</ProtectedRoute>
```

**Funcionalidades:**
- Verifica autenticação no `localStorage`
- Valida role do usuário
- Redireciona automaticamente se não autorizado

### Validação de Formulários

Centralizada em `src/utils/validation.ts`:
- Reutilizável
- Testável
- Separação de responsabilidades

---

## 🔧 Decisões Técnicas

### Deploy da API (json-server)

**Problema:** json-server requer servidor Node.js persistente, incompatível com plataformas serverless gratuitas (Vercel/Netlify).

**Solução:** Deploy separado da API em plataforma com suporte a Node.js (Railway/Render).

**Arquitetura:**
```
┌─────────────┐         ┌──────────────┐
│   Vercel    │ ──────> │   Railway    │
│  (Next.js)  │  Axios  │ (json-server)│
└─────────────┘         └──────────────┘
     Frontend                  API
```

### Autenticação Simplificada

**Escolha:** JWT fake (base64) ao invés de biblioteca `jsonwebtoken`

**Justificativa:**
- ✅ Atende requisito "JWT falso"
- ✅ Sem dependências extras
- ✅ Adequado para ambiente de desenvolvimento
- ⚠️ **Não usar em produção real**

### Testes Focados em Lógica

**Estratégia:** Priorizar testes unitários de lógica de negócio

**Cobertura:**
- ✅ Funções puras (auth, validação)
- ✅ Redux (estado da aplicação)
- ❌ Componentes React (requer setup adicional)

**Justificativa:**
- 31 testes cobrem funcionalidades críticas
- ROI maior em testes de lógica vs UI
- Adequado para escopo do desafio

---

## 📦 Scripts Disponíveis
```bash
npm run dev          # Inicia Next.js (dev)
npm run server       # Inicia json-server
npm run dev:all      # Inicia ambos simultaneamente
npm run build        # Build de produção
npm run start        # Inicia produção
npm test             # Testes (watch mode)
npm run test:run     # Testes (single run)
npm run test:coverage # Testes com cobertura
npm run lint         # ESLint
```

---

## 🎯 Requisitos Atendidos

### ✅ Obrigatórios
- [x] TypeScript
- [x] React 19
- [x] Next.js 15 (App Router)
- [x] Redux Toolkit
- [x] json-server
- [x] Material UI 6 com tema customizado
- [x] Design responsivo
- [x] Testes unitários automatizados (31 testes)

### ⭐ Bônus
- [x] Proteção de rotas com HOC
- [x] Deploy em provedor de nuvem (Vercel + Render)

---

## 📚 Aprendizados

Durante o desenvolvimento deste projeto, foram consolidados conhecimentos em:

- ✅ Next.js 15 App Router e Server Components
- ✅ Redux Toolkit com TypeScript
- ✅ Material UI 6 customização avançada
- ✅ Testes unitários com Vitest
- ✅ Proteção de rotas e controle de acesso
- ✅ Deploy de aplicações full-stack separadas
- ✅ Clean Architecture e separação de responsabilidades

---

## 👨‍💻 Autor

**Marcos Paulo**
- GitHub: [@Mp455](https://github.com/Mp455)

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste técnico para a Dynamox.

---
