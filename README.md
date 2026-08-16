<h1 align="center">Dynamox Front-End Challenge</h1>

<p align="center">
  Dashboard responsivo para visualização de medições de uma máquina industrial.
</p>

<p align="center">
  <a href="#live">Live</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#interface">Interface</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#execucao-local">Execução local</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#testes">Testes</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#deploy">Deploy</a>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white">
  <img alt="Material UI" src="https://img.shields.io/badge/Material_UI-5-007FFF?logo=mui&logoColor=white">
</p>

<p align="center">
  <img
    alt="Dashboard da Dynamox em um dispositivo móvel"
    width="32%"
    src="./public/mockup-mobile-preview.png"
  >
  <img
    alt="Dashboard da Dynamox em um notebook"
    width="65%"
    src="./public/mockup-desktop-preview.png"
  >
</p>

<h2 id="live">👁️ Live</h2>

- [Aplicação](https://dynamox.leonardojacomussi.com/data)
- [API mock](https://dynamox.leonardojacomussi.com/api/measurements)
- [Storybook](https://dynamox-storybook.leonardojacomussi.com)

<h2 id="tecnologias">🚀 Tecnologias</h2>

- React 19, TypeScript 6 e Vite 8
- Material UI 5 e Roboto
- Redux Toolkit, Redux Saga e Axios
- Highcharts
- Vitest, Testing Library, axe-core e Cypress
- Storybook
- Biome
- GitHub Actions e Vercel

<h2 id="interface">🔖 Interface</h2>

A página apresenta os dados da máquina e três gráficos de séries temporais: aceleração RMS,
temperatura e velocidade RMS. Os gráficos compartilham crosshair e tooltip, facilitando a
comparação das medições no mesmo instante.

O layout foi desenvolvido a partir do protótipo fornecido pela Dynamox, com adaptação responsiva
para dispositivos móveis, tablets e desktops. A implementação também contempla estados de
carregamento, erro e ausência de dados, além de navegação por teclado e marcação semântica.

<h2 id="execucao-local">⚙️ Execução local</h2>

Requisitos:

- Node.js 24
- pnpm 9.15.4

Clone o repositório e acesse a branch da solução:

```bash
git clone git@github.com:leonardojacomussi/dynamox-front-end-challenge.git
cd dynamox-front-end-challenge
git checkout leonardo-jacomussi
```

Configure o ambiente e instale as dependências:

```bash
cp .env.example .env
corepack enable
pnpm install --frozen-lockfile
```

Inicie o Vite e o `json-server`:

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173/data` e a API local em
`http://localhost:3001/measurements`.

<h2 id="testes">🃏 Testes e qualidade</h2>

```bash
# Formatação, lint e tipos
pnpm format:check
pnpm lint
pnpm exec tsc -b

# Testes unitários
pnpm test

# Testes end-to-end
pnpm e2e:ci

# Storybook
pnpm storybook
pnpm build-storybook

# Build de produção
pnpm build
```

O projeto combina testes unitários de componentes, reducers, sagas, mapeadores e sincronização
dos gráficos com cenários end-to-end para carregamento, erro e retry, responsividade e tooltips
sincronizados.

<h2 id="deploy">☁️ Arquitetura de deploy</h2>

A aplicação e a API são publicadas juntas no projeto Vercel
`dynamox-front-end-challenge`. Em produção, `VITE_API_BASE_URL=/api` é fornecida pelo GitHub
Environment e pela Vercel, mantendo as chamadas na mesma origem sem versionar a configuração. A
Function `GET /api/measurements` entrega o mesmo dataset usado pelo `json-server` local e
substitui somente o runtime do servidor mock; o contrato da resposta permanece o mesmo.

O Storybook utiliza o projeto Vercel `dynamox-front-end-challenge-storybook`. Nenhum dos projetos
possui integração Git direta com a Vercel: o workflow de CD é chamado pelo CI somente após os jobs
`quality` e `e2e` passarem. Depois das publicações, smoke tests validam os três endpoints e o
Cypress verifica a aplicação usando a API real de produção.
