# ADR-0008 — Isolamento do ambiente sintético imposto por código

**Status:** Aceito

## Contexto

O projeto usa o vocabulário, o formato de payload e a especificação de uma plataforma real.
Ele também gera telemetria sintética em volume. Dois riscos decorrem disso:

1. **operacional** — uma variável de ambiente mal configurada apontar um cliente para a
   plataforma produtiva e enviar dados sintéticos para lá;
2. **de comunicação** — alguém concluir, ao ler o repositório, que houve integração real
   com a Dynamox.

Um aviso em README não previne nenhum dos dois.

## Decisão

O isolamento é imposto **por código**, nos dois clientes capazes de fazer rede, e o
vocabulário do projeto declara a natureza sintética dos dados.

- `assertLocalApiBaseUrl` (frontend) recusa URL inválida e qualquer host
  `*.dynamox.solutions` / `*.dynamox.net`.
- `assertLocalBaseUrl` (sensor twin) recusa os mesmos domínios **e** qualquer host que não
  seja `localhost` / `127.0.0.1`.
- Ambos são executados na inicialização e **lançam erro**: a aplicação não sobe apontando
  para o lugar errado.
- Da API pública consome-se apenas o **documento** de especificação, capturado por um `GET`
  sem credencial e versionado com hash; nenhum endpoint produtivo é chamado e nenhuma
  credencial existe no repositório.
- O payload declara a procedência (`metadata.origin`, `metadata.synthetic`), e o artefato
  de proveniência ROS verifica `origin: simulation` na reconstrução — um replay nunca
  aparenta aquisição física.

## Alternativas consideradas

- **Convenção + documentação.** Rejeitada: depende de todo mundo lembrar, sempre.
- **Bloquear só no twin** (o maior gerador de tráfego). Rejeitada: o frontend também lê uma
  base URL de ambiente e faria as mesmas chamadas autenticadas.
- **Lista de permissão configurável.** Rejeitada: uma lista editável é um bloqueio
  opcional; a recusa precisa ser mais difícil de remover do que de manter.

## Consequências

- Apontar qualquer um dos clientes para um host remoto exige **alterar código** — o que
  aparece em diff e em revisão.
- Nenhum teste, script ou comando toca a plataforma real; toda evidência vem do banco
  local.
- Um efeito colateral aceito: não é possível usar o frontend contra uma API remota de
  demonstração sem tocar o guard. Dado o objetivo do projeto, é o trade-off correto.
- A honestidade fica no vocabulário e no dado, não apenas na prosa: os limites do que o
  sistema afirma estão em
  [`../05-simulation/simulation-vs-real.md`](../05-simulation/simulation-vs-real.md).

## Evidência

- `apps/web/src/api/client.ts` — `assertLocalApiBaseUrl`, aplicada a `VITE_API_BASE_URL`.
- `simulation/sensor-twin/src/ingest.ts` — `assertLocalBaseUrl`, aplicada a `TWIN_API_URL`.
- `apps/web/src/api/client.spec.ts` — testes do guard do frontend.
- `simulation/sensor-twin/src/provenance.ts` — `origin: simulation` obrigatório e
  verificado.
- `contracts/dynamox/README.md` — proveniência do snapshot e ausência de credenciais.
