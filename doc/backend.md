# Desafio full-stack Dynamox - Backend

**Sumário**
- [Modelagem banco de dados](#modelagem-banco-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Tecnologias utilizadas](#tecnologias-utilizadas)

## Modelagem banco de dados
> Diagrama relacional do banco de dados. Modelagem criada com o intuito de facilitar o desenvolvimento da API. 

![](./images/modelagem-challenge.png)

## Endpoints da API

- Backend hospedado em: https://developer-challenges.onrender.com/api

| Método | Endpoint | Descrição do serviço |
|--------|----------|----------------------|
|Post | [URL_API]/auth/login | Realiza o login do usuário na aplicação. Autenticado com token JWT|
|Post    | [URL_API]/user | Responsável pela crição de um novo usuário | 
|Get |[URL_API]/user/{id}| Busca o usuário pelo ID|
|Put | [URL_API]/user/{id} | Atualiza dados do usuário|
|Delete | [URL_API]/user/{id} | Remove o usuário |
|Post | [URL_API]/machine | Cria uma nova máquina |
|Get | [URL_API]/machine | Retorna todas as máquinas criadas |
|Get | [URL_API]/machine/{id} | Retorna uma única máquina |
|Patch | [URL_API]/machine/{id} | Atualiza parcialmente dados de uma máquina |
|Delete | [URL_API]/machine/{id} | Remove uma nova máquina |
|Post | [URL_API]/sensors/{machineId}/{pointId} | Aloca um sensor a uma máquina e um ponto de monitoramento |
|Get | [URL_API]/sensors | Retorna todos os sensores alocados |
|Get | [URL_API]/sensors/{id} | Retorna informações de um sensor alocado |
|Get | [URL_API]/sensors/details | Retorna valores referente a uma query personalizada para trazer detalhes de máquina, ponto de monitoramento e sensores|
|Patch | [URL_API]/sensors/{id} | Atualiza modelo do sensor alocado |
|Delete | [URL_API]/sensors/{id} | Remove sensor alocado da máquina |
|Post | [URL_API]/monitoring-point/{machineId} | Cria um ponto de monitoramento para uma máquina |
|Get | [URL_API]/monitoring-point | Retorna todos os pontos de monitoramento |
|Get | [URL_API]/monitoring-point/{machineId} | Retorna informações sobre o ponto de monitoramento que uma máquina está alocada |
|Patch | [URL_API]/monitoring-point/{id}/{machineId}/{pointId} | Atualiza ponto de monitoramento |
|Delete | [URL_API]/monitoring-point/{id} | Remove ponto de monitoramento |

- [Documentação detalhada da API com swagger](https://developer-challenges.onrender.com/api) 
  
> Obs.: Cada rota está protegida, é necessário o usuário estar logado no sistema.

## Tecnologias utilizadas

- NestJS
- Typescript
- Prisma
- PostgreSQL
- Autenticação com token JWT
- Docker compose

## Utilizar a aplicação localmente

Clone o repositório com:
```bash
git clone https://github.com/viniciusft81/developer-challenges.git
```
Em seguida, entre no diretório `backend-challenge`:
```bash
cd backend-challenge
```

Para utilizar a aplicação localmente, é necessário subir o container `docker` para disponibilizar um banco de dados PostgreSQL local. 

Para isso utilize o seguinte comando:
```bash
docker compose up -d
```

Além disso, adicione as variáveis de ambiente com os seguinte valores no arquivo `.env`:
```bash
DATABASE_URL="postgresql://docker:docker@localhost:5432/challenge?schema=public"
SECRET_KEY="2afe16a6d630d94cd07c68d5e35568655bf5f60bef29c4f1321fc857816afec9"
```

## Instalação das dependências
Instale as dependências do projeto com o seguinte comando:

```bash
npm install
```

## Compile e rode o projeto

```bash
# watch mode
npm run start:dev
```
:clap: Pronto! O backend está rodando localmente.
