Desafio Full-Stack Dynamox - Gestão de Ativos

Este projeto é a solução para o desafio técnico da Dynamox, consistindo numa aplicação web completa para a gestão de máquinas industriais e seus respetivos pontos de monitoramento.

O sistema permite que o utilizador gerencie o ciclo de vida de ativos, associe sensores e visualize dados de forma organizada e responsiva.

🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando uma arquitetura moderna e robusta, dividida em Frontend e Backend:

Frontend

React (com TypeScript) - Biblioteca principal para construção da UI.

Material UI (v5) - Framework de componentes para um design consistente e responsivo.

Redux Toolkit - Gestão de estado global e chamadas assíncronas (Thunks).

Vite - Build tool rápida e eficiente.

Axios - Cliente HTTP para comunicação com a API.

Backend

NestJS - Framework Node.js para construção de APIs escaláveis.

Prisma ORM - Interação moderna e tipada com o banco de dados.

SQLite - Banco de dados relacional (escolhido pela facilidade de configuração em ambiente de desenvolvimento).

Class Validator - Validação de dados de entrada (DTOs).

✨ Funcionalidades Implementadas

🔐 Autenticação

Tela de login com validação de credenciais.

Acesso a rotas privadas protegido (apenas utilizadores autenticados).

Funcionalidade de Logout.

🏭 Gestão de Máquinas

Listagem: Visualização de todas as máquinas com status e tipo.

Criação: Cadastro de novas máquinas (Tipos: Bomba, Ventilador).

Edição: Atualização de nome e tipo da máquina.

Exclusão: Remoção de máquinas do sistema.

📡 Gestão de Pontos de Monitoramento

Listagem Paginada: Tabela com paginação (5 itens por página) para fácil visualização.

Ordenação: Capacidade de ordenar a lista por qualquer coluna (Nome, Sensor, Máquina, Status).

Criação: Adição de novos pontos associados a uma máquina existente.

Regras de Negócio: Validação automática que impede a associação de sensores "TcAg" ou "TcAs" a máquinas do tipo "Bomba".

Edição e Exclusão: Gestão completa do ciclo de vida do ponto.

📱 Interface e UX

Design Responsivo: Layout adaptável para Desktops, Tablets e Smartphones.

Feedback Visual: Indicadores de carregamento, modais de confirmação e alertas de erro.

🛠️ Como Rodar o Projeto

Siga os passos abaixo para executar a aplicação completa no seu ambiente local.

Pré-requisitos

Node.js (v16 ou superior)

NPM ou Yarn

1. Configurar o Backend

O backend é responsável pela API e pelo banco de dados.

# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Gere o cliente do Prisma e execute as migrações (Cria o banco de dados SQLite)
npx prisma migrate dev --name init

# Inicie o servidor
npm run start


O servidor backend estará rodando em: http://localhost:3000/api

2. Configurar o Frontend

Em um novo terminal, configure a interface do utilizador.

# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev


Acesse a aplicação no navegador (geralmente em http://localhost:4200 ou http://localhost:5173, dependendo da porta liberada pelo Vite).

📝 Credenciais de Acesso

Para acessar o sistema, utilize as seguintes credenciais padrão (simulação):

Email: admin@dynamox.net

Senha: 123456

🧠 Decisões de Projeto e Suposições

Durante o desenvolvimento, foram tomadas as seguintes decisões para cumprir os requisitos e lidar com ambiguidades:

Banco de Dados: Optou-se pelo SQLite para facilitar a avaliação do projeto, pois não requer a instalação de um servidor de banco de dados separado (como Postgres ou MySQL) na máquina do avaliador.

Autenticação: Como o foco do desafio era a gestão de ativos, a autenticação foi implementada no Frontend como uma simulação segura de fluxo, sem persistência de sessão complexa (JWT) no backend, focando na proteção de rotas via React State.

Estrutura Monorepo: O projeto utiliza uma estrutura organizada (Nx) que facilita a manutenção e o compartilhamento de configurações entre Front e Back.

Desenvolvido por Wesley Marques como parte do processo seletivo da Dynamox.
