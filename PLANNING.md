# Planejamento

A ideia a principio é fazer um sistema simples com técnologias integradas para evitar quaisquer tipos de problemas futuros com a aplicação. Por mais da simplicidade, uma boa experiencia de usuário vem a cima de tudo quando estamos falando de frontend e backend

## Discussão: Stack

A principio comecei com a ideia de utilizar uma stack Vite + Fastify, que eu já estava habituado. Mas após ler mais a documentação referente ao desafio, achei que seria mais condizente fazer um monorepo, por conta disso, tive uma ideia de modificar a stack para Vite + TRPC, mas ainda assim, não conseguiria fazer um monorepo de uma forma eficiente, então depois de pesquisar um pouco, cheguei a conclusão que talvez NextJS + TRPC seria a melhor opção, dessa forma consigo manter uma tipagem limpa e UNICA entre frontend e backend, uma tipagem e2e. 

Porém, faz um bom tempo que não vi nada sobre TRPC e afins, por conta disso, tive dificuldade de implementar, além disso, nunca tinha feito um projeto em NextJS, então deixei a ideia do TRPC de lado no momento para focar em fazer, de fato, a aplicação. Utilizei o NextJS para fazer o fullstack, utilizei o `fetch()` disponibilizado para a criação dos hooks da aplicação.

## Discussão: Type Hell

Devido a ter uma certa experiencia com programação, fui montando a codebase conforme as features iam aparecendo, mas, devido ao fato de eu estar meio enferrujado com Typescript, não percebi que estava aninhando muitos tipos e criando tipos privados e globais para todos os lados, depois de pensar um pouco, fiz uma refatoração completa na tipagem da aplicação, que pode ser vista em `/types`