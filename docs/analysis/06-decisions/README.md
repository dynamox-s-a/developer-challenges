# Decisões de arquitetura (ADRs)

Registro das decisões estruturais do projeto: **por que** cada uma foi tomada, o que foi
descartado e o que ela custa. O formato é o clássico de Michael Nygard, com uma seção a
mais — *Evidência* —, para que cada ADR aponte o código que o comprova.

## A regra

- **ADR responde "por quê"**: contexto, decisão, alternativas rejeitadas, consequências.
- **Documento arquitetural responde "como" e "o que é hoje"**.

Se um ADR começar a explicar mecanismo, o mecanismo pertence ao documento irmão; se um
documento arquitetural começar a defender a escolha, a defesa pertence ao ADR.

Só existe ADR onde houve **decisão real com alternativa viável**. Não há ADR para escolhas
triviais nem para assuntos ainda em aberto — uma decisão pendente é registrada como
pendente no documento correspondente, e não maquiada de decisão tomada. Foi o caso da
semântica de condição do dashboard, que permaneceu aberta em
[`../01-dashboard/condition-monitoring.md`](../01-dashboard/condition-monitoring.md) até
ser decidida no [ADR-0011](./adr-0011-condition-policy-and-alert-occurrences.md).

## Índice

| ADR | Decisão | Status |
|---|---|---|
| [0001](./adr-0001-backend-authority.md) | Backend como autoridade de validação e autorização | Aceito |
| [0002](./adr-0002-postgresql-prisma.md) | PostgreSQL + Prisma | Aceito |
| [0003](./adr-0003-redux-toolkit-thunks.md) | Redux Toolkit com thunks, sem RTK Query | Aceito |
| [0004](./adr-0004-idempotent-ingestion.md) | Ingestão idempotente por chave no header + fingerprint do conteúdo | Aceito |
| [0005](./adr-0005-internal-contract-reduction.md) | Contrato interno como redução rastreável do contrato público | Aceito |
| [0006](./adr-0006-single-source-contract.md) | Fonte única para o validador e para o OpenAPI | Aceito |
| [0007](./adr-0007-server-side-query-contracts.md) | Paginação, ordenação, busca e filtros no servidor | Aceito |
| [0008](./adr-0008-synthetic-isolation.md) | Isolamento do ambiente sintético imposto por código | Aceito |
| [0009](./adr-0009-rest-source-of-truth.md) | REST como fonte de verdade; realtime adiado | Aceito (adiado) |
| [0010](./adr-0010-history-through-contract.md) | Histórico sintético pelo mesmo contrato de ingestão, no banco da aplicação | Aceito |
| [0011](./adr-0011-condition-policy-and-alert-occurrences.md) | Política de condição centralizada e versionada; alerta como episódio persistido (A1/A2, baseline aprendida, ledger exactly-once) | Aceito |
| [0012](./adr-0012-analytics-on-the-cycle-ledger.md) | Analytics contam aquisições pelo ledger de evidência por ciclo, com fonte explícita e fallback por amostras | Aceito |
| [0013](./adr-0013-windows-anchored-on-last-reading.md) | Janelas analíticas ancoradas na última leitura, não no relógio; recência continua contra o relógio real | Aceito |
