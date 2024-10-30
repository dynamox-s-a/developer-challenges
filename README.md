# Projeto Dynamox

Este projeto é composto por três serviços principais:

1. **dynamox-auth**: Serviço de autenticação.
2. **dynamox-be**: Backend principal.
3. **dynamox-fe**: Frontend.

## Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **NPM** (geralmente incluído com o Node.js)
- **Docker e Docker Compose** (opcional, se desejar rodar usando containers)

## Primeiros Passos

1. Clone o repositório para sua máquina:
    ```bash
    git clone https://github.com/mateusbays/developer-challenges.git
    git checkout mateus-bays
    ```

2. Instale as dependências. Você pode navegar até o diretório raiz e rodar `npm install` 

    ```
    npm install
    ```

## Rodando os Serviços

Os três serviços (`auth`, `be` e `dynamox-fe`) possuem scripts de inicialização dedicados. Use os comandos abaixo para iniciar cada serviço individualmente.

### 1. Rodando o Serviço de Autenticação (`auth`)

Este serviço é responsável pelo gerenciamento de autenticação. Para iniciar o serviço de autenticação:

```bash
    npm run start:auth
 ```


### 2. Rodando o Serviço do Backend (`dynamox-be`)

Este serviço é responsável pela api de maquinas e pontos de monitoriamento. Para iniciar o serviço :

```bash
    npm run start:be
 ```


### 3. Rodando o Serviço do Frontend (`dynamox-fe`)

Este serviço é responsável pela api de maquinas e pontos de monitoriamento. Para iniciar o serviço :

```bash
    npm run start:fe
 ```


## Rodando os serviços pelo Docker (recomendável)

    Navegar até a pasta /infra e executar o seguinte comando.

```bash
    docker-compose -f docker-compose-dev.yml up --build -d
 ```

 Após os serviços iniciarem startar o NGINX

 ```bash
    docker start dynamox-nginx 
 ```

Assumptions:
- Assumi que cada ponto de monitoramento deve pertencer a somente um sensor. Dessa forma, ficou possível criar somente três pontos de monitoramento, pois só existem três sensores pré configurados no seed.
- Poderia ter feito a parte de CRUD dos sensores também, mas como não era uma solicitação no teste, poderia vir como melhoria.
- Ao desenvolver, coloquei uma camada de proxy com o NGINX na frente da api de autenticação e da api do backend, para não expor as apis.
