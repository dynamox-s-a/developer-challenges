# Dynamox Developer Challenges - Front-End

- [x] [01 - Dynamox Front-end Developer Challenge V1](./front-end-challenge-v1.md)

---

# Configuração inicial

Executando o Projeto Localmente

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/portellaluana/developer-challenges.git
   ```
2. **Atualizar branch**:

   ```bash
   git checkout luana-portella
   ```
---

# Challenge 1: Landing Page

## Execução do projeto

1. **Escolha a pasta do projeto**:

   ```bash
   cd dynamox-landing-page
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Inicie o projeto**:

   ```bash
   npm run dev
   ```

---

# Challenge 2: Event Management System

## Execução do projeto

1. **Escolha a pasta do projeto**:

   ```bash
   cd event-management-system
   ```

2. **Instale as dependências**:

   ```bash
   npm install
   ```

3. **Inicie o json-server**:

   ```bash
   npm run server
   ```
   A API estará disponível em: http://localhost:3001

4. **Inicie o projeto**:

   ```bash
   npm run dev
   ```
   Aplicação em: http://localhost:3000

---   

## Introdução

Aplicação de gerenciamento de eventos com autenticação baseada em roles, desenvolvida como parte do desafio técnico da Dynamox.

---

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
event-management-system/
├── public/           
├── src/
│   ├── app/
│   │   ├── api/                # Consumos das APIs
│   │   ├── constants/          # Constantes
│   │   ├── dashboard/          # Página dashboard admin
│   │   ├── events/             # Página events reader
│   │   ├── hooks/              # Hooks url authGuard
│   │   ├── login/              # Página login
│   │   ├── services/           # Lógicas de manipulação e integração das APIs
│   │   ├── types/              # Tipos enumerados
│   ├── components/             # Componentes reutilizáveis
├── README.md                   # Documentação do projeto
├── package.json                # Dependências e scripts
└── ...
```

---

## Tecnologias Utilizadas

- **React + Next.js**
- **TypeScript**
- **Next.js**
- **Material UI 6**
- **json-server**

---

## Funcionalidades

### 1. **Login**

Tela inicial da aplicação, onde o usuário deve informar seu e-mail e senha para autenticação.

- Validação de campos obrigatórios.
- Exibição de mensagens de erro em caso de credenciais inválidas.
- Armazenamento de um token fake e dados do usuário no `localStorage`.
- Redirecionamento automático de acordo com a role do usuário:
  - `admin` → Dashboard de administração.
  - `reader` → Lista de eventos.

Usuários pré-configurados:

1. Admin User
   - Email: admin@events.com
   - Password: admin123
   - Role: admin

2. Reader User
   - Email: reader@events.com
   - Password: reader123
   - Role: reader

---

### 2. **Tela de eventos**

Interface acessível para usuários com perfil `reader`, exibindo a lista de eventos cadastrados.

- Separação entre eventos futuros e passados;
- Campo de busca por nome de evento;
- Ordenação por nome ou data;
- Design responsivo para uma boa experiência em dispositivos móveis;
- Exibição de cards com os principais dados do evento: nome, data, local, descrição e categoria;

---

### 3. **Tela Dashboard**

Área administrativa com funcionalidades completas de gerenciamento de eventos, disponível apenas para usuários `admin`.

- Criação de evento com validações;
- Listagem dos eventos;
- Edição de eventos já existentes;
- Exclusão de eventos;
- Formulários com validação e feedback visual;
- Design responsivo para uma boa experiência em dispositivos móveis;

---
