# Desafio 02 - Autenticação e CRUD

Neste desafio desenvolvi um sistema de CRUD para uma api fake. Criei uma tela de autenticação, com email e senha fixos o qual está disponível na mesma tela para testes e avaliação, onde esta manda o token JWT para o header da requisição.

Os requisitos funcionais:

- Aplicação deverá ter telas de criação, edição e listagem de produtos, com os campos:

  - Nome;
  - Data de fabricação;
  - Produto perecível (booleano);
  - Data de validade;
  - Preço;

- O usuário só deverá ter acesso às rotas de criação, edição e listagem de produtos caso esteja autenticado;

- O usuário só poderá cadastrar data de validade caso o produto seja perecível;

- A data de fabricação nunca deverá ser maior que a data de validade;

- O preço deverá estar em reais (R$);

- A tela de listagem deverá ter a possibilidade de ordenação dos campos e com uma paginação de 10 produtos por página.

- O backend deve ser simulado com json-server, que cria uma API REST fake;

Foram todos atendidos.

## Autores

- [@Mati-Pereira](https://www.github.com/Mati-Pereira)

## Funcionalidades

- Proderá criar, deletar, atualizar e visualizar os produtos;
- Proderá utilizar em Smartphones;
- Tela de autenticação com token JWT;

## Rodando localmente

Instale as dependências

```bash
  npm install
```

Inicie a parte do front

```bash
  npm run dev
```

Em outro terminal, inicie a parte do servidor

```bash
  npm run server
```

Vá para a porta 5173 do localhost: http://localhost:5173

## Stack utilizada

**Front-end:** React, Typescript, Redux Toolkit, TailwindCSS, React Hook Form, React Icons, React Router Dom, React Responsive Paginate e React Toastify

**Back-end:** Json-server
