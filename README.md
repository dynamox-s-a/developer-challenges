# INSTRUÇÕES

## BACKEND

- O Backend foi implementado em Node.js com o framework Nest.js utilizando TypeScript como linguagem.
- A base de dados foi implementada em Postgre e foi utilizada a biblioteca Prisma para setup da estrutura e consumo da base.
- É necessária a criação de uma base de dados de acordo com as informações presentes no campo "datasource db" no arquivo "prisma/schema.prisma".

### COMANDOS

- npm install: para a instalação dos pacotes de dependência.
- npm install prisma --save-dev: para instalação do Prisma CLI.
- npx prisma migrate dev --name init: para o setup da estrutura do banco de dados de acordo com a estrutura do arquivo "prisma/schema.prisma".
- npx prisma db seed: para a inserção dos dados de teste na base de dados de acordo com a estrutura do arquivo "prisma/seed.ts".
- npm run start: para subir o backend.


- O servidor é acessível pela URL: http://localhost:3001
- Algumas URLs que podem ser consumidas:
  - http://localhost:3001/machine
  - http://localhost:3001/machine/2
  - http://localhost:3001/monitoring_point
  - http://localhost:3001/monitoring_point/1

### O QUE NÃO FOI FEITO
- Não consegui tempo para implementação dos testes unitários.
- Também não foi possível a utilização da ferramenta Nx para a unificação das aplicações de backend e frontend em uma única.


## FRONTEND

- O Frontend foi desenvolvido em React.js com o framework Next.js utilizando TypeScript como linguagem.
- Os componentes visuais foram implementados em Material UI.

### COMANDOS
- npm install: para a instalação dos pacotes de dependência
- npm run dev: para rodar a aplicação utilizando as dependências de desenvolvimento

- O servidor é acessível pela URL: http://localhost:3000
- A URL da API do backend está presente no campo "SERVER_URL" do arquivo "src/config.ts".

### O QUE NÃO FOI FEITO
- Tive um problema com o Redux e por isso não foi possível utilizar ele nem o Redux Thunk.
  - Na chamada da função createStore() estava recebendo o erro "Error: middleware is not a function". Pela documentação oficial essa função está depreciada e seria necessário utilizar a função configureStore(), porém mesmo assim o erro persistiu.
- Ao tentar usar o "state" padrão do React me deparei com o problema do CORS nas requisições da API e mesmo testando algumas configurações no Next não consegui fazer funcionar.
- Com isso, infelizmente o frontend não está conectado ao backend. O frontend está utilizando apenas dados estáticos.
  - As operações de listagem e exclusão estão funcionando, porém as de criação e edição não.
  - Minha ideia era criar a lógica dessas telas usando o Redux, mas como perdi muito tempo tentando fazer ele funcionar e também tentando resolver o problema do CORS, não tive tempo hábil para finalizar algumas lógicas.
- Com a perda de tempo com os problemas acima, não foi possível a implementação da regra de as máquinas do tipo "Pump" só poderem ter pontos de monitoramento com o sensores "HF+".
- Não foi possível a implementação dos testes e2e com o Cypress.