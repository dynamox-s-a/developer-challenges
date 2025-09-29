# 🚀 Dynamox Dashboard

Um dashboard interativo e responsivo para visualização de dados de sensores, desenvolvido com React, TypeScript, Redux e Highcharts.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Deploy](#-deploy)
- [Testes](#-testes)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)

## 🎯 Visão Geral

O Dynamox Dashboard é uma aplicação web moderna que permite visualizar dados de sensores em tempo real através de gráficos interativos e sincronizados. O projeto foi desenvolvido como um desafio técnico e demonstra boas práticas de desenvolvimento frontend.

### 🎨 Características Principais

- **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile
- **Gráficos Sincronizados**: Interação crosshair entre múltiplos gráficos
- **Navegação Suave**: Scroll automático para seções específicas
- **Dados Dinâmicos**: Suporte a múltiplas fontes de dados
- **Testes Abrangentes**: Cobertura com testes unitários e E2E

## 🛠 Tecnologias

### Frontend
- **React 19** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Material-UI (MUI)** - Componentes de interface
- **Styled-Components** - CSS-in-JS

### Estado e Dados
- **Redux Toolkit** - Gerenciamento de estado
- **Redux-Saga** - Side effects middleware
- **Axios** - Cliente HTTP (para json-server)

### Visualização
- **Highcharts** - Biblioteca de gráficos
- **highcharts-react-official** - Integração React

### Testes
- **Vitest** - Testes unitários
- **Cypress** - Testes E2E
- **Testing Library** - Utilitários de teste

## ✨ Funcionalidades

### 📊 Dashboard Principal
- Visualização de dados de sensores em gráficos de linha
- Separação por tipo: Aceleração, Velocidade e Temperatura
- Gráficos responsivos com alturas adaptáveis
- Legenda interativa

### 🔄 Sincronização de Gráficos
- Crosshair sincronizado entre todos os gráficos
- Tooltip compartilhado com informações de múltiplos sensores
- Hover em um gráfico atualiza todos os outros

### 📱 Responsividade
- Layout adaptativo para diferentes tamanhos de tela
- Menu mobile com drawer lateral
- Navegação otimizada para touch

### 🎯 Navegação
- Header fixo com navegação suave
- Scroll automático para seções específicas
- Ícones Material Design para melhor UX

### 📈 Fontes de Dados
- **Modo Estático**: JSON estático (ideal para produção/Vercel)
- **Modo JSON-Server**: API simulada (ideal para desenvolvimento)
- **Fallback Automático**: Sistema detecta e usa fonte disponível

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd dynamox-dashboard
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 💻 Uso

### 🏃‍♂️ Desenvolvimento Rápido (JSON Estático)
```bash
npm run dev
```
- Usa dados estáticos do arquivo JSON
- Ideal para desenvolvimento de UI/UX
- Mais rápido e simples

### 🔧 Desenvolvimento com API (JSON-Server)
```bash
# Terminal 1: Iniciar json-server
npm run json-server

# Terminal 2: Iniciar app com json-server
npm run dev:json-server
```
- Simula uma API real
- Ideal para testes de integração
- Permite modificações em tempo real

### 📦 Build para Produção
```bash
npm run build
```

### 👀 Preview da Build
```bash
npm run preview
```

## 🌐 Deploy

### Vercel (Recomendado)

O projeto está otimizado para deploy no Vercel:

#### 1. Deploy Automático via GitHub
1. Faça push do código para GitHub
2. Conecte o repositório no [Vercel Dashboard](https://vercel.com/dashboard)
3. O deploy acontece automaticamente

#### 2. Deploy Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### 3. Configuração Vercel
O projeto inclui `vercel.json` com:
- Build otimizado para produção
- Headers de cache para JSON estático
- Configuração de framework Vite

### Outras Plataformas

O projeto também pode ser deployado em:
- **Netlify**: `npm run build` → deploy pasta `dist`
- **GitHub Pages**: Configurar Actions para build automático
- **Heroku**: Adicionar `"start": "vite preview"` no package.json

## 🧪 Testes

### Testes Unitários (Vitest)

```bash
# Executar todos os testes
npm run test

# Modo watch (re-executa ao salvar)
npm run test

# Interface gráfica
npm run test:ui

# Cobertura de código
npm run test:coverage
```

**Cobertura de Testes:**
- ✅ Hooks customizados (`useWindowSize`, `useSmoothScroll`, `useChartSync`)
- ✅ Redux slice (`sensorSlice`)
- ✅ Funções utilitárias (`sensorUtils`)

### Testes E2E (Cypress)

```bash
# Abrir interface do Cypress
npm run cypress:open

# Executar em modo headless
npm run cypress:run

# Executar todos os testes
npm run test:all
```

**Cenários Testados:**
- ✅ Carregamento da aplicação
- ✅ Navegação responsiva
- ✅ Funcionamento dos gráficos
- ✅ Integração com json-server
- ✅ Fallback para dados estáticos

### Estrutura dos Testes

```
src/
├── test/
│   └── setup.ts              # Configuração global dos testes
├── hooks/__tests__/          # Testes de hooks
├── store/__tests__/          # Testes do Redux
├── utils/__tests__/          # Testes de utilitários
cypress/
├── e2e/                      # Testes E2E
├── fixtures/                 # Dados mockados
└── support/                  # Comandos customizados
```

## 📁 Estrutura do Projeto

```
dynamox-dashboard/
├── public/
│   └── response-challenge-v2.json  # Dados estáticos
├── src/
│   ├── components/                 # Componentes React
│   │   ├── Chart.tsx              # Componente de gráfico
│   │   ├── Dashboard.tsx           # Dashboard principal
│   │   ├── Header.tsx              # Cabeçalho com navegação
│   │   └── SynchronizedChart.tsx   # Wrapper para sincronização
│   ├── config/                     # Configurações
│   │   └── dataConfig.ts           # Config de fontes de dados
│   ├── hooks/                      # Hooks customizados
│   │   ├── useChartSync.ts         # Sincronização de gráficos
│   │   ├── useSmoothScroll.ts      # Scroll suave
│   │   └── useWindowSize.ts        # Tamanho da janela
│   ├── services/                   # Serviços
│   │   └── dataService.ts          # Serviço de dados híbrido
│   ├── store/                      # Redux store
│   │   ├── index.ts                # Configuração do store
│   │   ├── sensorSlice.ts          # Slice dos sensores
│   │   └── sagas/                  # Redux-Saga
│   ├── types/                      # Definições TypeScript
│   │   └── sensor.ts               # Tipos dos sensores
│   ├── utils/                      # Funções utilitárias
│   │   └── sensorUtils.ts          # Utilitários dos sensores
│   └── test/                       # Configuração de testes
├── cypress/                        # Testes E2E
├── data/                           # Dados fonte
├── scripts/                        # Scripts de build
├── vercel.json                     # Config Vercel
└── package.json                    # Dependências e scripts
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Para usar json-server localmente (true/false)
VITE_USE_JSON_SERVER=false

# Porta do json-server (se VITE_USE_JSON_SERVER=true)
VITE_JSON_SERVER_PORT=3001
```

### Modos de Operação

#### 1. Modo Estático (Padrão)
- **Uso**: Produção e desenvolvimento sem json-server
- **Fonte**: JSON estático em `/public/response-challenge-v2.json`
- **Comando**: `npm run dev`

#### 2. Modo JSON-Server (Desenvolvimento)
- **Uso**: Desenvolvimento com API dinâmica
- **Fonte**: json-server rodando localmente
- **Comando**: `npm run dev:json-server`

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Modo estático
npm run dev:json-server  # Modo json-server

# Build
npm run build            # Build padrão
npm run build:vercel     # Build otimizado para Vercel

# Servidor de dados
npm run json-server      # Iniciar json-server
npm run sync-data        # Sincronizar dados

# Testes
npm run test             # Testes unitários
npm run cypress:open     # Interface Cypress
npm run cypress:run      # Testes E2E headless
npm run test:all         # Todos os testes
```

## 🔄 Fluxo de Dados

### 1. Carregamento Inicial
1. Aplicação inicia e dispara `fetchDataRequest`
2. Saga intercepta a ação e chama `dataService.fetchSensorData()`
3. Serviço verifica configuração e tenta json-server
4. Se json-server falhar, usa JSON estático como fallback
5. Dados são processados e armazenados no Redux store

### 2. Renderização
1. Dashboard recebe dados do store via `useSelector`
2. Componente filtra dados por tipo de sensor
3. Gráficos são renderizados com dados processados
4. Sincronização é configurada entre todos os gráficos

### 3. Interação
1. Usuário interage com um gráfico (hover)
2. `useChartSync` detecta mudança e atualiza crosshair
3. Todos os outros gráficos são sincronizados
4. Tooltip compartilhado é exibido

## 🎨 Design e UX

### Paleta de Cores
- **Primary**: #1976d2 (Azul Material)
- **Acceleration**: #e74c3c (Vermelho)
- **Velocity**: #3498db (Azul)
- **Temperature**: #f39c12 (Laranja)

### Responsividade
- **Mobile**: < 768px - Menu drawer, gráficos empilhados
- **Tablet**: 768px - 1024px - Layout intermediário
- **Desktop**: > 1024px - Layout completo com navegação horizontal

### Acessibilidade
- Navegação por teclado
- Contraste adequado
- Labels descritivos
- Tooltips informativos

## 🚀 Performance

### Otimizações Implementadas
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: React.memo em componentes pesados
- **Debounce**: Resize events com debounce
- **Cache**: Cache inteligente no serviço de dados
- **Bundle Splitting**: Código dividido por rotas

### Métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido como um desafio técnico. Todos os direitos reservados.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para o desafio técnico Dynamox.

---

**Status do Projeto**: ✅ Completo e Funcional  
**Última Atualização**: Setembro 2025  
**Versão**: 1.0.0