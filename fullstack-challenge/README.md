# Dynamox – Full Stack Challenge (Nx + Next.js)

Este projeto foi desenvolvido como parte de um desafio técnico utilizando **Nx Workspace** com **Next.js**, **React**, **TypeScript**, **Redux Toolkit** e **NextAuth**.

A aplicação permite autenticação de usuários, gerenciamento de máquinas e pontos de monitoramento, aplicando regras de negócio e boas práticas de arquitetura front-end.

---

## Tecnologias Utilizadas

- Nx Workspace;
- Next.js (App Router);
- React + TypeScript;
- Redux Toolkit;
- NextAuth;
- Material UI (MUI);

---

## Pré-requisitos

Antes de iniciar o projeto, é necessário ter instalado:

- Node.js (versão 18 ou superior);
- npm ou yarn;
- Nx CLI (opcional);

Instalação global do Nx CLI (opcional):

```bash
npm install -g nx
```

---

## Instalação do Projeto

1. Acesse a pasta do projeto:

```bash
cd fullstack-challenge
```

2. Instale as dependências (conforme o gerenciador npm ou yarn):

```bash
npm install

yarn install
```

---

## Variáveis de Ambiente

A autenticação é feita utilizando **NextAuth com Credentials Provider**.

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
AUTH_USER_EMAIL=
AUTH_USER_PASSWORD=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

##### Descrição das variáveis:

- AUTH_USER_EMAIL: E-mail utilizado para autenticação.

- AUTH_USER_PASSWORD: Senha utilizado para autenticação.

- NEXTAUTH_URL: URL base da aplicação. Em ambiente local, normalmente: http://localhost:3000

- NEXTAUTH_SECRET: Chave secreta utilizada pelo NextAuth para assinar e criptografar sessões e tokens. Pode ser uma string em base 64, caso tenha o openssl instalado poderá obter a string usando o seguinte comando:

```bash
openssl rand -base64 32
```

ou usar a seguinte string já criada:

```env
NEXTAUTH_SECRET= v8q5K3jHn9YtF2Q6rZb0mH1uXf7WcN4pLkQw3aE2sF1=
```

---

## Executando o Projeto

Para rodar a aplicação em ambiente de desenvolvimento:

```bash
npx nx dev frontend
```

Caso queira rodar a aplicação em ambiente de produção:

```bash
npx nx build frontend
npx nx start frontend
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---

## Autenticação

- Implementada com **NextAuth**;
- Provider: **Credentials**;
- Credenciais definidas via variáveis de ambiente;
- Redirecionamento para o dashboard após login;
- Logout disponível no menu lateral;

---

## Gerenciamento de Máquinas

- Limite máximo de **4 máquinas**
- Cada máquina possui:
  - Nome;
  - Tipo (`Pump` ou `Fan`);

---

## Pontos de Monitoramento

- Cada máquina pode ter no máximo **2 pontos de monitoramento**
- Máquinas do tipo `Pump` não aceitam sensores `TcAg` e `TcAs`
- Cada ponto contém:
  - Nome;
  - Modelo do sensor;
  - Referência à máquina;

---

## Tabela de Monitoramento

- Exibe todos os pontos cadastrados;
- Ordenação por coluna;
- Paginação;

---

## Testes

- Testes unitários para:
  - Redux slices;
  - Redux selectors;
- Ferramenta utilizada: **Jest**;

Execução dos testes:

```bash
npx nx test frontend
```

---

## Considerações Finais

Tempo de desenvolvimento: ~3 dias

##### Melhorias:

- Front-end:

  - Integração com a API utilizando Redux Thunk para gerenciamento de chamadas assíncronas;
  - Inclusão de um botão de ação com ícone de edição (lápis) para permitir a alteração de pontos de monitoramento;
  - Implementação de um modal para edição e exclusão dos pontos de monitoramento;
  - Aprimoramento do design e da usabilidade da tabela de monitoramento;
  - Melhoria na centralização, responsividade e organização visual dos cards de máquinas.
  - Inclusão de mais validações de dados.
  - Correção dos erros relacionados a estado vazio.

- Back-end:

  - Implementação das regras de negócio no back-end para deixar o sistema mais robusto;
  - Aprimoramento do mecanismo de autenticação utilizando JWT;
  - Implementação de expiração e renovação automática de tokens, evitando tokens válidos por tempo indeterminado;
  - Validação dos tokens de autenticação no back-end, como complemento à autenticação do front-end;
  - Integração com um banco de dados PostgreSQL;
  - Armazenamento de credenciais de usuários de forma segura, utilizando criptografia de senha no banco de dados em vez de variáveis de ambiente.
  - Documentação da API utilizando Swagger.

- Ambiente e Qualidade :
  - Inclusão do ESLint para padronização de código e formatação;
  - Implementação de um processo automatizado no Git para execução do ESLint antes da realização de commits;
  - Publicação da aplicação em ambiente de nuvem;
