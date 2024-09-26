Backend para projeto de monitoramento

### Tecnologias
As seguintes ferramentas foram usadas na construção do projeto:

- Node.js
- Express
- MongoDB

### Rodando o BackEnd
Para inciar o BackEnd:

```
Entrar nba pasta backend;

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor inciará na porta: 3000
# O processo se inicia no localhost do mongoDB inicialização em seu sistema operacional precisa ser confirmada. 
```

## Instalação do mongDB (para uso "localhost:27017")
```
Caso linux (WLS ou servidor)
seguir passos => https://www.mongodb.com/pt-br/docs/manual/tutorial/install-mongodb-on-ubuntu/
Caso Windows 
seguir passos => https://www.mongodb.com/pt-br/docs/manual/tutorial/install-mongodb-on-windows/#std-label-install-mdb-community-windows
```

## Frontend

Ferramentas utlilizadas:
```
Styled-Components;
moment;
Context;
VITE;
```

Inicializando:
```
Entrar nba pasta machinesFront;

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev
```

### Backlog

Com mais tempo e conhecimento poderia inserir, com auxílio de ferramentas de UX como Figma, 
um design vizual apropriado com a idea em mente de melhorar a experiancia do usuário e a melhorar a usabilidade para o 
frontend com design mais interativo e atrativo. 

Inserir mais alguns "guards" de rotas para o front e uma definição mais clara para qual seriam as responsabilidades dos usuários da plataforma.
com um "set" perfis definido integrar este nas proteções de rotas do backend dando acesso restrito também à essas rotas trazendo mais segurança ao usuário final.

Acrecentando no formulário de machinas as guardas necessárias para que não apareça opções que não são compativeis com o tipo "Pump" como pedido. um simples check da listagem
dos sensores para que nem apareçam como opção para a seleção.
