# Dynamox - Front End Desafio 2

## 📃 Sobre - About
<details>
  <summary > :brazil: Portuguese </summary>
  <p>
    Desenvolver uma tela de autenticação fake. O login pode ser feito com e-mail e senha fixos, porém as rotas devem ser privadas e as requests à API devem simular o envio do token JWT, que também poderá ser fake, para ser visualizada em um dispositivo desktop (1280px)
  </p>
</details>

<details>
  <summary > :us: English </summary>
  <p>
    Develop a fake authentication screen. The login can be done with fixed email and password, but the routes must be private and the requests to the API must simulate the sending of the JWT token, which can also be fake, to be viewed on a desktop device (1280px)
  </p>
</details>

## 🛠️ Ferramentas - Tools
  - React
  - React Router Dom
  - Material UI Components
  - Material UI Icon
  - CSS
  - json-server

##  📝 Melhorias - Improvements

<details>
  <summary > :brazil: Portuguese </summary>

  - [ ] Testes
  - [ ] Otimização do Código

</details>

<details>
  <summary > :us: English </summary>
  
  - [ ] Tests
  - [ ] Code Optimization

</details>

## Requisitos do desafio - Challenge requirements
<details>
  <summary > :brazil: Portuguese </summary>

## 1 -  Aplicação deverá ter telas de criação, edição e listagem de produtos, com os campos:

  - Nome;
  - Data de fabricação;
  - Produto perecível (booleano);
  - Data de validade;
  - Preço;

## 2 - O usuário só deverá ter acesso às rotas de criação, edição e listagem de produtos caso esteja autenticado;

## 3 - O usuário só poderá cadastrar data de validade caso o produto seja perecível;

## 4 - A data de fabricação nunca deverá ser maior que a data de validade;

## 5 - O preço deverá estar em reais (R$);

## 6 - A tela de listagem deverá ter a possibilidade de ordenação dos campos e com uma paginação de 10 produtos por página.

## 7 - O backend deve ser simulado com json-server, que cria uma API REST fake;

<details>
  <summary> PS: A responsividade foi feito nos seguintes tamanhos de tela: </summary>

  - 320px — 480px: dispositivos móveis
  - 481px — 768px: iPads, tablets
  - 769px — 1024px: telas pequenas, laptops
  - 1024px+ : telas grandes, monitores
</details>
</details>

<details>
  <summary > :us: English </summary>

## 1 - The application should have screens for creating, editing and listing products, with the following fields:
  
    - Name;
    - Manufacturing date;
    - Perishable product (boolean);
    - Expiration date;
    - Price;

## 2 - The user should only have access to the routes for creating, editing and listing products if he is authenticated;

## 3 - The user should only be able to register the expiration date if the product is perishable;

## 4 - The manufacturing date should never be greater than the expiration date;

## 5 - The price should be in reais (R$);

## 6 - The listing screen should have the possibility of sorting the fields and with a pagination of 10 products per page.

<details>
  <summary> PS: Responsiveness was done in the following screen sizes: </summary>

  - 320px — 480px: mobile devices
  - 481px — 768px: iPads, tablets
  - 769px — 1024px: small screens, laptops
  - 1024px+ : large screens, monitors
</details>
</details>



## ⚙️ Como executar - How to run
<details>
  <summary > :brazil: Portuguese </summary>
  <p>
    Para executar o projeto, você precisará ter instalado em sua máquina as seguintes ferramentas: Git, NodeJS (v16+). Além disto é bom ter um editor para trabalhar com o código como VSCode.
  </p>

  1. Faça um clone deste repositório:
  ```bash
  git@github.com:ItaloRAmaral/Dynamox-Teste-Front-End.git
  ```

  2. Entre no diretório do projeto, e depois troque para a branch do desafio:
  ```bash
  git checkout desafio-02-auth-
  ```

  3. Entre na pasta `desafio_02` que é onde se encontra a resolução do desafio.


  4. Instale as dependências
  ```bash
  npm install
  ```
 
  5. Execute a nossa fake api do json-server para simular o backend. Ele irá abrir na porta 3000.
  ```bash
  json-server --watch db.json
  ```

  6. Execute a aplicação do nosso front end.
  ```bash
  npm start
  ```

  7. O servidor inciará na porta:3001 - acesse <http://localhost:3001>
  </p>




</details>

<details>
  <summary > :us: English </summary>
  <p>
    To run the project, you will need to have installed on your machine the following tools: Git, NodeJS (v16+). In addition, it is good to have an editor to work with the code like VSCode.
  </p>

  1. Clone this repository:
  ```bash
    git@github.com:ItaloRAmaral/Dynamox-Teste-Front-End.git
  ```

  2. Enter the project directory, and then the change to challenge branch.
  ```bash
  git checkout desafio-02-auth-
  ```

  3. Enter the `desafio_02` folder where the challenge solution is located.

  4. Install the dependencies
  ```bash
    npm install
  ```

  5. Run the json-server fake api to simulate the backend. It will open on port 3000.
  ```bash
    json-server --watch db.json
  ```

  6. Run the front end application.
  ```bash
    npm start
  ```
  7. The server will start on port: 3001 - access <http://localhost:3001>

</details>