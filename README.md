# 🚀 DynaPredict - Full Stack Challenge

Solução para o desafio full stack da Dynamox, para monitoramento de máquinas e sensores.

A aplicação foi desenvolvida, separando **frontend** e **backend** em dois projetos distintos. O projeto cobre autenticação, gerenciamento de máquinas, sensores e pontos de monitoramento, conforme os requisitos propostos.

---

## 📁 Estrutura do Projeto

```
graphql
CopiarEditar
.
├── dynamox-frontend   # Aplicação React + Redux Toolkit + Material UI
└── dynamox-backend    # API REST com NestJS + Prisma + PostgreSQL

```

---

## ⚙️ Tecnologias Utilizadas

### 🖥️ Frontend (`dynamox-frontend`)

- [React](https://reactjs.org/) com [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI 5](https://mui.com/)
- Redux Toolkit com `createAsyncThunk`
- Requisições autenticadas via `axios` com token JWT

### 🔧 Backend (`dynamox-backend`)

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/) com [PostgreSQL](https://www.postgresql.org/)
- Validações customizadas para regras de negócio
- Organização em módulos (`machines`, `sensors`, `monitoring-points`, `auth`)
- CRUD completo com DTOs, services e controllers

---

## 📌 Funcionalidades implementadas

- **Login:** Usuário fixo com email e senha definidos no backend.
- **Sensor Models:** São fixos, conforme especificado: "TcAg", "TcAs", "HF+".
- **Paginação:** Lista de pontos de monitoramento exibe até 5 por página, conforme exigido.
- **Ordenação:** Feita no frontend com base nos dados já paginados.
- **Regras de Negócio:** Sensores "TcAg" e "TcAs" são bloqueados em máquinas tipo "Pump", tanto no frontend quanto backend.
- **Token:** Armazenado em memória com Redux, persistido localmente.
- **Layout:** Utilizado Material UI com grid system responsivo

---

## ▶️ Como Rodar o Projeto

### Pré-requisitos

- Node.js (>= 18)
- Yarn ou npm
- PostgreSQL (ou Docker)

### Backend

```bash
cd dynamox-backend
cp .env.example .env
# configure as variáveis, especialmente a DATABASE_URL
npm install
npm prisma migrate dev
npm run start

```

### Frontend

```bash
cd dynamox-frontend
npm install
npm run dev

```

---

## 🧪 Testes

- `Jest` no backend

---

## 🌐 Deploy

> AWS

A aplicação backend (`dynamox-backend`) foi implantada utilizando o serviço **Elastic Beanstalk** da AWS.

### Serviços utilizados:

- **Elastic Beanstalk:** Gerenciamento da infraestrutura de aplicação com provisionamento automático de EC2, Load Balancer, Auto Scaling e logs integrados.
- **Amazon EC2:** Instância criada automaticamente para hospedar o backend.
- **Amazon S3:** Utilizado pelo Beanstalk para o front-end.

http://dynamox-frontend.s3-website-us-east-1.amazonaws.com

### Etapas realizadas:

- Instalação e configuração da AWS CLI e EB CLI.
- Criação do ambiente com `eb init` e `eb create`.
- Deploy da aplicação com `eb deploy`.
- Configuração de variáveis de ambiente diretamente no ambiente do Beanstalk com `eb setenv`.

A aplicação está sendo servida via Load Balancer com rota pública fornecida pela AWS.

---

## 📞 Contato

Se quiser trocar uma ideia sobre o projeto ou meu processo de desenvolvimento:

**LinkedIn:** www.linkedin.com/in/karina-peresg
