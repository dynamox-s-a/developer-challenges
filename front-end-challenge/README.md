# Event Management System

Um sistema de gerenciamento de eventos desenvolvido com Next.js 15, Material-UI v7 e autenticação baseada em roles. O projeto inclui funcionalidades completas de CRUD para eventos, sistema de filtros e uma arquitetura com testes.

## **Principais Tecnologias**

### **Frontend**

- **Next.js 15** - Framework React com App Router e Turbopack
- **TypeScript** - Tipagem estática para maior segurança
- **Material-UI v7** - Biblioteca de componentes com Emotion styling

### **Backend (Desenvolvimento)**

- **JSON Server** - API REST simulada para desenvolvimento
- **Custom JWT Authentication** - Sistema de autenticação fake

### **Testing & Documentation**

- **Jest** - Framework de testes unitários e integração
- **Testing Library** - Utilities para testes de componentes React
- **Storybook v9** - Documentação interativa de componentes
- **ESLint v9** - Linting com flat config format

### **Build & Deploy**

- **Turbopack** - Build system ultra-rápido do Next.js
- **Vercel** - Deploy e hospedagem otimizada

## **Estrutura de Diretórios**

```
front-end-challenge/
├── app/
│   ├── layout.tsx                  # Layout principal com providers
│   ├── page.tsx                    # Página de login
│   ├── admin/                      # Rotas administrativas
│   │   ├── page.tsx                # Dashboard admin
│   │   └── events/                 # CRUD de eventos
│   │       ├── add/page.tsx        # Criar evento
│   │       └── edit/[id]/page.tsx  # Editar evento
│   └── dashboard/
│       └── page.tsx                # Lista de eventos
│
├── components/                 # Componentes reutilizáveis
│   ├── forms/                  # Componentes de formulário
│   │   ├── LoginForm.tsx       # Formulário de login
│   │   └── FormEvent.tsx       # Formulário de eventos
│   └── ui/                     # Componentes de interface
│       └── Loading.tsx         # Indicador de carregamento
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts              # Hook de autenticação
│   ├── useLocalStorage.ts      # Persistência local
│   └── index.ts                # Export centralizado
│
├── lib/                        # Utilitários e configurações
│   ├── api/
│   │   └── apiClients.ts       # Cliente API principal
│   └── auth/
│       └── jwt-fake.ts         # Sistema de JWT simulado
│
├── providers/                  # React Providers
│   ├── ThemeProvider.tsx       # Provider do Material-UI
│   └── index.tsx               # Provider centralizado
│
├── stories/                      # Storybook stories
│   └── [component]*.stories.tsx  # Stories dos componentes
│
├── styles/                     # Configurações de tema
│   └── theme.ts                # Tema customizado Material-UI
│
├── types/                      # Definições TypeScript
│   ├── auth.ts                 # Tipos de autenticação
│   ├── events.ts               # Tipos de eventos
│   ├── forms.ts                # Tipos de formulários
│   ├── ui.ts                   # Tipos de UI
│   └── index.ts                # Export centralizado
│
├── __tests__/                  # Testes unitários
│   ├── components/             # Testes de componentes
│   ├── hooks/                  # Testes de hooks
│   ├── lib/                    # Testes de utilitários
│   └── utils/                  # Testes de validação
│
├── utils/                      # Funções utilitárias
│   └── validation.ts           # Validações de formulário
│
├── db.json                     # Database simulado (JSON Server)
├── jest.config.js              # Configuração Jest
├── jest.setup.js               # Setup global Jest
├── .storybook/                 # Configuração Storybook
└── next.config.ts              # Configuração Next.js
```

## **Comandos Principais**

### **Desenvolvimento**

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (com Turbopack)
npm run dev

# Iniciar JSON Server (API simulada) - OBRIGATÓRIO
npm run json-server

# Desenvolvimento completo (2 terminais)
npm run json-server  # Terminal 1: API backend
npm run dev          # Terminal 2: Frontend
```

### **Build e Produção**

```bash
# Build otimizado com Turbopack
npm run build

# Iniciar servidor de produção
npm run start

# Build + Start (pipeline completa)
npm run build && npm run start
```

### **Testes**

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage completo com relatório
npm run test:coverage

# Verificar cobertura atual
npm test -- --coverage
```

### **Storybook**

```bash
# Iniciar Storybook (desenvolvimento)
npm run storybook

# Build do Storybook (produção)
npm run build-storybook

# Storybook disponível em: http://localhost:6006
```

### **Linting e Qualidade**

```bash
# Executar ESLint
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit

# Formatação de código (se configurado)
npm run format
```

### **Deploy**

```bash
# Deploy no Vercel (após instalar CLI)
npm install -g vercel
vercel --prod

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_API_URL
```

## **Sistema de Autenticação**

### **Usuários de Demonstração**

```javascript
// Administrador - Acesso completo
Email: admin@events.com
Senha: admin123
Permissões: CRUD completo de eventos

// Leitor - Apenas visualização
Email: reader@events.com
Senha: reader123
Permissões: Visualização de eventos
```

### **Roles e Permissões**

- **Admin**: Criar, editar, excluir eventos
- **Reader**: Visualizar eventos (com avisos em rotas admin)

## **Testing Strategy**

### **Coverage Atual**

- **100% coverage** em hooks, utilitários e biblioteca
- **Componentes**: Testados via Storybook (estratégia híbrida)
- **188 testes** passando com cobertura completa da lógica de negócio

### **Tipos de Teste**

- **Unit Tests**: Hooks, validações, utilitários
- **Integration Tests**: Autenticação, API client
- **Component Stories**: Documentação interativa via Storybook

## **Cobertura de Testes**

```bash
# Relatório de cobertura atual
File      | % Stmts | % Branch | % Funcs | % Lines
----------|---------|----------|---------|--------
All files |   100   |   100    |   100   |   100
hooks/    |   100   |   100    |   100   |   100
lib/      |   100   |   100    |   100   |   100
utils/    |   100   |   100    |   100   |   100
```

## **Storybook Components**

### **Categorias de Stories**

- **Actions**: Botões e controles interativos
- **Feedback**: Alertas, loading e notificações
- **Forms**: Componentes de formulário
- **Inputs**: Campos de entrada
- **Layout**: Componentes estruturais
- **UI**: Elementos de interface geral

### **Recursos Storybook**

- **Interactive Controls**: Teste propriedades em tempo real
- **Responsive Design**: Visualização em diferentes viewports
- **Documentation**: Documentação automática dos componentes

## **Deploy e Produção**

### **Variáveis de Ambiente Necessárias**

```bash
# Desenvolvimento (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Produção (Vercel Environment Variables)
NEXT_PUBLIC_API_URL=https://sua-api-producao.com
```

### **Considerações de Deploy**

- **JSON Server**: Apenas para desenvolvimento
- **API de Produção**: Implementar backend real para produção
- **Build Turbopack**: Builds mais rápidos e otimizados
- **Edge Functions**: Compatível com Vercel Edge Runtime

## **Desenvolvimento Local**

### **Pré-requisitos**

- Node.js 18+
- npm 8+
- Git

### **Setup Inicial**

```bash
# Clonar repositório
git clone <repository-url>
cd front-end-challenge

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.local

# Iniciar desenvolvimento
npm run json-server  # Terminal 1
npm run dev          # Terminal 2
```

### **URLs de Desenvolvimento**

- **Frontend**: http://localhost:3000
- **API (JSON Server)**: http://localhost:3001
- **Storybook**: http://localhost:6006

## **Recursos e Documentação**

### **Documentação Técnica**

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Material-UI v7 Guide](https://mui.com/getting-started/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Storybook for Next.js](https://storybook.js.org/docs/nextjs/get-started)

### **Arquitetura**

- **Design System**: Material-UI com tema customizado
- **State Management**: Redux Toolkit para estado complexo
- **API Layer**: Cliente fetch com interceptors automáticos
- **Type Safety**: TypeScript strict mode habilitado

---

## **Cloud Deploy**

Aplicação publicada nos seguintes links:

- Front-end: https://event-management-system-lake.vercel.app/
- Back-end: https://event-management-api-mkzz.onrender.com/

Ambos os links estão na versão gratuita de cada servidor então no caso do render(back-end), a aplicação fica em estado de hibernação caso não haja interação dentro de 15 min e demora cerca de 1 min na primeira interação feita onde esta saindo do estado de hibernação.

## **Considerações Finais**

Qualquer duvida sobre as entregas, fiquem livres para entrar em contato.
