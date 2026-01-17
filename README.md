# DynaPredict - Teste Técnico Front-end

Aplicação desenvolvida para o gerenciamento de máquinas e pontos de monitoramento industrial, com foco em usabilidade, performance e confiabilidade. O projeto segue a identidade visual da Dynamox e implementa fluxos completos de CRUD e validação.

## Tecnologias e Ferramentas

O projeto foi construído utilizando uma stack moderna e robusta:

- **React + TypeScript**: Interface reativa com tipagem estática para maior segurança.
- **Redux Toolkit**: Gerenciamento de estado global (Store, Slices, AsyncThunks) para centralizar a lógica de dados.
- **Material UI (MUI)**: Biblioteca de componentes com **Tema Customizado** (cores e tipografia) alinhado à marca da empresa.
- **Cypress**: Testes End-to-End (E2E) automatizados cobrindo os principais fluxos do usuário.
- **Json-Server**: Simulação de API RESTful para persistência de dados.
- **Axios**: Cliente HTTP para comunicação com a API.


## Como Rodar o Projeto

Siga os passos abaixo para executar a aplicação em seu ambiente local.

### 1. Instalação
Clone o repositório e instale as dependências:

```bash
npm install
```
2. Iniciar o Backend (Simulado)
O projeto utiliza o json-server para mockar a API e persistir os dados localmente. Em um terminal dedicado, execute:

Bash

npx json-server db.json --port 3000
O servidor ficará ativo em http://localhost:3000

3. Iniciar o Frontend
Em um segundo terminal, inicie a aplicação React:

Bash

npm run dev
Acesse a aplicação no navegador (geralmente em http://localhost:5173)

Credenciais de Acesso
Para acessar o sistema, utilize as credenciais de teste configuradas:

Email: admin@dynamox.net

Senha: admin

Testes Automatizados (E2E)
A aplicação conta com uma suíte de testes E2E utilizando Cypress, garantindo a estabilidade das funcionalidades críticas.

Para rodar os testes:

Certifique-se de que o Front-end e o Json-Server estejam rodando.

Execute o comando:

Bash

npx cypress open
Na janela que abrir, selecione E2E Testing > Chrome > Start E2E Testing.

Clique nos arquivos de teste (ex: user-flow.cy.ts) para vê-los rodando em tempo real.

Decisões de Arquitetura e Projeto
Front-end e UX
DataGrid Inteligente: Utilizei o DataGrid do MUI com valueGetter para realizar o cruzamento de dados no front-end (ex: exibir o Nome da Máquina na tabela de Sensores baseando-se no ID), proporcionando uma leitura mais amigável para o usuário.

Redux Pattern: A escolha pelo Redux Toolkit visa evitar o "prop drilling" e manter o cache dos dados sincronizado entre as telas de Máquinas e Monitoramento.

Identidade Visual: Implementação de um ThemeProvider para garantir que toda a aplicação (botões, inputs, loadings) reflita as cores oficiais da empresa.

Estratégia de Qualidade
O foco principal foi garantir a resiliência da aplicação.

Os testes automatizados utilizam estratégias de captura de ID dinâmico e limpeza de dados. Isso significa que o teste cria sua própria massa de dados, executa a ação e valida o resultado, sem interferir nos dados manuais já existentes no banco.

### Backend e Próximos Passos (Roadmap v2.0)
Para a versão atual (MVP), a arquitetura utiliza o `json-server` para simular a API. Essa decisão foi tomada para priorizar a construção de uma interface rica e a cobertura de testes E2E dentro do escopo do desafio.

Entretanto, o projeto foi desenhado considerando a evolução para um backend real. O roadmap técnico inclui:

1.  **Migração para Node.js + Prisma + PostgreSQL**: Substituição do json-server para persistência robusta.
2.  **Validações Server-Side**: Implementação das regras de negócio (ex: restrição de sensores por tipo de máquina) diretamente na API, aumentando a segurança.
3.  **Autenticação JWT**: Implementação de login seguro com tokens e controle de sessão.

Regras de Negócio Server-Side: Mover validações críticas (como "Máquinas do tipo Pump aceitam apenas sensores HF+") para o Controller do backend, garantindo integridade total dos dados.

Autenticação JWT: Implementação de segurança robusta com tokens reais.

Desenvolvido por Nicolas Geziel