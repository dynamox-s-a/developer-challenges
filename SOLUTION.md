# Solução — Desafio Front-end Dynamox

Dashboard de análise de vibração: rota `/data` com cabeçalho da máquina e três séries temporais
(aceleração, velocidade e temperatura) com crosshair e tooltip sincronizados entre os gráficos.

## Como executar

Pré-requisito: [Bun](https://bun.sh) 1.3+ (`curl -fsSL https://bun.sh/install | bash`).

```bash
bun install
bun run dev
```

Isso sobe os dois apps em paralelo:

| Serviço  | URL                             |
| -------- | ------------------------------- |
| Frontend | http://localhost:3000/data      |
| API      | http://localhost:3333/api       |
| Docs API | http://localhost:3333/api/docs  |

Para rodar separadamente: `bun run dev:backend` e `bun run dev:frontend`.

Verificação:

```bash
bun run test       # 59 testes (12 backend + 47 frontend)
bun run typecheck
bun run build
```

Variáveis de ambiente são opcionais — os padrões já apontam para o ambiente local.
Veja `apps/*/.env.example`.

## Estrutura

```
├── packages/
│   └── contracts/         # fonte da verdade: rotas oRPC + schemas Zod
└── apps/
    ├── backend/           # implementa o contrato, lê os mocks JSON
    └── frontend/          # consome o contrato (Vite + React + Redux Saga)
```

O pacote `contracts` fica **fora de `apps/`** de propósito: ele não é uma aplicação, é o
acoplamento entre as duas. O backend implementa esse contrato e o frontend o consome, então
tipos e validação fluem dos dois lados sem geração de código e sem duplicar tipo nenhum.
Mudar um schema quebra o build de quem estiver desalinhado — que é exatamente o objetivo.

### Backend

Clean Architecture com injeção de dependência por _factory function_:

```
presentation → application → domain ← infrastructure
```

`domain/` e `application/` são puros: não importam `@orpc/*` nem conhecem JSON, HTTP ou o
formato do mock. oRPC vive só em `presentation/`, e a leitura dos arquivos só em
`infrastructure/`. É por isso que os casos de uso são testáveis mockando apenas o repositório.

Trocar os mocks por um banco real significa trocar a implementação do repositório e a linha
correspondente no `container.ts` — nenhuma regra de negócio muda.

### Frontend

- **Estado global (Redux Toolkit):** máquina selecionada, período e séries carregadas.
- **Efeitos assíncronos (Redux Saga):** `watchFetchMachines` e `watchFetchMeasurements`, ambos
  com `takeLatest` — trocar de máquina rápido cancela as buscas anteriores, então uma resposta
  atrasada nunca sobrescreve a seleção atual.
- **Transporte:** todo o acesso à API passa por `lib/orpc-client.ts`. Nenhum componente conhece
  URL ou header.
- **Filtros na URL:** máquina e período vivem em `?machine=MCH-003&period=7d`, então a tela é
  compartilhável e sobrevive ao refresh.
- **UI:** tema e componentes do [Minimals](https://minimals.cc) v7.5.0 portados para Vite
  (o kit original é Next.js).

## Decisões e trade-offs

**Um único fetch por acesso à rota.** A rota `/data` busca as 7 séries do sensor de uma vez, em
vez de uma requisição por gráfico. São 181 pontos por série — o custo de trazer tudo é menor que
o de três _round-trips_, e garante que os três gráficos exibam exatamente a mesma janela de
tempo (requisito do crosshair sincronizado).

**Margem fixa nos gráficos.** Todos os gráficos usam `marginLeft` fixo. Não é estética: a
sincronização localiza o ponto de cada gráfico pela coordenada X em pixels. Deixando o
Highcharts dimensionar cada margem pelo tamanho do próprio rótulo do eixo Y (`0.1` contra `15`),
as áreas de plot ficam deslocadas entre si e o mesmo X aponta para instantes diferentes — o
crosshair mente. Isso apareceu em teste manual: os gráficos reportavam 02:03 e 07:03 para o
mesmo cursor.

**Período ancorado na última leitura.** Os dados do mock terminam em dezembro de 2023. Ancorar
"últimos 7 dias" em `Date.now()` devolveria uma tela vazia, então a âncora é o `lastReadingAt`
da máquina.

**Filtros hidratados da URL uma única vez.** A sincronização é assimétrica de propósito: a URL
alimenta a store no mount, e só a partir daí a store passa a escrever na URL (`replace`, para
não empilhar histórico a cada clique). Sincronizar nos dois sentidos por efeito parece simétrico,
mas o efeito de escrita roda no mesmo commit com o estado ainda antigo e apaga os filtros do
link antes de eles serem aplicados — foi exatamente o que aconteceu na primeira tentativa.

**Estatísticas calculadas sobre a janela filtrada.** O "máximo do período" acompanha o recorte
escolhido pelo usuário, não a série inteira — é o número que ele espera ver ao filtrar.

**Três máquinas, um sensor.** O mock fornecido cobre um único sensor. As três máquinas existem
para exercitar a listagem e a troca de seleção, mas todas leem a mesma série; o ponto de
particionar por máquina está isolado no repositório.

## Requisitos

| Requisito                        | Situação                                              |
| -------------------------------- | ----------------------------------------------------- |
| Rota `/data` com cabeçalho       | ✅                                                     |
| 3 gráficos de série temporal     | ✅ aceleração (3 eixos), velocidade (3 eixos), temperatura |
| Busca a cada acesso à rota       | ✅                                                     |
| Crosshair + tooltip sincronizados| ✅                                                     |
| TypeScript                       | ✅ modo estrito, sem `any`                             |
| React                            | ✅ 19                                                  |
| Redux                            | ✅ Redux Toolkit                                       |
| Redux Saga                       | ✅                                                     |
| Vite                             | ✅ 7                                                   |
| Material UI                      | ✅ v7 — ver observação abaixo                          |
| Biblioteca de gráficos           | ✅ Highcharts 12                                       |
| Testes unitários                 | ✅ 59 testes                                           |
| Layout responsivo                | ✅                                                     |
| API REST simulada                | ⚠️ oRPC sobre os mocks, no lugar do `json-server`      |
| Storybook / Cypress / deploy     | ❌ bônus não implementados                             |

**Sobre o `json-server`.** O enunciado sugere `json-server` para servir
`response-challenge-v2.json`. A API aqui é um servidor oRPC próprio que lê o mesmo arquivo
(`apps/backend/src/mock/accelerationRms.json`) — nenhum banco de dados externo. A troca entrega
o que o `json-server` não daria: contrato tipado compartilhado com o frontend, validação Zod nas
duas pontas, filtros de verdade (`from`/`to`/`metrics`) e documentação OpenAPI automática. As
rotas continuam REST e podem ser chamadas com `curl`:

```bash
curl 'localhost:3333/api/machines'
curl 'localhost:3333/api/machines/MCH-001/measurements?metrics[]=temperature'
```

**Sobre o Material UI 5.** O enunciado pede MUI 5; a solução usa MUI 7, versão exigida pelo tema
do Minimals v7.5.0 (que depende da API de CSS variables e `colorSchemes`, ausente na v5).
Fixar a v5 significaria abrir mão do kit ou reescrever o tema.
