# Developer Challenge: Análise de Dados

local: http://localhost:4000/data
online: https://caroline-freitas.netlify.app

## Descrição do Projeto

<p>Este projeto é um dashboard com gráficos de análise de dados.</p>

## Instruções de Compilação e Execução

**Pré requisitos**

- Node.Js: Certifique-se de ter o Node.Js instalado em sua máquina. Este projeto foi desenvolvido e testado com a versão 20.15.0

**Instalação**

```sh
# Clone o Repositório:
$ git clone <URL_DO_REPOSITÓRIO>
$ git checkout caroline-freitas

# Instale as Dependências:
$ npm install

# Startando projeto frontend:
acesse local: http://localhost:4000/data
acesse online: https://caroline-freitas.netlify.app
ou clique no botão para ser redirecionado

$ npm run dev

# Executando os testes unitários:
$ npm test

# Executando o Backend mock (json-server):
### http://localhost:5000/
$ npm run json-server
```

## Decisões Técnicas e Arquitetuais

### Arquitetura

<p>A organização modular do projeto facilita a manutenção e escalabilidade. Cada funcionalidade ou componente é isolado em seu próprio módulo/diretório, permitindo um desenvolvimento mais organizado e uma melhor gestão de dependências, isso permite que diferentes partes do projeto sejam desenvolvidas e testadas de forma independente.<p/>

**Test**
<p>Os testes são organizados para garantir a funcionalidade de cada módulo e a integridade do sistema como um todo.</p>

**Outros**
<ul>
   <li>README.md: Documentação do projeto.</li>
</ul>

## Frameworks ou bibliotecas

- ReactJs e TypeScript: Usados para criar a interface do usuário interativa e tipada.
- NodeJs: Ambiente de execução JavaScript do lado do servidor.
- Vite: Ferramenta de build rápida e leve para desenvolvimento frontend.
- Material-UI (MUI): Biblioteca de componentes React para um design consistente e acessível.
- Axios: Cliente HTTP baseado em Promises para fazer requisições.
- Highcharts: Biblioteca para criação de gráficos interativos.
- Highcharts-React-Official: Envolvimento oficial de Highcharts para uso com React.
- JSON Server: Ferramenta para criar uma API RESTful completa com fake data, ideal para prototipagem e testes.
- React-Redux: Biblioteca oficial de bindings para usar Redux com React.
- React-Router-Dom: Biblioteca para roteamento de aplicações React.
- Redux: Biblioteca de gerenciamento de estado previsível para JavaScript.
- Redux-Saga: Biblioteca para gerenciar efeitos colaterais em aplicativos Redux.
- Testing Library: Conjunto de utilitários para testar componentes React.
- Cypress: Framework de testes end-to-end para testar aplicações web.
- ESLint: Ferramenta de linting para identificar e corrigir problemas de código JavaScript.
- TypeScript: Superset de JavaScript que adiciona tipagem estática opcional ao código.
- Vitest: Ferramenta de testes unitários para projetos Vite.
- npm: Gerenciador de pacotes para JavaScript.


