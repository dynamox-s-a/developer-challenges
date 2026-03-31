# Blueprint — Dynamox Back-end Challenge v2

> SSoT para a implementação do desafio `back-end-challenge-v2.md`.
> Última atualização: 2026-03-31

---

## 1. Contexto do Repositório

O repositório `developer-challenges` é mantido pela Dynamox e reúne desafios técnicos para diferentes perfis:

| Área | Desafios disponíveis |
|---|---|
| Full-Stack | Node.js+React, C#+React |
| Front-End | v1 (Marketing), v2 (Product) |
| Back-End | v1 (Time Series básico), **v2 (Signal Processing API) ← foco** |
| Mobile | Kotlin Multiplatform, Android, iOS |
| DevOps | DevSecFinOps v1 |
| QA | QA Challenge |

---

## 2. Perfis de Senioridade (README.md)

| Nível | Escopo | Resolução de Problemas | Mentoria |
|---|---|---|---|
| Junior | Individual (com supervisão) | Problemas diretos e bem definidos | Foco em aprendizado |
| Mid-level | Time (autonomia moderada) | Problemas moderados, alguma ambiguidade | Apoia juniores, code reviews |
| Senior | Organização (liderança técnica) | Problemas intrincados, alta ambiguidade | Mentoria ativa, define padrões, influência estratégica |

> **Implicação direta:** avaliação graduada ("Not Implemented" → "Implemented with Excellence"). Para perfil **senior**, espera-se todos os requisitos principais + bônus com profundidade técnica demonstrada no histórico de commits e no PR.

---

## 3. O Desafio — back-end-challenge-v2.md

### User Stories

| # | História | Endpoint |
|---|---|---|
| US1 | Armazenar uma série de dados brutos | `POST /api/time-series` |
| US2 | Recuperar métricas sobre a série temporal | `GET /api/time-series/:id/metrics` |
| US3 | Deletar uma série temporal | `DELETE /api/time-series/:id` |
| US4 | Recuperar o número de séries armazenadas | `GET /api/time-series/count` |
| US5 | Recuperar a série temporal completa | `GET /api/time-series/:id` |

> **Atenção de ordem:** a rota `/count` deve ser registrada **antes** de `/:id` no roteador para não ser interpretada como parâmetro.

### Requisitos Técnicos

| # | Requisito | Status |
|---|---|---|
| 1 | Node.js | Obrigatório |
| 2 | Framework REST (NestJS sobre Express) | Obrigatório |
| 3 | Latência < 350ms em todas as requisições | SLA obrigatório — validado com k6 |
| 4 | MongoDB 6.0+ com Time Series Collections | Obrigatório |
| 5 | Testes unitários automatizados (Jest) | Obrigatório |

### Bônus

| # | Bônus | Prioridade |
|---|---|---|
| 1 | Deploy em cloud provider (fornecer URL) | Alta |
| 2 | Kafka com Docker + Makefile documentado | Alta (maior diferencial senior) |
| 3 | Load balancer | Média |
| 4 | Load tests (k6) | Alta — prova o SLA de 350ms |

---

## 4. Análise do `response-challenge-v2.json`

### Estrutura

Array JSON com **7 séries temporais** (5103 linhas):

```
accelerationRms/x | accelerationRms/y | accelerationRms/z
velocityRms/x     | velocityRms/y     | velocityRms/z
temperature
```

Cada série:
```json
{
  "name": "accelerationRms/x",
  "data": [
    { "datetime": "2023-11-07T11:53:38.187Z", "max": 0 }
  ]
}
```

### Este arquivo é input ou output?

**É o formato de saída (response) — não o input bruto.**

| Ponto | Avaliação |
|---|---|
| Contrato do endpoint US2 (métricas) | ✅ Sim — `name` + `data[]{datetime, max}` |
| Define implicitamente o schema do input | ✅ Parcialmente — sensores nomeados + timestamp + valor |
| Challenge define explicitamente o formato do input | ❌ Não — schema do POST é livre |
| Serve como fixture de testes | ✅ Sim — ideal para seed e testes de integração |

**Implicação:** o campo `max` indica agregação por janela temporal. A API deve calcular `max` (obrigatório pelo contrato) + `RMS`, `Kurtosis`, `Skewness` (diferencial senior de domínio industrial).

---

## 5. Decisões de Arquitetura

### Stack Consolidada

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Runtime | Node.js 20 LTS | Requisito do challenge |
| Framework | **NestJS** | Modules = Bounded Contexts; DI nativo; visibilidade DDD imediata |
| Banco | **MongoDB 6.0+ Time Series Collections** | Otimização nativa para dados de sensores (bucket pattern automático) |
| Validação | **class-validator + class-transformer** | Nativo NestJS; DTOs declarativos como Value Objects |
| Testes | **Jest + @nestjs/testing + Supertest** | DI override para unit; Supertest para e2e |
| Kafka | **@nestjs/microservices + KafkaJS** | Integração first-class; key=sensorId preserva ordem |
| Load tests | **k6** | Scripts em JS; prova SLA < 350ms com 100 rps |
| Containers | **Docker multi-stage + Makefile** | Imagem enxuta; targets documentados (bônus obrigatório) |

### Por que NestJS em vez de Express puro

1. **Modules = Bounded Contexts** — a estrutura DDD fica explícita por inspeção
2. **DI nativo** (`@Injectable`, `@Inject`) — inversão de dependência real, sem composição manual
3. **class-validator** — Value Objects e DTOs com decorators declarativos
4. **Interceptors/Filters/Pipes** — cross-cutting concerns padronizados
5. **@nestjs/microservices** — Kafka integrado sem boilerplate
6. **@nestjs/testing** — TestingModule com DI override para mocks

### Mapeamento DDD → NestJS

| Conceito DDD | Implementação |
|---|---|
| Bounded Context | `TimeSeriesModule` (NestJS Module) |
| Entity | `time-series.entity.ts` (classe pura com métodos de domínio) |
| Value Object | Classes em `domain/value-objects/` com `class-validator` |
| Repository (interface) | Interface abstrata em `domain/repositories/` |
| Repository (impl) | `@Injectable()` em `infrastructure/database/` |
| Domain Service | `signal-processing.service.ts` (funções puras, sem DI) |
| Application Service | Use cases `@Injectable()` em `application/use-cases/` |
| DTO | `class-validator` + `class-transformer` em `application/dtos/` |
| Inversão de Dependência | `{ provide: 'TIME_SERIES_REPOSITORY', useClass: MongoTimeSeriesRepository }` |

### Modelagem MongoDB (Time Series Collection)

```js
// Criação da collection com configuração de time series
db.createCollection("timeSeries", {
  timeseries: {
    timeField: "datetime",
    metaField: "metadata",   // { sensorId, name, unit, sampleRate }
    granularity: "seconds"
  }
})
```

**Input POST body (design próprio — coerente com o output):**
```json
{
  "name": "accelerationRms/x",
  "sensorId": "sensor-001",
  "sampleRate": 1000,
  "unit": "g",
  "data": [
    { "datetime": "2023-11-07T11:53:38.187Z", "value": 0.0023 }
  ]
}
```

### Métricas de Domínio (Signal Processing)

| Métrica | Fórmula | Propósito |
|---|---|---|
| **Max** | `max(x_i)` por janela | Obrigatório — contrato do response JSON |
| **RMS** | `sqrt(sum(x_i²) / N)` | Energia total do sinal |
| **Kurtosis** | `(sum((x_i - μ)⁴) / N) / σ⁴` | Detecta impactos súbitos em rolamentos |
| **Skewness** | `(sum((x_i - μ)³) / N) / σ³` | Detecta assimetrias no sinal |

### SLA de Latência

O challenge exige **< 350ms** em todas as requisições. Estratégias:
- Time Series Collections (I/O otimizado nativamente)
- Índices em `datetime` e `metadata.sensorId`
- Aggregation pipeline para cálculo de métricas (em vez de cálculo em memória)
- k6 valida o SLA com relatório nos resultados do PR

---

## 6. Estrutura de Pastas

```
signal-processing-api/
├── src/
│   ├── domain/                                # Zero dependências externas
│   │   ├── entities/
│   │   │   └── time-series.entity.ts
│   │   ├── value-objects/
│   │   │   ├── sensor-name.vo.ts
│   │   │   ├── timestamp.vo.ts
│   │   │   └── measurement-unit.vo.ts
│   │   ├── repositories/
│   │   │   └── time-series.repository.ts      # Interface (contrato)
│   │   └── services/
│   │       └── signal-processing.service.ts   # RMS, Kurtosis, Skewness (puro)
│   ├── application/
│   │   ├── use-cases/                         # US1–US5
│   │   └── dtos/                              # class-validator decorators
│   ├── infrastructure/
│   │   ├── database/                          # MongoModule + Repository impl
│   │   └── messaging/                         # KafkaModule + Producer
│   ├── time-series/                           # Bounded Context (NestJS Module)
│   │   ├── time-series.module.ts
│   │   └── time-series.controller.ts
│   ├── common/                                # Filters, Interceptors, Pipes
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── unit/                                  # Jest + @nestjs/testing
│   ├── integration/                           # Supertest
│   └── load/k6-script.js
├── docker-compose.yml                         # MongoDB 6.0+ | Zookeeper | Kafka
├── Dockerfile                                 # Multi-stage (node:20-alpine)
├── Makefile                                   # setup | start | stop | test | load-test
├── .env.example
└── README.md
```

---

## 7. Estratégia de Commits (Conventional Commits)

O histórico de commits é parte da avaliação — o fork registra o processo. Commits atômicos demonstram raciocínio incremental.

**Padrão:** `<type>(<scope>): <descrição no imperativo>`

| Type | Quando usar |
|---|---|
| `chore` | Setup, config, Docker, Makefile |
| `feat` | Nova funcionalidade ou endpoint |
| `test` | Adição ou ajuste de testes |
| `perf` | Otimização (índice, aggregation) |
| `docs` | README, decisões de arquitetura |

**Sequência por etapa:**

```
# Etapa 1 — Setup
chore(project): scaffold NestJS project with TypeScript and ESLint
chore(docker): add docker-compose with MongoDB 6.0+ and Kafka
chore(makefile): add Makefile targets (setup, start, test, load-test)

# Etapa 2 — Domain
feat(domain): add TimeSeries entity with rich domain methods
feat(domain): add SensorName, Timestamp, and MeasurementUnit value objects
feat(domain): define ITimeSeriesRepository abstract contract
test(domain): add unit tests for entity invariants and value objects

# Etapa 3 — Application
feat(application): implement StoreTimeSeries use case (US1)
feat(application): implement GetMetrics use case with RMS and Kurtosis (US2)
feat(application): implement DeleteTimeSeries use case (US3)
feat(application): implement CountTimeSeries use case (US4)
feat(application): implement GetTimeSeries use case (US5)
feat(application): add DTOs with class-validator decorators
test(application): add unit tests for use cases with mocked repository

# Etapa 4 — Infrastructure
feat(infra): add MongoDB Time Series Collection setup and repository
feat(infra): add NestJS module composition with custom DI provider
feat(infra): add TimeSeriesController with HTTP adapters
feat(infra): add global ExceptionFilter and ValidationPipe
feat(infra): add Kafka producer with sensorId key-based partitioning

# Etapa 5 — Qualidade
test(e2e): add integration tests with Supertest against real MongoDB
perf(infra): add MongoDB indexes on datetime and sensorId fields
test(load): add k6 load test script validating <350ms at 100 rps
chore(docker): add multi-stage Dockerfile with health checks
docs(readme): add architecture decisions, metrics justification, and load test results
```

> **Regra:** cada commit deve compilar e os testes devem passar. Nunca commitar estado quebrado.

---

## 8. Checklist Senior

### Etapa 1 — Setup
- [ ] NestJS scaffolded com TypeScript, ESLint, Prettier
- [ ] docker-compose com MongoDB 6.0+, Zookeeper, Kafka e health checks
- [ ] Makefile com targets documentados

### Etapa 2 — Domain
- [ ] Entidade `TimeSeries` com métodos de domínio (não anêmica)
- [ ] Value Objects: `SensorName`, `Timestamp`, `MeasurementUnit`
- [ ] Interface `ITimeSeriesRepository` (contrato abstrato)
- [ ] `SignalProcessingService` com RMS, Kurtosis, Skewness (funções puras)
- [ ] Testes unitários com sinais sintéticos (senoide → RMS = A/√2)

### Etapa 3 — Application
- [ ] Use cases US1–US5 com `@Injectable()` e DI via token
- [ ] DTOs com `class-validator` (`StoreTimeSeriesDto`, `MetricsResponseDto`)
- [ ] Testes unitários dos use cases com mock do repository

### Etapa 4 — Infrastructure
- [ ] Time Series Collection com `granularity: 'seconds'`
- [ ] `MongoTimeSeriesRepository` implementando interface do domain
- [ ] Custom Provider `{ provide: 'TIME_SERIES_REPOSITORY', useClass: ... }`
- [ ] Kafka producer com `key = sensorId` (ordem garantida por partição)
- [ ] `ExceptionFilter` global (400, 404, 422, 500)
- [ ] `ValidationPipe` global

### Etapa 5 — Qualidade
- [ ] Testes de integração (Supertest contra MongoDB real)
- [ ] k6 load test comprovando < 350ms p95 com 100 rps
- [ ] Dockerfile multi-stage (`node:20-alpine`)
- [ ] README com instruções, decisões arquiteturais e resultados de carga

### PR (entrega)
- [ ] Justificativa das métricas (RMS, Kurtosis)
- [ ] Decisão pelo Time Series Collections
- [ ] Resultados dos load tests
- [ ] Estratégia de particionamento Kafka documentada

---

## 9. Observações Finais

- O `response-challenge-v2.json` é o **contrato de response** do endpoint de métricas (US2) e fixture ideal para testes.
- O schema do POST (input) não está definido no challenge — liberdade de design, mas deve ser coerente com o output.
- O challenge permite uso de IA, mas o candidato deve explicar todas as decisões tomadas.
- O fork no GitHub registra o tempo gasto — o histórico de commits atômicos é parte da avaliação do processo.
- O PR é a última oportunidade de demonstrar liderança técnica via justificativas e trade-offs documentados.
