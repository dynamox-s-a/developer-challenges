# Events Management Platform

Uma plataforma para gerenciamento de eventos

🌐 **Demo:** [renato-marinho-challenge-2.vercel.app](https://renato-marinho-challenge-2.vercel.app)

## 🚀 Tecnologias

- **Frontend:**

  - Next.js 15
  - TypeScript
  - Redux Toolkit
  - Material UI
  - Tailwind CSS
  - React Hook Form
  - Zod

- **Testes:**

  - Cypress (E2E)
  - Jest (unitários)

- **Documentação:**

  - Storybook

- **Qualidade de Código:**
  - Biome (formatador de código)
  - Husky (hooks git)

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone git@github.com:renatomarinhofr/renato-marinho.git
cd challenge-2
```

2. Instale as dependências:

```bash
npm install
```

## 💻 Desenvolvimento

1. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

2. Inicie o servidor JSON (mock da API):

```bash
npm run server
```

3. Acesse [http://localhost:3000](http://localhost:3000)

## 🧪 Testes

### Testes E2E (Cypress)

```bash
# Interface gráfica
npm run cypress

# Modo headless
npm run cypress:run
```

### Verificação de Tipos

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## 📚 Storybook

Para visualizar a documentação dos componentes:

```bash
npm run storybook
```

Acesse [http://localhost:6006](http://localhost:6006)

## 🔑 Autenticação

### Admin

- Email: admin@events.com
- Senha: admin123
- Acesso: Gerenciamento completo de eventos (ver, criar, editar, excluir)

### Reader

- Email: reader@events.com
- Senha: reader123
- Acesso: Visualização de eventos

## 🌟 Funcionalidades

- ✨ Autenticação com diferentes níveis de acesso
- 📅 Gerenciamento completo de eventos (CRUD)
- 🔍 Filtros avançados por título, período e ordenação
- 📱 Design responsivo
- 🎨 Tema customizável
- 🔒 Rotas protegidas
- 📊 Feedback visual de carregamento e erros
