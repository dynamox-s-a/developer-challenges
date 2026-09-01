# ADR-0009 — REST como fonte de verdade; realtime adiado

**Status:** Aceito (adiado)

## Contexto

Um painel de monitoramento de condição sugere naturalmente atualização em tempo real. A
ingestão já acontece em lotes frequentes e o dashboard já lê séries e métricas.

Ao mesmo tempo, o produto tem exatamente um consumidor de tela, roda localmente, e o valor
do desafio está na cadeia de dados — contrato, idempotência, domínio, persistência,
consulta. Um canal de tempo real acrescentaria uma segunda semântica de entrega (ordem,
reentrega, reconexão, autenticação do socket) para um ganho que hoje é estético.

## Decisão

**REST + PostgreSQL permanecem a fonte de verdade.** Realtime fica registrado como
evolução futura, com o desenho pretendido e o ponto de encaixe identificado — e **nenhum
código**: não há WebSocket, gateway ou dependência de socket neste repositório.

Quando for implementado, o socket será um canal de **notificação** ("a série X mudou"), e o
cliente continuará buscando o dado pelo mesmo contrato REST. Costura natural: publicar um
evento **após** a transação de ingestão em `telemetry.service.ts` — antes do commit, o
evento anunciaria algo que ainda pode ser desfeito.

## Alternativas consideradas

- **WebSocket agora, empurrando o dado.** Rejeitada: criaria um segundo caminho de leitura
  com semântica própria, competindo com o histórico do banco. Divergência entre o que o
  socket entregou e o que a consulta devolve é uma classe de bug cara.
- **Polling curto no frontend.** Rejeitada: custo de leitura sem ganho perceptível — o
  dashboard já baixa métricas e amostras de todas as séries.
- **Server-Sent Events.** Não descartada em definitivo: para notificação unidirecional é
  mais simples que WebSocket e continua compatível com a decisão de manter o REST como
  fonte. Fica como opção de implementação, não como decisão tomada.

## Consequências

- O dashboard atualiza por consulta; a "última leitura" mostrada é a do último carregamento.
- Nenhum estado de conexão precisa ser modelado no frontend, e a autorização continua sendo
  uma só (o `Bearer` do REST).
- O caminho de evolução é aditivo: o socket entra ao lado do REST, sem reescrever leitura
  nem contrato.
- **Não afirmar realtime** é parte da decisão — ver
  [`../05-simulation/simulation-vs-real.md`](../05-simulation/simulation-vs-real.md).

## Evidência

- Ausência verificada: nenhuma ocorrência de `websocket`, `socket.io` ou
  `@nestjs/websockets` em `apps/`, `libs/`, `simulation/` ou nos manifestos de dependência.
- `apps/api/src/telemetry/telemetry.service.ts` — a transação de ingestão, onde o evento
  seria publicado após o commit.
- `apps/web/src/features/dashboard/dashboardSlice.ts` — o carregamento por consulta que o
  socket complementaria.
