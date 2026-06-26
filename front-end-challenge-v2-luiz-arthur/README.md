# Dynamox Front-end Challenge

Dashboard para análise de dados de sensores, desenvolvido como parte do processo seletivo da Dynamox.

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Redux Toolkit** + **Redux Saga** - Gerenciamento de estado e efeitos colaterais
- **Material UI 5** - Interface e componentes
- **Highcharts** - Visualização de dados
- **JSON Server** - API mock para desenvolvimento
- **Vitest** - Testes unitários
- **Storybook** - Documentação de componentes
- **Cypress** - Testes E2E

## 📋 Funcionalidades

- Rota `/data` com dashboard de análise
- Header com informações da máquina (Máquina 1023, Ponto 20192, RPM 200, 16g, 20 min)
- 3 gráficos de séries temporais:
  - Aceleração RMS (3 eixos: Horizontal, Radial, Axial)
  - Velocidade RMS (3 eixos: Horizontal, Radial, Axial)
  - Temperatura (1 série)
- Crosshair vertical sincronizado entre todos os gráficos
- Modo claro/escuro com persistência no localStorage
- Layout responsivo
- Testes unitários (Redux, Saga, API)
- Storybook para documentação de componentes
- Testes E2E com Cypress

## 🛠️ Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/js-ts-full-stack-test.git
cd js-ts-full-stack-test

# Instale as dependências
npm install
Rodando o projeto
O projeto requer dois servidores rodando simultaneamente:

Terminal 1 - JSON Server (API mock):

bash
npm run server
O servidor estará disponível em http://localhost:3000

Terminal 2 - Aplicação React:

bash
npm run dev
A aplicação estará disponível em http://localhost:5173

Acesse http://localhost:5173/data para visualizar o dashboard.

Rodando os testes
bash
# Testes unitários
npm run test

# Testes E2E (Cypress)
npm run cypress:open    # Modo interativo
npm run cypress:run     # Modo headless
Rodando o Storybook
bash
npm run storybook
Acesse http://localhost:6006 para visualizar a documentação.

📁 Estrutura do Projeto
text
src/
├── components/
│   ├── Header/          # Cabeçalho com informações da máquina
│   └── SensorChart/     # Componente de gráfico com Highcharts
├── pages/
│   └── DashboardPage/   # Página principal com os 3 gráficos
├── store/
│   ├── modules/
│   │   ├── sensorSlice.ts   # Estado global do Redux
│   │   └── sensorSaga.ts    # Efeitos colaterais (API calls)
│   ├── rootSaga.ts          # Combinação de sagas
│   └── index.ts             # Configuração da store
├── services/
│   └── api.ts               # Comunicação com JSON Server
├── types/
│   └── sensor.types.ts      # Tipos TypeScript
├── context/
│   └── ThemeContext.tsx     # Tema claro/escuro
├── stories/                 # Documentação Storybook
├── test/                    # Configuração de testes
└── ...
🎯 Decisões técnicas
Redux + Saga
Escolhidos para gerenciar o estado global e efeitos colaterais, conforme exigido pelo desafio. O Saga lida com a chamada assíncrona à API mock.

Highcharts
Escolhido pela facilidade de implementação de crosshair sincronizado entre múltiplos gráficos e suporte a séries temporais.

Material UI 5
Proporciona uma interface consistente e responsiva com componentes prontos para uso, além de suporte nativo a temas claro/escuro.

JSON Server
Permite mockar a API REST de forma rápida e eficiente durante o desenvolvimento.

📊 Funcionalidades em detalhe
Crosshair Sincronizado
Ao passar o mouse sobre um ponto em qualquer gráfico, uma linha vertical aparece em todos os gráficos no mesmo timestamp, com tooltips mostrando os valores de cada série.

Modo Claro/Escuro
O tema é persistido no localStorage e detecta automaticamente a preferência do sistema operacional.

Gráficos com múltiplos eixos
Aceleração RMS: 3 linhas (Horizontal, Radial, Axial)

Velocidade RMS: 3 linhas (Horizontal, Radial, Axial)

Temperatura: 1 linha

🧪 Testes
Unitários: Redux reducers, sagas e API service (8 testes passando)

E2E: Cypress testando header, cards, containers e dark mode

📚 Documentação
O Storybook está configurado com autodocs para documentar automaticamente os componentes. Stories disponíveis:

SensorChart (com variantes: Aceleração, Velocidade, Temperatura)

Header

DashboardPage

📄 Licença
Este projeto foi desenvolvido como parte do processo seletivo da Dynamox.

text

---

## 📝 Commit do README

```bash
git add README.md
git commit -m "docs: add comprehensive README with project overview and sesetup instructions"

##Você pode achar o deploy deste app com os dados fixos (sem execução de servidor JSON) no link abaixo

https://front-end-challenge-v2-luiz-arthur-y8cni4d6f.vercel.app

##📦 Dados mockados: arquivo estático vs JSON Server
Para este desafio, optei por utilizar um arquivo JSON estático na pasta public/ em vez de manter o JSON Server em produção. Essa decisão foi tomada por dois motivos principais:

Simplicidade no deploy: O JSON Server é uma ferramenta excelente para desenvolvimento local, mas não é prático (nem recomendado) para produção. Em ambientes como Vercel, Netlify ou outros provedores de hospedagem estática, não há um servidor Node.js contínuo para manter o JSON Server rodando. Usar um arquivo estático elimina essa dependência.

Foco no front-end: O desafio é sobre desenvolvimento front-end, não sobre infraestrutura de back-end. Optar por um arquivo estático mantém o foco no que é avaliado: a qualidade do código React, a integração com Redux/Saga, a UI/UX e a documentação.

Durante o desenvolvimento local, o JSON Server ainda pode ser usado (via npm run server) para simular uma API REST com endpoints reais. Mas, para a versão final (deploy), substituí a chamada à API por um fetch direto ao arquivo JSON estático, garantindo que o aplicativo funcione em qualquer ambiente sem necessidade de configuração adicional.

Essa abordagem é comum em desafios técnicos e projetos de demonstração, pois mantém o código enxuto e o deploy simples, sem prejudicar a experiência do usuário.

🔧 Como adaptar para um back-end real
Se no futuro este projeto evoluísse para um ambiente de produção com uma API real, bastaria substituir a URL do fetch no arquivo src/services/api.ts pela URL da API real e ajustar os tipos de dados conforme necessário. O restante da arquitetura (Redux, Saga, componentes) já está preparado para consumir dados de qualquer fonte.