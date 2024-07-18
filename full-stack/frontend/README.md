# Nome do Projeto

Uma breve descrição do projeto.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Pré-requisitos

Certifique-se de ter os seguintes softwares instalados:

Caso tenha o docker e docker compose instalado, existe um arquivo dentro do projeto chamado: docker-compose.yml 
e basta executar ele

```bash
  docker compose up -d  
```

Se não tiver o docker, será necessário instalar o postgreSQL

- [Node.js](https://nodejs.org/en/) (recomendado a versão LTS)
- [Git](https://git-scm.com/)
- [Docker](https://docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Instalação

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clonar o repositório

Primeiro, clone o repositório para sua máquina local usando o comando:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
```
# Instalação do backend
### 1.Navegar para o diretório do projeto
```bash
cd backend
```

### 2.Instalar as dependências
```bash
npm install
# ou
yarn install
```

### 3.Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto e adicione as variáveis de ambiente necessárias.
```bash
DATABASE_URL="postgresql://postgres:pass123@localhost:5432/dynamox"
JWT_SECRET=i2h3j98u21h398u21n3uin218u3n12
IS_PUBLIC_KEY=insaknmjk

PORT=3000
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000
```

### 4.Executar a migração do prisma para criação das tabelas
```bash
npx prisma migrate dev   
```

### 5.Executar o seed para criação de massa de teste
```bash
npx prisma db seed 
```

### 6.Executar o projeto
```bash
npm run dev
# ou
yarn dev
```

# Instalação do frontend

### 1.Navegar para o diretório do projeto
```bash
cd frotend
```

### 2.Instalar as dependências
```bash
npm install
# ou
yarn install
```

### 3.Configurar variáveis de ambiente
Crie um arquivo .env.local na raiz do projeto e adicione as variáveis de ambiente necessárias.
```bash
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### 4.Executar o projeto
```bash
npm run dev
# ou
yarn dev
```
### Abra http://localhost:3000 no seu navegador para ver o projeto em execução.

Para logar na aplicação, pode ser usar o usuario de teste que foi criado:
```bash
login:user1@example.com
password:pass123
#ou
login:user2@example.com
password:pass123
```


