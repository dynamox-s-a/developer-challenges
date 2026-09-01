# ADR-0011 — Política de condição centralizada e alerta como episódio persistido

**Status:** Aceito

## Contexto

A camada de *condition monitoring* classificava cada ponto comparando a última aquisição
sincronizada com a anterior. A regra (1,5× observação, 2,0× atenção, 24 h de frescor) estava
duplicada em sete lugares — `analytics.service.ts`, `analytics.sql.ts`, `dashboardAggregations.ts`
e componentes com `>= 2` inline —, e o cliente **descartava** a classificação do servidor para
recalculá-la a partir dos números. Ao mesmo tempo, a decisão registrada como aberta em
[`condition-monitoring.md`](../01-dashboard/condition-monitoring.md) — "condição vira conceito
persistido ou continua derivada?" — precisava ser tomada para o produto ter alerta.

Medições no banco com o mês sintético carregado (33,6 k ciclos, 10,08 M amostras) moldaram o
desenho: a referência da condição (aquisição anterior) **nunca dispararia** numa rampa lenta
de 30 dias (razão entre aquisições consecutivas ≈ 1,003); o ruído do RMS radial por bin de
hora do dia é 0,6–0,8 % (CV); há ciclo térmico diário de ~11 °C; a cauda de demonstração foi
ingerida **antes** do histórico (idempotência por marca d'água pularia o mês inteiro); e um
sensor tem 24 ciclos de fumaça de junho (aprendizado "pelas primeiras 48 h" quebraria).

## Decisão

1. **Condição continua derivada e recalculável**, mas com uma única política versionada em
   `libs/domain/src/condition.ts` (`DEFAULT_CONDITION_POLICY`, `policyVersion: 1`). API e
   frontend classificam pela mesma função; o cliente passa a **confiar** em `condition` e
   `freshness` do servidor e o caminho local sobrevive só para os testes. `ConditionTag`
   permanece com esse nome: condição não foi renomeada para alerta.
2. **Alerta é um conceito distinto**: episódio persistido (`alert_occurrences`) com nível
   `A1 | A2`, estado da anomalia `ACTIVE | RESOLVED`, reconhecimento humano ortogonal
   (`acknowledgedAt/By/Level`), evidência do disparo, pico, última leitura e transições
   (`alert_events`). A interface deriva `open | acknowledged | resolved`. TELEMETRIA ≠ CONDIÇÃO
   ≠ ALERTA ≠ NOTIFICAÇÃO ≠ INSIGHT ≠ DIAGNÓSTICO — o tipo do alerta descreve a regra
   (`vibration-threshold`), nunca a causa ("rolamento").
3. **A referência do alerta é uma baseline aprendida por ponto** (192 ciclos de comissionamento,
   24 medianas por hora UTC, mediana global para bins fracos, reaprendida ao trocar o sensor)
   — não a "aquisição anterior" da condição. Consequência assumida e explicada na tela: um A1
   pode estar aberto enquanto a condição está "normal"; as duas leituras são verdadeiras.
4. **Alert Policy v1 deste projeto** (não prescrição de norma): vibração radial em razão à
   baseline com A1 1,5×, A2 2,0×, clear 1,4×; temperatura em delta com +5 °C / +10 °C / +3 °C;
   gatilho por 2 leituras consecutivas, resolução por 4; nível *latched* (A2 não rebaixa);
   presença com A1 após 4 intervalos de 15 min e A2 após 96, com **colapso de frota**
   (mais da metade dos pontos instrumentados mudos, sem episódio próprio, vira UM
   `FLEET_SILENT` — sem exigir simultaneidade: uma planta desliga máquina a máquina). ISO 20816-3 e
   SKF sustentam avaliar *mudança* contra uma baseline de comissionamento; ISA-18.2 sustenta
   deadband, atraso de disparo, latching e "mudança de prioridade exige novo reconhecimento";
   a plataforma de referência usa dois níveis A1/A2 com gatilho por medições consecutivas.
   Os números foram calibrados pelo comportamento medido do dataset. Mudar qualquer valor
   exige nova `policyVersion`.
5. **Idempotência e dedup pelo banco, sem exceção como fluxo de controle**: evidência física
   imutável por ciclo (`alert_cycle_evidence`) separada da avaliação versionada
   (`alert_rule_evaluations`, `UNIQUE(cycleId, ruleId, policyVersion)`, inserida com
   `ON CONFLICT DO NOTHING RETURNING` — sem linha de volta, nada é aplicado); estados por
   (regra, ponto) travados com `FOR UPDATE` em ordem determinística; `activeKey` única
   enquanto o episódio está ativo é a última defesa contra um segundo episódio.
6. **Ciclo mais antigo que a marca d'água não é descartado**: fica no ledger como
   `OUT_OF_ORDER`, detectável; `alerts:backfill` reconcilia com a mesma função de decisão e
   um relógio replayado. Toda data escrita é o tempo do dado — backfill e ingestão ao vivo
   produzem a mesma linha do tempo.
7. **Execução síncrona depois do commit da ingestão** (nunca altera a resposta ao produtor)
   mais **varredura de presença por timer** (`setInterval().unref()`, desligada sob Jest);
   sem fila, Redis ou Kafka.
8. **O motor nunca lê a verdade-terreno do gerador** (`metadata.history.groundTruth`,
   `configuration`, `scenario`); só o CLI de validação a lê, e um teste-guarda varre o
   diretório do motor para garantir isso.
9. **Os alertas de telemetria afirmam ausência, nunca causa.** `SENSOR_SILENT` significa "este
   ponto parou de reportar", não "o sensor quebrou"; `FLEET_SILENT` significa "perda ampla de
   telemetria", não trip, parada planejada nem falha de gateway. A interface usa esse
   vocabulário e o tooltip explica o que o alerta **não** afirma.
10. **`GET /alerts?from&to` é interseção**: `openedAt < to AND (resolvedAt IS NULL OR
   resolvedAt >= from)` — "o que estava acontecendo", não "o que abriu".
11. **Reconhecer só ADMIN** (regra padrão do guard para mutações), idempotente, permitido em
    episódio resolvido; **escalar A1 → A2 limpa o reconhecimento**.

## Alternativas consideradas

- **Persistir a condição como coluna.** Rejeitada: a condição é uma leitura da última
  aquisição contra a anterior — recalculável a qualquer momento e sem ciclo de vida.
  Congelá-la em banco versionaria uma classificação que muda a cada aquisição, sem ganhar
  o que um alerta dá (abertura, escalada, reconhecimento, resolução).
- **Alerta usando a referência da condição.** Rejeitada por medição: em rampa lenta a razão
  entre aquisições consecutivas fica em ~1,003 e nunca cruza 1,5. Só uma baseline de
  comissionamento enxerga a mudança acumulada (ISO 20816-3 / SKF).
- **Baseline escalar por ponto.** Rejeitada: o ciclo térmico de ~11 °C e a modulação de
  carga fariam a tarde parecer deriva. Baseline por hora do dia (24 medianas) resolve com
  o dado que já existe.
- **Aprendizado "pelas primeiras 48 h"** (relógio). Rejeitada: SIM-HF-003 tem 24 ciclos de
  junho; contagem de ciclos com evidência é robusta a lacunas e fumaça.
- **Idempotência por marca d'água apenas.** Rejeitada: a cauda de demonstração foi ingerida
  antes do histórico; um ledger por (ciclo, regra, versão) é o único exactly-once possível.
- **`catch P2002` como dedup.** Rejeitada por decisão do usuário: constraint é garantia
  final; o fluxo normal usa `ON CONFLICT` + `FOR UPDATE`.
- **Um `SENSOR_SILENT` por ponto nas paradas de domingo.** Rejeitada: doze linhas vermelhas
  para um fato operacional ("a planta parou junto") escondem o único caso que importa (um
  sensor mudo sozinho). O colapso de frota é factual; distinguir parada planejada de falha
  de gateway exigiria calendário de operação — fora de escopo, registrado como limitação.
- **Nomear os alertas de telemetria pela causa** ("sensor com defeito", "parada", "falha de
  gateway"). Rejeitada: o motor observa AUSÊNCIA de dado e nada mais. A causa pode ser
  sensor, gateway, rede, energia, máquina parada ou manutenção, e escolher uma delas seria
  diagnóstico inventado. Daí os rótulos "Ponto sem telemetria" e "Perda ampla de telemetria",
  e a descrição factual "mais de 50 % dos pontos monitorados deixaram de reportar dentro da
  janela esperada".
- **Alerta de RPM / parada inesperada.** Adiado: não há modelo de expectativa operacional
  (rpm 0 não existe no dataset — a parada é ausência de ciclo); seria inventar semântica.
- **Alerta espectral.** Extension point apenas: o contrato traz RMS por janela de 1 s, não
  espectro; um `thresholdMode` novo entraria pela mesma política versionada.
- **Notificação (e-mail/push), snooze, assignee, SLA, ML.** Fora desta rodada por escopo;
  a política de reenvio da plataforma de referência (A2 → e-mail imediato, reenvio após
  24 h se persistir) confirma que notificação é conceito separado do episódio.

## Consequências

- O painel mostra dois conceitos lado a lado: "Ativos em atenção" (condição) e "Alertas
  abertos" (episódios). Com a rampa de SIM-HF-002 os dois concordam no fim do mês; durante
  a rampa, o alerta abre 13,5 h antes do rótulo do gerador (54 ciclos com `fault=true`
  que o rótulo ainda não chama de alerta) e a condição ainda diz "normal" — comportamento
  esperado e documentado, não bug.
- Temperatura tem 31 falsos negativos (7,8 h) em relação ao rótulo: o rótulo dispara em
  +4 °C didáticos, a política em +5 °C sustentados. Registrado honestamente em
  [`alert-validation.md`](../07-validation/alert-validation.md); ajustar o limiar é uma
  `policyVersion` nova, não uma edição silenciosa.
- Carregar o histórico com a API viva e o motor ligado gera `OUT_OF_ORDER` em massa;
  a recuperação é `alerts:backfill --reset --yes`. A ordem recomendada está em
  [`docs/SETUP.md`](../../SETUP.md).
- Fim de dataset é estado honesto: sem aquisição desde 30/08, a varredura ao vivo abre
  `FLEET_SILENT` ("planta sem telemetria") e mantém enquanto durar.
- A baseline presume máquina sadia no comissionamento; instalar o motor numa máquina já
  degradada embute o defeito na referência (limitação da abordagem, não do código).

## Evidência

- Política de condição: `libs/domain/src/condition.ts`; testes de caracterização
  `apps/api/src/analytics/condition.spec.ts`, `apps/web/src/features/dashboard/dashboardAggregations.spec.ts`.
- Domínio de alertas: `libs/domain/src/alerts.ts`; schema `prisma/schema.prisma` (enums e
  tabelas `alert_*`), migrações `20260831131028_alerts_domain`, `20260831140000_alert_evaluations_cycle_fk`.
- Motor puro e tabelas de casos: `apps/api/src/alerts/core/`; execução transacional
  `apps/api/src/alerts/alert-engine.ts`; e2e `apps/api/test/alerts.e2e-spec.ts`; guarda de
  vazamento `apps/api/src/alerts/leakage.spec.ts`.
- Backfill e validação: `apps/api/src/alerts/backfill.cli.ts`, `validate.cli.ts`; relatório
  `docs/analysis/07-validation/alert-validation.md`.
- API e UI: `apps/api/src/alerts/alerts.controller.ts`; `apps/web/src/pages/alerts/`,
  `apps/web/src/components/alerts/`, `apps/web/src/pages/alerts/alerts.spec.tsx`.
