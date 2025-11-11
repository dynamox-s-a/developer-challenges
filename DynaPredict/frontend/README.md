# Frontend

**Sumário**
- [Frontend](#frontend)
  - [Sobre o projeto](#sobre-o-projeto)
  - [Funcionalidades Implementadas](#funcionalidades-implementadas)
    - [Autenticação](#autenticação)
    - [Gerenciamento de Máquinas](#gerenciamento-de-máquinas)
    - [Gerenciamento de Sensores](#gerenciamento-de-sensores)
    - [Gerenciamento de Pontos de Monitoramento](#gerenciamento-de-pontos-de-monitoramento)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Executar o Projeto](#executar-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Passos para Executar](#passos-para-executar)
  - [Usabilidade](#usabilidade)
## Sobre o projeto

Este projeto foi desenvolvido como parte do desafio full-stack da Dynamox. Ele consiste em um frontend construído com React e Vite, que consome os recursos do backend fornecido. O Material UI foi utilizado para a criação dos componentes e do dashboard.



## Funcionalidades Implementadas

O projeto implementa as seguintes funcionalidades conforme o desafio proposto:

### Autenticação

- [x] Usuário pode se registrar com email e senha fixos para rotas privadas.
- [x] Rotas privadas são protegidas e acessíveis apenas para usuários autenticados.
- [x] Usuário pode fazer login e logout, para evita acesso não autorizado.
- [x] Utilização de Redux e Redux Toolkit para gerenciar o estado de autenticação do usuário.

### Gerenciamento de Máquinas

- [x] Usuário pode criar máquinas, com nome e tipo selecionado a partir de uma lista.
- [x] Usuário pode alterar o nome e o tipo de uma máquina existente.
- [x] Usuário pode deletar máquinas, desde que não estejam em uso.
- [x] Usuário pode visualizar a lista de máquinas cadastradas.

### Gerenciamento de Sensores

- [x] Usuário pode criar sensores, com id único e tipo selecionado a partir de uma lista `["TcAg", "TcAs", "HF+"]`'.
- [x] Usuário pode excluir sensores, desde que não estejam em uso.
      [x] Usuário pode visualizar a lista de sensores cadastrados.

### Gerenciamento de Pontos de Monitoramento

- [x] Usuário pode criar pontos de monitoramento, associando máquinas
- [x] Usuario pode associar sensores aos pontos de monitoramento. Sequindo a restrição de que sensores do tipo `TcAg` e `TcAs` não podem ser associados em máquinas do tipo `Pump`.
- [x] Usuário pode alterar as associações de máquinas e sensores em pontos de monitoramento existentes.
- [x] Usuário pode deletar pontos de monitoramento.
- [x] Usuário pode visualizar a lista página de pontos de monitoramento na dashboard.

## Tecnologias Utilizadas

- React
- Vite
- TypeScript
- Redux e Redux Toolkit
- Material UI 5

## Executar o Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Backend em execução (conforme o repositório do backend fornecido)
- git

### Passos para Executar

1. Clone este repositório:

   ```bash
    git clone https://github.com/MatheusDMedeiros/developer-challenges.git
    cd developer-challenges
    git switch matheus-medeiros

   ```

2. Navegue até o diretório do frontend:
   ```bash
   cd ./DynaPredict/frontend
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

:clap : Parabéns! O frontend do projeto deve estar rodando agora em `http://localhost:5173` (ou outra porta, caso a 5173 esteja ocupada). Certifique-se de que o backend também esteja em execução para que o frontend possa consumir os dados corretamente.

> [!NOTE]
> Caso a porta padrão esteja ocupada, o Vite irá sugerir uma nova porta automaticamente. Fique atento em alterar no beckend, no arquivo main.py a variável `allow_origins` para refletir a nova porta, caso necessário.

## Usabilidade

O sistema já conta com a criação de um usuário padrão para facilitar os testes:

> - E-mail: `dynamox@example.com`
>
> - Senha: `123456789`

Estes dados devem ser utilizados para realizar o login e acessar as rotas privadas do sistema.
