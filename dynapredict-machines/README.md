# Dynapredict Machines

Sistema para cadastro e gerenciamento de máquinas industriais, com Frontend em React + Vite e Backend em .NET 9 + PostgreSQL.

## Tecnologias utilizadas

- **Frontend:** React, Vite, TypeScript  
- **Backend:** .NET 9, C#, Entity Framework Core  
- **Banco de dados:** PostgreSQL 15  
- **Containers:** Docker e Docker Compose  

## Pré-requisitos

- Node.js >= 20  
- Docker e Docker Compose  
- .NET 9 SDK (opcional, se for rodar local)

## Configuração do Banco de Dados

Para criar um container PostgreSQL:
docker run --name postgres-db ^
  -e POSTGRES_PASSWORD=mypassword ^
  -e POSTGRES_USER=myuser ^
  -e POSTGRES_DB=mydatabase ^
  -p 5432:5432 ^
  -v postgres-data:/var/lib/postgresql/data ^
  -d postgres
Isso irá criar o banco de dados necessário para o backend.

Acesse o Docker e certifique-se que o banco de dados está rodando localmente.

Rodando a aplicação localmente



Backend
Na pasta raiz (dynapredict-machines):

dotnet build
dotnet run --project Dynapredict.Api
Isso iniciará o servidor backend de testes.



Frontend
Na pasta dynapredict-frontend:

npm install
npm run dev
Acesse o frontend em: http://localhost:5173



Rodando a aplicação com Docker(Infelizmente não consegui fazer rodar juntamente com o banco de dados, portanto não funciona corretamente)
Na pasta raiz do projeto:

docker-compose build --no-cache
docker-compose up



Funcionalidades
Cadastrar, listar e visualizar detalhes das máquinas

Tipos de máquinas: Press, Lathe, Milling Machine

Formulários com validação

Interface responsiva