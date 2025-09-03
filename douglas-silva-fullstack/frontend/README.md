# DynaPredict - Frontend

Aplicativo web para gerenciamento de máquinas industriais, construído com React, TypeScript e Vite.

## 🚀 Tecnologias

-   [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
-   [TypeScript](https://www.typescriptlang.org/) - Superset tipado do JavaScript
-   [Vite](https://vitejs.dev/) - Ferramenta de build e servidor de desenvolvimento
-   [Material-UI](https://mui.com/) - Biblioteca de componentes UI
-   [React Router](https://reactrouter.com/) - Roteamento na aplicação
-   [Axios](https://axios-http.com/) - Cliente HTTP para chamadas à API
-   [ESLint](https://eslint.org/) - Linter para manter a qualidade do código

## 🚀 Como executar

### Pré-requisitos

-   Node.js (versão 18 ou superior)
-   npm ou yarn
-   Backend da aplicação em execução

### Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/douglas-silva-fullstack.git
    cd douglas-silva-fullstack/frontend
    ```

2. Instale as dependências:

    ```bash
    npm install
    # ou
    yarn install
    ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto frontend com as seguintes variáveis:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

### Executando a aplicação

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📦 Scripts disponíveis

-   `dev` - Inicia o servidor de desenvolvimento
-   `build` - Gera a versão de produção
-   `preview` - Previsualiza a build de produção localmente
-   `lint` - Executa o linter no código
-   `type-check` - Verifica os tipos TypeScript

## 🛠️ Estrutura do projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── services/      # Serviços de API e lógica de negócios
├── types/         # Tipos TypeScript
└── App.tsx        # Componente raiz
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

