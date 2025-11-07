# Teste para QA em aplicações web
Neste desafio vamos avaliar sua capacidade de desenvolver testes automatizados para uma aplicação web responsável por exibir dados de um sensor de vibração e temperatura.

Considere o seguinte fluxo de desenvolvimento. A equipe de Produto elaborou os requisitos funcionais e disponibilizou o seguinte [arquivo](https://www.figma.com/file/QxUZkTUIzQA7cvyiMvVyxK/Front-end---Teste?type=design&node-id=1001%3A3&mode=design&t=JLnbGmQJcSlnYYE2-1) contendo o protótipo da tela. Os requisitos de produto são:

1. Como usuário, quero visualizar uma tela contendo um pequeno cabeçalho com informações sobre a máquina e alguns gráficos. 
2. Como usuário, quero visualizar 3 gráficos de séries temporais de Aceleração RMS, Velocidade RMS e Temperatura.
3. Como usuário, quero que os dados estejam atualizados a cada novo acesso à página.
4. Como usuário, ao realizar um *hover* nas séries temporais, visualizo uma tooltip com os valores dos dados.

Para a obtenção dos dados, são feitas as seguintes requisições:
- **GET** para a rota */data*. Contém dados de séries temporais que serão exibidos nos gráficos. Para fins deste teste, os dados são estáticos.
- **GET** para a rota */metadata*. Contém informações associadas ao ponto de monitoramento que serão exibidas no cabeçalho.

A aplicação web está disponível neste [link](https://frontend-test-for-qa.vercel.app/).

## Requisitos do teste

Os requisitos de produto representam macrojornadas, portanto considere também detalhes na implementação.
- O usuário consegue completar esta jornada?
- A implementação atende todas as especificações do protótipo?
- Existem comportamentos estranhos ou não esperados?

Implemente testes automatizados para cada cenário que você julgar apropriado. É esperado que os testes passem onde os critérios foram atendidos, e que falhem onde não foram atendidos.

## Critérios de avaliação

Os seguintes itens serão avaliados:
- Organização e estrutura do repositório de testes.
- Documentação e legibilidade de código.
- Qualidade e cobertura dos testes.

Considere também: 
- Encontrou um defeito e não sabe como criar um teste automatizado neste cenário? Descreva como você relataria o problema para o desenvolvedor.
- Encontrou um requisito de produto não especificado no protótipo? Descreva como você relataria para o designer.
- Não existe um número mínimo e máximo de testes. Encontre um número que equilibre robustez do software e tempo de execução de testes.
- O framework utilizado fica a seu critério.

## Como submeter a avaliação
- Crie um branch remota com o seu nome;
- Clone o repositório localmente;
- Implemente o código na sua branch local;
- Suba as alterações para sua branch remota;
- Quando concluir o teste, comunique o seu contato do processo seletivo.
