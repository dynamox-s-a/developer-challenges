# 💻 Desafio Front-end Dynamox

- Foi implementado uma tela de autenticação fake com um login fixo. No entanto, as rotas são privadas e as requisições à API simulam o envio de um token fake. Além da tela de login, a aplicação possui uma tela principal com a tela de produtos presentes no db.json, além de uma tela para criação de um produto e outra para edição de produtos.

Favor utilizar os dados abaixo para realizar o login:
  ```bash
  email: teste@teste.com
  password: 12345
  ``` 

## 🚀 Tecnologias
Esse projeto foi desenvolvido com as seguintes tecnologias:

> Desenvolvido usando: React, ReduxTookit, react-router-dom, json-server, Material UI e CSS. 


## :bookmark_tabs:	Requisitos funcionais:

- Aplicação deverá ter telas de criação, edição e listagem de produtos, com os campos:

> Nome; Data de fabricação; Produto perecível (booleano); Data de validade; Preço;

- O usuário só deverá ter acesso às rotas de criação, edição e listagem de produtos caso esteja autenticado;

- O usuário só poderá cadastrar data de validade caso o produto seja perecível;

- A data de fabricação nunca deverá ser maior que a data de validade;

- O preço deverá estar em reais (R$);

- A tela de listagem deverá ter a possibilidade de ordenação dos campos e com uma paginação de 10 produtos por página.

- O backend deve ser simulado com json-server, que cria uma API REST fake;

## ⬇️ Como rodar o projeto

1. Primeiramente, fazer um clone deste repositório.
  ```bash
  git clone git@github.com:gabrieldezena10/teste-front-end-Dynamox.git
  ``` 

2. Trocar para a branch do desafio 02
  ```bash
  git checkout desafio-02/gabriel-dezena
  ``` 

3. Instalando as dependência
  ```bash
  cd desafio-02
  npm install
  ``` 

4. Executando a API rest fake - json-server
  ```bash
  npm run json
  ``` 

4. Executando a aplicação
  ```bash
  npm run dev
  ``` 

Abrir [http://localhost:5173](http://localhost:5173) no seu navegador para visualizar a aplicação.

</table>
