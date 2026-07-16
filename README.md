> 📋 **Solução deste desafio: [SOLUTION.md](./SOLUTION.md)** — como executar, arquitetura e decisões.
>
> TL;DR: `bun install && bun run dev` → http://localhost:3000/data

---

# Desafio de Desenvolvedor Front-end da Dynamox

A equipe de desenvolvimento front-end da Dynamox apresenta o seguinte desafio:

**Utilizando React e TypeScript, desenvolva uma aplicação de dashboard robusta e intuitiva que permita analisar os dados coletados por nossos sensores.**

---

Lembre-se de que o desafio visa reproduzir um ambiente onde você possa demonstrar suas habilidades.

Para orientar seu processo de desenvolvimento, forneceremos alguns requisitos. Não é obrigatório atender a todos os requisitos para enviar sua implementação. Quanto mais requisitos você implementar, mais elementos teremos para avaliar suas habilidades e conhecimentos.

Use seu bom senso para priorizar tarefas de acordo com o tempo disponível. Sinta-se à vontade para fazer quaisquer suposições que considere necessárias para concluir a tarefa.

## Requisitos Funcionais e Histórias de Usuário

Na indústria de manutenção, a análise de vibração desempenha um papel fundamental: ela utiliza grandezas físicas, como aceleração e velocidade, para identificar indícios que ajudem a prever a ocorrência de falhas ou degradações em máquinas.

A página que exibe essas informações no DynaPredict, nossa plataforma de monitoramento de condições de ativos, foi projetada de forma muito semelhante a [este modelo no Figma](https://www.figma.com/file/QxUZkTUIzQA7cvyiMvVyxK/Front-end---Teste?type=design&node-id=1001%3A3&mode=design&t=JLnbGmQJcSlnYYE2-1).

Utilize o Figma como referência para construir a interface e desenvolver as seguintes histórias de usuário:

1 - Histórias de Usuário

1. [ ] Como usuário, quero acessar a rota `/data` da minha aplicação e visualizar uma tela contendo um cabeçalho com informações sobre a máquina e alguns gráficos de série temporal.

1. [ ] Como usuário, quero visualizar 3 gráficos de série temporal para as seguintes métricas: aceleração, velocidade e temperatura. Cada série temporal deve apresentar um eixo horizontal para o tempo e um eixo vertical para a magnitude da métrica.

1. [ ] Como usuário, quero que os dados que alimentarão esses gráficos sejam buscados sempre que eu acessar a rota `/data`. Utilize os dados disponíveis em [Responses](./response-challenge-v2.json) como _mock_ e use um pacote como o [json-server](https://www.npmjs.com/package/json-server) para criar uma API REST.

1. [ ] Como usuário, quero passar o mouse sobre um ponto de um gráfico e ver uma linha de referência vertical (_crosshair_) marcando os _timestamps_ correspondentes em todos os gráficos de séries temporais, acompanhada de um _tooltip_ descrevendo aquele ponto. [Confira](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/synchronized-charts) um exemplo dessa funcionalidade.

2 - Requisitos técnicos

1. [ ] Utilize TypeScript.
1. [ ] Utilize React.
1. [ ] Utilize Redux para gerenciar estados globais. [Confira](https://redux-toolkit.js.org/introduction/getting-started) como começar.
1. [ ] Utilize Redux Saga para lidar com efeitos colaterais assíncronos. [Confira](https://redux-saga.js.org/docs/introduction/GettingStarted) como começar.
1. [ ] Utilize Vite para o _build_ da aplicação. [Confira](https://vitejs.dev/guide/) como começar.
1. [ ] Utilize Material UI 5 para estilizar a aplicação. [Confira](https://mui.com/material-ui/getting-started/) como começar.
1. [ ] Utilize Highcharts, Plotly, D3 ou qualquer biblioteca similar para exibir os gráficos. [Confira](https://www.highcharts.com/docs/index) como começar.
1. [ ] Garanta a lógica de negócio e o comportamento corretos por meio de testes unitários automatizados.

Incentivamos o uso das ferramentas da nossa _stack_ de _frontend_ para que o desafio se assemelhe às nossas tarefas do dia a dia.

3 - Bônus

1. [ ] Utilize Storybook para documentação. [Confira](https://storybook.js.org/docs) como começar.
1. [ ] Adicione testes E2E com Cypress. [Confira](https://learn.cypress.io/) como começar.
1. [ ] Faça o _deploy_ da sua aplicação em um provedor de nuvem e forneça o link da aplicação em execução. ## Critérios de Avaliação

Cada um dos itens acima será avaliado como "Não Implementado", "Implementado com Problemas", "Implementado" ou "Implementado com Excelência". Para avaliar diferentes perfis e experiências, esperamos que candidatos a níveis mais seniores demonstrem uma compreensão mais profunda dos requisitos e implementem uma quantidade maior deles dentro do mesmo prazo.

De modo geral, avaliaremos os seguintes pontos:

1. [ ] Qualquer pessoa deve conseguir seguir as instruções e executar a aplicação.
1. [ ] O código do front-end está integrado com sucesso a uma API REST simulada (fake API).
1. [ ] As histórias foram implementadas de acordo com os requisitos funcionais.
1. [ ] Habilidades de resolução de problemas e capacidade de lidar com ambiguidades.
1. [ ] Qualidade, legibilidade e manutenibilidade do código.
1. [ ] O código está bem organizado e documentado.
1. [ ] O layout da aplicação é responsivo.

## Pronto para começar os desafios?

- Faça um _fork_ deste repositório para a sua própria conta no GitHub.
- Crie uma nova _branch_ usando seu primeiro e último nome. Por exemplo: `caroline-oliveira`.
- Após concluir o desafio, crie um _pull request_ para este repositório (https://github.com/dynamox-s-a/js-ts-full-stack-test) apontando para a _branch_ `main`.
- Receberemos uma notificação sobre o seu _pull request_, analisaremos sua solução e entraremos em contato com você.
  <br>
