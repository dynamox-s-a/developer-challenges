# Sarah Santana - Front-End Challenge V2

![Status do Projeto](https://img.shields.io/badge/status-concluído-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.1.1-purple?logo=vite)

Aplicação front-end desenvolvida com arquitetura escalável, utilizando React, TypeScript, Redux Toolkit, Redux Saga e Material-UI.

## 🚀 Tecnologias e Ferramentas

- **Core:** React, TypeScript, Vite
- **Estado & Side Effects:** Redux Toolkit, Redux Saga
- **Roteamento:** React Router DOM
- **Estilização:** Material-UI (MUI)
- **Visualização de Dados:** Highcharts
- **Comunicação HTTP:** Axios
- **Testes Automatizados:** Vitest, React Testing Library
- **Documentação de Componentes:** Storybook
- **Qualidade de Código:** ESLint

---

## 📂 Estrutura do Projeto

```text
├── public/                 # Assets públicos (ícones, favicon)
├── src/
│   ├── app/                # Configuração do Redux Store, Hooks e RootSaga
│   ├── assets/             # Recursos estáticos (ícones, imagens)
│   ├── components/         # Componentes reutilizáveis de UI
│   ├── features/           # Módulos de funcionalidades
│   ├── mocks/              # Dados mockados para testes e desenvolvimento
│   ├── pages/              # Páginas da aplicação
│   ├── routes/             # Configuração de rotas (React Router)
│   ├── services/           # Camada de serviços e API
│   ├── theme/              # Configuração do tema do Material-UI
│   ├── utils/              # Funções utilitárias
│   ├── App.tsx             # Componente raiz
│   └── main.tsx            # Ponto de entrada
├── db.json                 # Base de dados local para o JSON Server
└── package.json
```

## ⚙️ Como Executar o Projeto Localmente

Certifique-se de ter o Node.js instalado em sua máquina.

Clone o repositório e acesse a pasta do projeto:

```bash
git clone (https://github.com/SarahSantana/developer-challenges)
frontend-v2-sarah
```

1. **Instale as dependências:**

```bash
npm install
```

2. **Inicie o servidor de dados locais (JSON Server):**

```bash
npm run server
```

Isso iniciará o json-server na porta 3001 utilizando o arquivo db.json.

3. **Em outro terminal, inicie a aplicação em modo de desenvolvimento:**

```bash
npm run dev
```

A aplicação estará rodando em http://localhost:5173 (ou na porta indicada pelo terminal).

## 🧪 Testes Automatizados

Para rodar os testes unitários e de integração utilizando o Vitest:

```bash
npm run test
```

Para verificar a cobertura de testes:

```bash
npm run test:coverage
```

## 📝 Storybook

Inicia o Storybook para documentação de componentes:

```bash
npm run storybook
```
