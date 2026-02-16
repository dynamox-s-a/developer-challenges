## Decisões de Arquitetura e Suposições

Alguns pontos do desafio são ambíguos. As decisões abaixo foram feitas pra manter o domínio consistente, UX boa e backend confiável — sem inventar coisa demais fora do escopo.

---

## 0) Como rodar

### Dev Container (recomendado)

Este projeto foi desenvolvido usando **Dev Containers**. Para rodar:
Após inicializar, abra 2 terminais:

```bash
# Terminal 1 - API
cd apps/api
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev

# Terminal 2 - Web
cd apps/web
npm install
npm run dev
```

**Credenciais de teste (após seed):**

- Email: `admin@dynamox.com`
- Senha: `admin123`

**Produção (Vercel):**  
https://developer-challenge-full-stack-web.vercel.app/login

**Testes:** `npm run test --workspace apps/api`

---

## 1) Organização modular (backend e frontend)

### Backend (API)

- **Estrutura:** `/apps/api/src/modules/`
  - `auth/`, `machines/`, `monitoring-points/`, `sensors/`, `telemetry/`
- Cada módulo é autocontido:
  - `*.controller.ts` (HTTP)
  - `*.service.ts` (regras de negócio)
  - `*.routes.ts` (rotas)
  - `*.schemas.ts` (Zod)
  - `*.types.ts` (tipos)

### Frontend (Web)

- **Estrutura:** `/apps/web/src/features/`
  - `auth/`, `machines/`, `monitoring-points/`, `sensors/`, `telemetry/`
- Cada feature:
  - `*Slice.ts`, `*Thunks.ts`, `*Selectors.ts`, `*Types.ts`

**Por quê?**

- Separação clara de responsabilidades
- Facilita manutenção e escala
- Cada parte é testável sem depender do resto

---

## 2) Ownership / multi-tenancy simples (isolamento por usuário)

O desafio pede auth, mas não deixa explícito se dados são compartilhados.  
**Decisão:** cada usuário só vê/manipula **os próprios recursos**.

**Como:**

- Só `Machine` tem FK direta pro `User` (`userId`)
- Ownership “herda” via relação:
  - `Sensor → MonitoringPoint → Machine → User`
- **Autorização** validada em todas as operações (principalmente no service)
- `ensureAuth` injeta `req.user = { id, uuid }` via JWT

**Bônus de consistência:**

- Unicidade de máquina por usuário: `@@unique([userId, name, type])`

---

## 3) Regras de domínio (simples e centralizadas no backend)

### 3.1) Unicidade de máquinas (name + type)

**Decisão:** não permitir duplicidade de `(userId, name, type)`.

- Validação no service + constraint no banco

### 3.2) Um sensor por monitoring point

**Decisão:** relação 1:1 (um MP no máximo com um sensor).

- Mantém o desafio direto e o modelo consistente

### 3.3) Restrição Pump

**Regra:** sensores `TcAg` e `TcAs` **não podem** estar em máquinas `Pump`.  
**Decisão:** validado no service (create/update), erro de validação se violar.

### 3.4) Identificador único do sensor (sensorUniqueId)

**Suposição:** representa ID físico do dispositivo e precisa ser único globalmente.  
**Decisão:** `sensorUniqueId` no formato `AAAAAA-999` (6 letras maiúsculas + hífen + 3 dígitos).

- Backend normaliza pra uppercase e garante `UNIQUE` no banco
- Front só ajuda com máscara/placeholder (mas verdade é o backend)

---

## 4) Telemetria (time-series): Batch + Points (pra ficar robusto)

O desafio pede: salvar série, contar séries, ler série, métricas e deletar “o que enviei”.

**Decisão:** modelar em duas entidades:

- `TelemetryBatch`: representa **um envio** (um POST)
- `TelemetryPoint`: representa **cada ponto** (timestamp + medições)

**Por quê?**

- “Quantas séries enviei?” vira `count(batches)` (objetivo)
- Dá pra deletar um envio inteiro (batch) com cascade
- Ajuda em auditoria/debug (quando chegou, range, quantos pontos, etc.)

**Detalhes importantes:**

- `TelemetryPoint` tem `@@unique([sensorId, timestamp])` (não duplica timestamp por sensor)
- `createMany(..., skipDuplicates: true)` no POST → endpoint **idempotente** (retry não duplica)
- `TelemetryBatch` guarda metadados: `intervalMinutes`, `fromTimestamp`, `toTimestamp`, `pointsCount`, `receivedAt`

---

## 5) Campos de telemetria e indicador global (RMS)

**Campos armazenados por timestamp:**

- `x`, `y`, `z` (triaxial)
- `temperature` (temperatura de contato)

**Base para a decisão:**

- Foi feita uma análise da documentação pública dos sensores da Dynamox (`https://dynamox.net/sensors`) e dos PDFs técnicos disponíveis nessa página.
- A escolha de usar `x`, `y`, `z` e `temperature`, além do cálculo de `accelerationRms`, foi alinhada com os sinais e leituras apresentados nesses materiais.

**Além disso:** a API calcula e persiste:

- `accelerationRms = sqrt(x² + y² + z²)`

**Por quê?**

- Cálculo determinístico e barato
- Ajuda em cards/métricas/gráfico sem depender de processamento de sinal avançado
- `velocityRms` não foi calculado por depender de filtros/janelas/bandas não especificadas (evitei suposição errada)

---

## 6) Defaults e performance nos GETs

Pra não travar o front com payload gigante:

- Defaults:
  - `limit=500`
  - `order=desc` (puxa os mais recentes)
- Suporte a filtro por janela: `from/to`
- Índice: `@@index([sensorId, timestamp])` em `TelemetryPoint`

---

## 7) Deleção segura de time-series (evitar acidente)

**Decisão:** deletar exige intenção explícita:

- `DELETE /sensors/:uuid/time-series?all=true` (apaga tudo)
  **ou**
- `DELETE /sensors/:uuid/time-series?from=...&to=...` (apaga por janela)

E também existe:

- `DELETE /telemetry/batches/:uuid` (remove um envio específico + pontos via cascade)

---

## 8) UUID na API e ID numérico internamente

**Decisão:** API expõe **UUID** (mais seguro).  
Internamente, converto pra **ID numérico** cedo e uso nas queries seguintes (performance).

---

## 9) Mensagens em português

**Decisão:** mensagens de sucesso/erro voltadas ao usuário em **pt-BR** (API e front estão em PT e não tem i18n).  
Código (variáveis/funções) segue em inglês, padrão indústria.

---

## 10) Estratégia de testes (Backend)

**Ferramentas:**

- Vitest (runner)
- Supertest (HTTP)

**Camadas:**

- **Unit tests (domínio):**
  - cálculo do `accelerationRms`
  - cálculo de métricas agregadas (min/max/média, first/last, lastPoint)
  - validações Zod (intervalo, tamanho do array, datas inválidas, NaN/Infinity, ranges)
- **Integration tests (API real + DB real):**
  - fluxo completo: HTTP → controller → service → Prisma → PostgreSQL
  - cobre `auth`, `machines`, `monitoring-points`, `sensors` e principalmente `telemetry`
  - inclui happy path, filtros e cenários de erro

**Confiabilidade:**

- reset de banco entre testes
- fechamento explícito de conexão (`prisma.$disconnect`)

**Trade-off (intencional):**

- mais profundidade de testes em **telemetria** (núcleo do desafio de time-series)
- integração nos outros módulos pra validar contratos e regras principais

---

## 11) Performance e latência (< 350ms)

Para medir o requisito de latência, adotei benchmark HTTP com **autocannon** nos endpoints `GET` mais relevantes da API:

- `GET /auth/me`
- `GET /machines`
- `GET /monitoring-points`
- `GET /sensors`
- `GET /sensors/:uuid/time-series`
- `GET /sensors/:uuid/time-series/metrics`
- `GET /sensors/:uuid/time-series/count`

### Como executar

Com a API rodando localmente em `http://localhost:3000`:

```bash
npm run bench:telemetry:local --workspace apps/api
```

Ou informando URL explícita:

```bash
BENCH_API_BASE_URL=http://localhost:3000 npm run bench:telemetry --workspace apps/api
```

### O que o script faz

1. Cria usuário e autentica
2. Cria machine, monitoring point e sensor
3. Insere uma série temporal de benchmark
4. Executa carga concorrente por endpoint
5. Reporta `p50`, `p95`, `p99`, média e `req/s`

### Critério de aceitação

- SLO principal: **p95 < 350ms** por endpoint.
- O script já marca `YES/NO` para esse alvo.

### Registro de resultados (template)

GETs gerais:

| Endpoint                                                             | p50 (ms) | p95 (ms) | p99 (ms) | req/s | p95 < 350ms |
| -------------------------------------------------------------------- | -------: | -------: | -------: | ----: | ----------: |
| `/auth/me`                                                           |     53.0 |     81.0 |     87.0 | 182.8 |         YES |
| `/machines`                                                          |     49.0 |     72.0 |     79.0 | 196.1 |         YES |
| `/monitoring-points?page=1&limit=10&sortBy=createdAt&sortOrder=desc` |     84.0 |    107.0 |    116.0 | 116.9 |         YES |
| `/sensors`                                                           |     68.0 |     85.0 |     92.0 | 145.6 |         YES |

GETs de telemetria:

| Endpoint                                          | p50 (ms) | p95 (ms) | p99 (ms) | req/s | p95 < 350ms |
| ------------------------------------------------- | -------: | -------: | -------: | ----: | ----------: |
| `/sensors/:uuid/time-series?limit=500&order=desc` |    159.0 |    199.0 |    206.0 |  62.0 |         YES |
| `/sensors/:uuid/time-series/metrics`              |    131.0 |    196.0 |    239.0 |  72.8 |         YES |
| `/sensors/:uuid/time-series/count`                |    119.0 |    158.0 |    168.0 |  80.6 |         YES |

Resultado consolidado: com `connections=10`, `duration=20s` e `pointsSeeded=1000`, todos os endpoints GET medidos ficaram com **p95 abaixo de 350ms**. Resultado geral do benchmark: **PASSED**.
