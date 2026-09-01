# Mapa mental — Sensor digital Dynamox

> **HISTÓRICO — este documento descreve uma etapa anterior do projeto e não
> representa a arquitetura atual.** O papel de mapa de navegação passou a ser do
> mapa da arquitetura; Fuzzy e forecast **não existem** no sistema.
> Para o sistema como ele é hoje, comece por
> [`../../00-overview/architecture-map.md`](../../00-overview/architecture-map.md).

> **⚠️ Nota de auditoria (29/08/2026).** O "futuro sensor digital" deste mapa foi
> entregue com outra forma: `simulation/sensor-twin/` (BON-06 v3.1). Fuzzy e forecast
> **não existem**. Estado atual: [matriz de evidências](../../07-validation/traceability.md).

Mapa de navegação da análise SCP-05 e do futuro sensor digital. Compatível com Obsidian
(bloco Mermaid `mindmap`). Os detalhes vivem nos relatórios técnicos linkados ao final —
este mapa não os substitui. Para uma demonstração concreta, comece pelo
[walkthrough da P-101](./dynamox-p101-visual-walkthrough.md).

```mermaid
mindmap
  root((Sensor digital Dynamox))
    Fontes
      Snapshot OpenAPI 2.4.7 versionado
        44 paths e 45 operacoes
        SHA-256 cc6e0f07
      Contrato interno SCP-04
      Exemplo P-101
      Prisma e testes locais
      Paginas externas nao versionadas
        Fora da base factual
    Perfis de sensores
      TcAg
        Rates 2520 e 5040 Hz
        MVP somente telemetria escalar
        Waveform em conflito Q9
      TcAs
        Preset MVP 5040 Hz x 4096
        Nyquist 2520 Hz derivado
      HF mais
        Preset MVP 26290 Hz x 8192
        Nyquist 13145 Hz derivado
        Perfil da bomba P-101
      Maximos so por configuracao explicita
      HF mais s ausente do snapshot
    Endpoints
      Contexto
        workspaces e assets
        monitoring points com rpm e slug
      Provisionamento
        measuring systems
        configuration slots e associate
      Ingestao
        telemetry cycles
      Telemetria escalar
        metric descriptor
        data points raw e aggregation
      Waveform
        lista com divergencia de schema
        raw e spectrum presos a acceleration g
        metrics triaxiais
      Diagnostico e alertas
        automatic diagnostics
        alert policies e historico
    Telemetria
      Escrita timestamp
      Leitura datetime
      Value number boolean e integer
      Booleanos nao viram numero
        NormalizationResult unsupported
        rawValue e origem preservados
      Idempotencia local por fingerprint
    Waveforms
      Dados densos nao viram metricas
      Settings confirmados
        samplingRate e samples por modelo
        axis x y z booleanos
        duration igual samples sobre fs
      Arrays com items sem tipo
        number como hipotese dos examples
      Sinal x y z anulavel
      Espectro com frequency
    Normalizacao
      NormalizedMetric numerico
        axis explodido por eixo
        value nulo preservado
        unit nula em adimensional
        samplingRateHz e sourceRef
        evidenceLevel
      WaveformAcquisitionContext
        join pelo waveformId
        startedAt vira timestamp
        sem contexto falha explicita
        ids nunca inventados
      Convencao de nomes de metrica
      Fronteira densa para normalizada para Fuzzy
    Cenarios simulados
      Normal
      Degradado
      Anomalo
      Incompleto com nulos
      Seed deterministica
      Walkthrough P-101 degraded seed 42
    Sistema Fuzzy futuro
      Recebe apenas NormalizedMetric
      Ignora nulos explicitamente
      Severidade no alert a1 a2
      Fault status separado
      Consecutive como debounce
      Limiar local declarado arbitrario
    Duvidas e limitacoes
      Dominios de evaluator band e processing
      Banda util real desconhecida
      Composicao entre conditions
      Forma real da lista de waveforms
      Sem compatibilidade produtiva
```

## Navegação

- [Comece aqui — README da análise](../../README.md)
- [Walkthrough visual da P-101](./dynamox-p101-visual-walkthrough.md) — a demonstração
  concreta: máquina → mancal → sensor HF+ → waveform → métricas → Fuzzy.
- [Mapeamento Sensor × API](../../04-contracts/dynamox-sensor-api-mapping.md) — inventário, perfis, matriz
  de campos, `NormalizedMetric`, política booleana, decisão GO COM RESTRIÇÕES.
- [Auditoria de drift](../../04-contracts/dynamox-contract-drift.md) — inconsistências da spec, nulabilidade,
  arrays não tipados, fonte canônica por assunto.
- [Blueprint do sensor digital](./dynamox-digital-sensor-blueprint.md) — perfis, presets do
  MVP, `WaveformAcquisitionContext`, cenários, seed, regras de nulos, entradas do Fuzzy.
- [Inventário de endpoints](../../04-contracts/dynamox-endpoint-inventory.json) — extração fiel e
  reproduzível (`npm run analysis:inventory`).
- [Contratos SCP-04](../../../../contracts/dynamox/README.md) — snapshot, schema interno e
  decisões de idempotência.
