# Dynamox Developer Challenges

### [Dynamox Full-Stack Developer Challenge](./full-stack-challenge.md)

</br>

Um desafio técnico proposto pelo time da Dynamox que consiste em desenvolver uma aplicação Full-Stack. O back-end deve registrar, mostrar e deletar usuários, sensores e ativos. O front-end deve consumir do back e permitir que o usuário faça seu registro, login e logout da conta. O usuário também deve pode criar, visualizar e deletar ativos industriais, bem como para os sensores. Cada sensor deve ter um ativo associado, e um ativo pode ter vários sensores.

### Tecnologias

 - NextJS
 - Material UI
 - Redux
 - Redux Thunk
 - NodeJS
 - PostgreSQL
 - Prisma ORM
 - Typescript
 - Docker

### Como executar

Para rodar a aplicação é necessário ter o [Docker](https://docs.docker.com/engine/install/) e [Docker Compose](https://docs.docker.com/compose/) instalados .

Após clonar o repositório, entre na pasta raiz do projeto e execute no terminal
```bash
docker-compose up
```

> Por padrão a porta **3000** será usada no front-end e a porta **3001** no back-end.

**ATENÇÃO** se precisar usar portas diferentes, faça as alterações necessárias no `docker-compose.yml` na raiz do projeto e nos arquivos `Dockerfile` nas subpastas ./front e ./back

### Arquitetura - Back-end

Optou-se pela metodolgia em camadas com separação em Controllers, Services e Model, sendo a camada de Model administrada pelo Prisma ORM.

- `/src/routes/index.js`: é o arquivo que deverá agrupar todas as rotas através de importações

- `/src/routes`: é a pasta que contém os arquivos com cada rota. Os arquivos de rotas são agrupadas por endpoint, sendo os diferentes métodos presentes no mesmo arquivo. Ex.: a rota `DELETE /sensor` e `POST /sensor` devem estar dentro do arquivo `sensorRoutes.js`

- `/src/controllers`: os controllers devem chamar a camada de service e devolver a resposta para o usuário

- `/src/services`: as services devem aplicar as regras de negócio existente e chamar a camada de model

- `/primsa/schema.prisma`: a camada de model é administrada pelo PRisma, sendo assim, esse arquivo deve conter o espelho do banco utilizado

### Arquitetura - Front-end

O front foi construído em NextJS 14, Material UI para aplicação de estilos e uso de componentes, Redux para gerenciamento de estado, Redux Thunk para gerenciar estados assíncronos. Também é utlizado os cookies do navegador para armazenamento do token da sessão

 - Partiu-se do template do MUI [Devias Kit](https://mui.com/store/items/devias-kit/) para aceleração do processo

### Backlog

Próximas etapas e pontos a serem melhoradas

 - Autenticação do usuário no back-end com geração de token via JWT

 - Implementação de middleware no back-end para autenticação do usuário para realizar as requisições

 - Implementação de middleware no back-end para validação dos campos nas requisições

 - Tratamento de todos os possíveis erros no front-end

 - Devolutiva dos erros e criação de componente de loading para melhor experiência do usuário

 - Desenvolvimento de testes para assegurar qualidade da aplicação