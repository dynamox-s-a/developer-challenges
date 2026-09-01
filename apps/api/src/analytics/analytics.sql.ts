/**
 * Consultas analíticas — o PostgreSQL faz o trabalho relacional e devolve o RESULTADO,
 * não a tabela. Cada função recebe um recorte (janela temporal, sensor, ciclo) e produz
 * poucas linhas: nenhuma delas pode crescer com o tamanho do histórico.
 *
 * Convenções: `Prisma.sql` sempre parametrizado; `count(*)::bigint` convertido com
 * `Number()` no serviço (BigInt vazado quebraria o JSON da resposta).
 */
import { Prisma } from '@prisma/client';
import { DEFAULT_CONDITION_POLICY } from '@dynamox/domain';

/**
 * Parâmetros da janela de avaliação — os da política de condição v1, para que a consulta e
 * a classificação nunca discordem sobre "quantas amostras fazem uma aquisição" ou "quão
 * longe olhar".
 */
export const CONDITION_LOOKBACK_MS = DEFAULT_CONDITION_POLICY.lookbackMs;
const MIN_WINDOW_SAMPLES = DEFAULT_CONDITION_POLICY.minWindowSamples;
const RECENT_CYCLES_PER_SENSOR = DEFAULT_CONDITION_POLICY.recentCyclesPerSensor;
const FLEET_AGREEMENT = DEFAULT_CONDITION_POLICY.fleetAgreement;

/**
 * Condição da frota — a MESMA semântica que o painel derivava no cliente, agora no banco.
 *
 * Como o painel classificava: agrupava as amostras radiais em janelas de aquisição, mantinha
 * os instantes de início compartilhados por pelo menos dois sensores e comparava **as duas
 * últimas janelas sincronizadas** (`sharedStarts.slice(-2)`); a mais recente é a condição, a
 * anterior é a referência. Isso descarta, de propósito, a aquisição confirmatória — que
 * existe para um sensor só e não serve de comparação de frota.
 *
 * O que muda aqui: a janela de aquisição é o `ingestionCycleId` (o banco já sabe a que
 * aquisição cada amostra pertence; o cliente precisava inferir por lacuna de 5 min), e a
 * busca é limitada às últimas 24 h da janela consultada — mais velho que isso o próprio
 * painel já trata como desatualizado.
 *
 * RMS radial = `sqrt(avg((y² + z²)/2))` sobre as amostras Y e Z pareadas pelo MESMO instante,
 * idêntico ao cálculo por instante seguido de média que o cliente fazia.
 *
 * A referência é sempre uma aquisição concreta — nunca a média do período, que já embutiria
 * a própria degradação.
 */
/**
 * Início da avaliação de condição: as últimas 24 h DE DADO dentro do recorte pedido.
 *
 * Ancorar no `to` da consulta (o relógio de quem pergunta) faria a referência deslizar para
 * fora da janela assim que a ingestão parasse — planta parada, fim de uma demonstração — e
 * toda a frota decairia para "sem classificação" com o passar das horas, sem nenhum dado
 * novo para justificar a mudança. A âncora é a última amostra persistida antes de `to`
 * (limitada ao próprio `to`): numa operação viva as duas coincidem.
 */
export function anchoredEvaluationFrom(fromMs: number, toMs: number, dataEndMs: number | null): Date {
  const anchorMs = dataEndMs === null ? toMs : Math.min(toMs, dataEndMs + 1);
  return new Date(Math.max(fromMs, anchorMs - CONDITION_LOOKBACK_MS));
}

export function fleetConditionSql(evaluationFrom: Date, to: Date): Prisma.Sql {
  return Prisma.sql`
    WITH radial AS (
      SELECT s."serialNumber" AS serial, ts.id AS series_id, ts.axis AS axis
      FROM time_series ts
      JOIN sensors s ON s.id = ts."sensorId"
      WHERE ts."physicalQuantity" = 'ACCELERATION' AND ts.axis IN ('Y', 'Z')
    ),
    anchor AS (SELECT serial, series_id FROM radial WHERE axis = 'Y'),
    -- Aquisições recentes de cada sensor (poucas linhas por sensor, por índice).
    recent AS (
      SELECT a.serial, a.series_id, c.cycle_id, c.started_at
      FROM anchor a
      CROSS JOIN LATERAL (
        SELECT p."ingestionCycleId" AS cycle_id, min(p."timestamp") AS started_at
        FROM time_series_samples p
        WHERE p."timeSeriesId" = a.series_id
          AND p."ingestionCycleId" IS NOT NULL
          AND p."timestamp" >= ${evaluationFrom} AND p."timestamp" < ${to}
        GROUP BY 1
        HAVING count(*) >= ${MIN_WINDOW_SAMPLES}
        ORDER BY 2 DESC
        LIMIT ${RECENT_CYCLES_PER_SENSOR}
      ) c
    ),
    -- Aquisições SINCRONIZADAS: instantes em que pelo menos dois sensores adquiriram
    -- juntos. Descarta a confirmatória (existe para um sensor só e não serve de
    -- comparação), sem exigir que a frota inteira compartilhe o mesmo instante — no
    -- histórico cada máquina tem sua própria fase de aquisição.
    shared AS (
      SELECT started_at
      FROM recent
      GROUP BY started_at
      HAVING count(DISTINCT serial) >= ${FLEET_AGREEMENT}
    ),
    -- Por sensor, as duas últimas aquisições sincronizadas: a mais recente classifica, a
    -- anterior é a referência.
    ranked AS (
      SELECT
        r.serial, r.series_id, r.cycle_id, r.started_at,
        row_number() OVER (PARTITION BY r.serial ORDER BY r.started_at DESC) AS position
      FROM recent r
      JOIN shared sh ON sh.started_at = r.started_at
    ),
    sensor_pair AS (
      SELECT
        serial,
        max(series_id) AS series_id,
        max(CASE WHEN position = 1 THEN cycle_id END) AS current_cycle_id,
        max(CASE WHEN position = 2 THEN cycle_id END) AS baseline_cycle_id
      FROM ranked
      WHERE position <= 2
      GROUP BY serial
    )
    SELECT
      m.id               AS machine_id,
      m.name             AS machine_name,
      m.type             AS machine_type,
      mp.id              AS monitoring_point_id,
      mp.name            AS monitoring_point_name,
      sen."serialNumber" AS sensor_serial,
      sen.model          AS sensor_model,
      sp.current_cycle_id,
      sp.baseline_cycle_id,
      cur.rms            AS current_rms,
      cur.ended_at       AS current_at,
      cur.samples        AS current_samples,
      base.rms           AS baseline_rms,
      base.started_at    AS baseline_at,
      seen.last_at       AS last_seen_at
    FROM machines m
    JOIN monitoring_points mp ON mp."machineId" = m.id
    LEFT JOIN sensors sen ON sen."monitoringPointId" = mp.id
    LEFT JOIN sensor_pair sp ON sp.serial = sen."serialNumber"
    -- Recência independe do pareamento: um sensor fora das janelas ainda tem última leitura.
    LEFT JOIN LATERAL (
      SELECT max(last.at) AS last_at
      FROM radial r
      CROSS JOIN LATERAL (
        SELECT max(p."timestamp") AS at
        FROM time_series_samples p
        WHERE p."timeSeriesId" = r.series_id
      ) last
      WHERE r.serial = sen."serialNumber"
    ) seen ON true
    LEFT JOIN LATERAL (
      SELECT sqrt(avg((y.value * y.value + z.value * z.value) / 2)) AS rms,
             max(y."timestamp") AS ended_at,
             count(*)::bigint AS samples
      FROM time_series_samples y
      JOIN radial rz ON rz.serial = sp.serial AND rz.axis = 'Z'
      JOIN time_series_samples z
        ON z."timeSeriesId" = rz.series_id AND z."timestamp" = y."timestamp"
      WHERE y."timeSeriesId" = sp.series_id AND y."ingestionCycleId" = sp.current_cycle_id
    ) cur ON true
    LEFT JOIN LATERAL (
      SELECT sqrt(avg((y.value * y.value + z.value * z.value) / 2)) AS rms,
             min(y."timestamp") AS started_at
      FROM time_series_samples y
      JOIN radial rz ON rz.serial = sp.serial AND rz.axis = 'Z'
      JOIN time_series_samples z
        ON z."timeSeriesId" = rz.series_id AND z."timestamp" = y."timestamp"
      WHERE y."timeSeriesId" = sp.series_id AND y."ingestionCycleId" = sp.baseline_cycle_id
    ) base ON true
    ORDER BY m.name ASC, mp.name ASC
  `;
}

/** Buckets aceitos na série agregada; o rótulo é fechado e vira intervalo aqui, nunca SQL do cliente. */
export const SERIES_BUCKETS = ['15m', '1h', '4h', '1d'] as const;
export type SeriesBucket = (typeof SERIES_BUCKETS)[number];

const BUCKET_SECONDS: Record<SeriesBucket, number> = {
  '15m': 900,
  '1h': 3_600,
  '4h': 14_400,
  '1d': 86_400,
};

/**
 * Série agregada por bucket temporal: o gráfico recebe dezenas ou centenas de pontos, não
 * as centenas de milhares de amostras da janela.
 *
 * `to_timestamp(floor(extract(epoch ...) / N) * N)` alinha os buckets a múltiplos absolutos
 * do intervalo — assim dois períodos diferentes concordam nas bordas, e o `date_trunc` não
 * precisa de um caso especial para 4 h.
 */
/**
 * De onde as aquisições de uma janela são contadas.
 *
 * - `ledger`: `alert_cycle_evidence` — uma linha por ciclo ingerido, índice por sensor e
 *   instante. Milissegundos, qualquer que seja o tamanho da janela.
 * - `samples`: `count(DISTINCT "ingestionCycleId")` sobre as próprias amostras — correto,
 *   mas ~10× mais caro em 30 dias. É o fallback para dado carregado com o motor desligado e
 *   ainda sem backfill, ou inserido fora da API.
 *
 * A escolha é do service (`acquisitionSource`), nunca do SQL: uma subconsulta "preguiçosa"
 * dentro de CASE vira InitPlan no Postgres e é executada de qualquer jeito.
 */
export type AcquisitionSource = 'ledger' | 'samples';

export function seriesPointsSql(
  seriesId: string,
  from: Date,
  to: Date,
  bucket: SeriesBucket,
  source: AcquisitionSource,
): Prisma.Sql {
  const seconds = BUCKET_SECONDS[bucket];
  if (source === 'samples') {
    return Prisma.sql`
      SELECT
        to_timestamp(floor(extract(epoch FROM p."timestamp") / ${seconds}) * ${seconds}) AS bucket_start,
        count(*)::bigint AS samples,
        avg(p.value)     AS avg,
        min(p.value)     AS min,
        max(p.value)     AS max,
        max(p."timestamp") AS last_at,
        count(DISTINCT p."ingestionCycleId")::bigint AS acquisitions
      FROM time_series_samples p
      WHERE p."timeSeriesId" = ${seriesId}::text
        AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
  }
  return Prisma.sql`
    WITH serie AS (
      SELECT s."serialNumber" AS serial
      FROM time_series ts JOIN sensors s ON s.id = ts."sensorId"
      WHERE ts.id = ${seriesId}::text
    ),
    buckets AS (
      SELECT
        to_timestamp(floor(extract(epoch FROM p."timestamp") / ${seconds}) * ${seconds}) AS bucket_start,
        count(*)::bigint AS samples,
        avg(p.value)     AS avg,
        min(p.value)     AS min,
        max(p.value)     AS max,
        max(p."timestamp") AS last_at
      FROM time_series_samples p
      WHERE p."timeSeriesId" = ${seriesId}::text
        AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
      GROUP BY 1
    )
    SELECT b.bucket_start, b.samples, b.avg, b.min, b.max, b.last_at, ev.n AS acquisitions
    FROM buckets b
    CROSS JOIN LATERAL (
      SELECT count(*)::bigint AS n
      FROM alert_cycle_evidence e, serie
      WHERE e."sensorSerialNumber" = serie.serial
        AND e."startedAt" >= b.bucket_start
        AND e."startedAt" < b.bucket_start + make_interval(secs => ${seconds})
    ) ev
    ORDER BY 1 ASC
  `;
}

/** Estatísticas da janela inteira: uma passada agregada, sem trazer amostra alguma. */
export function seriesStatsSql(seriesId: string, from: Date, to: Date, source: AcquisitionSource): Prisma.Sql {
  if (source === 'samples') {
    return Prisma.sql`
      SELECT
        count(*)::bigint AS samples,
        count(DISTINCT p."ingestionCycleId")::bigint AS acquisitions,
        min(p.value) AS min,
        max(p.value) AS max,
        avg(p.value) AS avg,
        min(p."timestamp") AS first_at,
        max(p."timestamp") AS last_at
      FROM time_series_samples p
      WHERE p."timeSeriesId" = ${seriesId}::text
        AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
    `;
  }
  return Prisma.sql`
    WITH serie AS (
      SELECT s."serialNumber" AS serial
      FROM time_series ts JOIN sensors s ON s.id = ts."sensorId"
      WHERE ts.id = ${seriesId}::text
    )
    SELECT
      count(*)::bigint AS samples,
      (
        SELECT count(*)::bigint FROM alert_cycle_evidence e, serie
        WHERE e."sensorSerialNumber" = serie.serial AND e."startedAt" >= ${from} AND e."startedAt" < ${to}
      ) AS acquisitions,
      min(p.value) AS min,
      max(p.value) AS max,
      avg(p.value) AS avg,
      min(p."timestamp") AS first_at,
      max(p."timestamp") AS last_at
    FROM time_series_samples p
    WHERE p."timeSeriesId" = ${seriesId}::text
      AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
  `;
}

export const HEATMAP_BUCKETS = ['hour', 'day'] as const;
export type HeatmapBucket = (typeof HEATMAP_BUCKETS)[number];

/**
 * Mapa de atividade por bucket: quantas aquisições e quantos sensores reportaram em cada
 * (dia, hora) da janela. É a pergunta que o painel faz — cobertura temporal, não amplitude.
 *
 * Duas decisões medidas (EXPLAIN ANALYZE, 10 M amostras):
 *  - a série ÂNCORA de cada sensor (aceleração Y) representa a aquisição: usar as 24 séries
 *    radiais dobraria a leitura sem mudar a resposta;
 *  - agregação em DOIS níveis (por série, depois por bucket) em vez de `count(distinct)`:
 *    o distinct sobre milhões de linhas forçava sort em disco (1,98 s → 0,98 s em 30 dias);
 *  - sem tocar em `value`, a consulta cabe no índice `(timeSeriesId, timestamp)` e roda como
 *    Index Only Scan com zero heap fetches (30 d: 975 ms · 7 d: 239 ms).
 */
/**
 * Variante por AMOSTRAS do mapa de atividade — o fallback de `heatmapSql` para janelas em
 * que o ledger de evidência ainda não existe (carga com o motor desligado e sem backfill,
 * ou dado inserido fora da API). Varre a série âncora de cada sensor: correta, porém ~30×
 * mais cara em 30 dias.
 */
export function heatmapSamplesSql(
  seriesIds: string[],
  from: Date,
  to: Date,
  bucket: HeatmapBucket,
): Prisma.Sql {
  const ids = Prisma.join(seriesIds.map((id) => Prisma.sql`${id}`));
  const hourExpression =
    bucket === 'hour'
      ? Prisma.sql`extract(hour from p."timestamp" AT TIME ZONE 'UTC')::int`
      : Prisma.sql`0::int`;

  return Prisma.sql`
    SELECT
      por_serie.day  AS day,
      por_serie.hour AS hour,
      sum(por_serie.samples)::bigint      AS samples,
      sum(por_serie.acquisitions)::bigint AS acquisitions,
      count(*)::bigint                    AS sensors
    FROM (
      SELECT
        date_trunc('day', p."timestamp" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' AS day,
        ${hourExpression}                AS hour,
        p."timeSeriesId"                 AS series_id,
        count(*)                         AS samples,
        count(DISTINCT p."ingestionCycleId") AS acquisitions
      FROM time_series_samples p
      WHERE p."timeSeriesId" IN (${ids})
        AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
      GROUP BY 1, 2, 3
    ) por_serie
    GROUP BY 1, 2
    ORDER BY 1, 2
  `;
}

export function heatmapSql(from: Date, to: Date, bucket: HeatmapBucket): Prisma.Sql {
  // UTC EXPLÍCITO: `date_trunc`/`extract` sobre timestamptz seguem o fuso da SESSÃO. O
  // produto inteiro fala UTC (banco, API, URL e tela), então a consulta declara o fuso em
  // vez de depender da configuração do servidor.
  const hourExpression =
    bucket === 'hour'
      ? Prisma.sql`extract(hour from e."startedAt" AT TIME ZONE 'UTC')::int`
      : Prisma.sql`0::int`;

  // Uma linha por AQUISIÇÃO (ledger de evidência do motor, índice por instante), não uma
  // por amostra: 30 dias são ~33 mil ciclos contra ~2 milhões de amostras da série âncora —
  // 35 ms contra mais de um segundo. As amostras persistidas de cada aquisição vêm da
  // própria linha do ciclo (`ingestion_cycles.sampleCount`), atribuídas ao bucket em que a
  // aquisição começou.
  return Prisma.sql`
    SELECT
      date_trunc('day', e."startedAt" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' AS day,
      ${hourExpression}                                 AS hour,
      sum(c."sampleCount")::bigint                      AS samples,
      count(*)::bigint                                  AS acquisitions,
      count(DISTINCT e."sensorSerialNumber")::bigint    AS sensors
    FROM alert_cycle_evidence e
    JOIN ingestion_cycles c ON c.id = e."cycleId"
    WHERE e."startedAt" >= ${from} AND e."startedAt" < ${to}
    GROUP BY 1, 2
    ORDER BY 1, 2
  `;
}

/**
 * SEVERIDADE por bucket: o maior desvio radial da frota em cada hora, e de quem foi.
 *
 * A pergunta que uma grade data × hora responde melhor que qualquer tabela é "onde no tempo
 * isso piorou?" — e para isso a célula precisa carregar magnitude, não presença. Cobertura
 * (quantos sensores reportaram) é praticamente binária numa planta que adquire a cada 15 min:
 * gasta a escala de cor sem informar nada.
 *
 * De onde vem o número, e por que não das amostras: o motor de alertas já calculou o RMS
 * radial de CADA ciclo uma vez (`alert_cycle_evidence`, imutável) e já aprendeu a baseline
 * saudável de cada ponto por hora UTC (`alert_rule_states.baselineProfile`). Reaproveitar
 * essas duas coisas dá a mesma fórmula usada no resto do produto, uma leitura de dezenas de
 * milhares de linhas em vez de dez milhões, e — o que mais importa — UMA definição de
 * "quanto isso está pior que o normal" na aplicação inteira.
 *
 * Ponto sem baseline estabelecida não entra: sem referência, "1,4×" não significaria nada.
 * A célula fica sem severidade e a interface a desenha como ausência, não como calmaria.
 */
export function heatmapSeveritySql(from: Date, to: Date, bucket: HeatmapBucket): Prisma.Sql {
  const hourExpression =
    bucket === 'hour'
      ? Prisma.sql`extract(hour from e."startedAt" AT TIME ZONE 'UTC')::int`
      : Prisma.sql`0::int`;

  return Prisma.sql`
    WITH leituras AS (
      SELECT
        date_trunc('day', e."startedAt" AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' AS day,
        ${hourExpression} AS hour,
        -- Arrays do Postgres são 1-indexados; o perfil tem 24 posições, uma por hora UTC.
        e."radialRms" / s."baselineProfile"[extract(hour from e."startedAt" AT TIME ZONE 'UTC')::int + 1] AS ratio,
        e."radialRms" AS rms,
        e."sensorSerialNumber" AS serial,
        mp.name AS point_name,
        m.name  AS machine_name
      FROM alert_cycle_evidence e
      JOIN alert_rule_states s
        ON s."monitoringPointId" = e."monitoringPointId"
       AND s."baselineStatus" = 'ESTABLISHED'
       AND array_length(s."baselineProfile", 1) = 24
      JOIN alert_rules r
        ON r.id = s."ruleId" AND r.type = 'VIBRATION_THRESHOLD'
      JOIN monitoring_points mp ON mp.id = e."monitoringPointId"
      JOIN machines m ON m.id = mp."machineId"
      WHERE e."startedAt" >= ${from} AND e."startedAt" < ${to}
        AND e."radialRms" IS NOT NULL
        AND s."baselineProfile"[extract(hour from e."startedAt" AT TIME ZONE 'UTC')::int + 1] > 0
    ),
    ranqueado AS (
      SELECT *, row_number() OVER (PARTITION BY day, hour ORDER BY ratio DESC) AS posicao
      FROM leituras
    )
    SELECT day, hour, ratio, rms, serial, point_name, machine_name
    FROM ranqueado
    WHERE posicao = 1
    ORDER BY day, hour
  `;
}

/**
 * Resumo de uma JANELA temporal por sensor: o que cada ponto fez naquele intervalo.
 * Uma linha por sensor — o custo não cresce com o tamanho do histórico, só com a janela.
 */
export function timeWindowSql(
  from: Date,
  to: Date,
  serialNumbers: readonly string[] | undefined,
  source: AcquisitionSource,
): Prisma.Sql {
  // O recorte por sensor não muda a semântica: cada linha já é agregada por sensor, de
  // forma independente. A página do ativo lê dois sensores em vez dos doze da frota.
  const sensorFilter =
    serialNumbers === undefined
      ? Prisma.empty
      : Prisma.sql`AND s."serialNumber" IN (${Prisma.join(serialNumbers.map((serial) => Prisma.sql`${serial}`))})`;
  const acquisitions =
    source === 'ledger'
      ? Prisma.sql`(
          SELECT count(*)::bigint FROM alert_cycle_evidence e
          WHERE e."sensorSerialNumber" = a.serial AND e."startedAt" >= ${from} AND e."startedAt" < ${to}
        )`
      : Prisma.sql`count(DISTINCT p."ingestionCycleId")::bigint`;

  return Prisma.sql`
    WITH anchor AS (
      SELECT s.id AS sensor_id, s."serialNumber" AS serial, s.model AS model,
             ts.id AS series_id, mp.name AS point_name, mp.id AS point_id,
             m.id AS machine_id, m.name AS machine_name, m.type AS machine_type
      FROM time_series ts
      JOIN sensors s ON s.id = ts."sensorId"
      LEFT JOIN monitoring_points mp ON mp.id = s."monitoringPointId"
      LEFT JOIN machines m ON m.id = mp."machineId"
      WHERE ts."physicalQuantity" = 'ACCELERATION' AND ts.axis = 'Y'
        ${sensorFilter}
    )
    SELECT
      a.serial, a.model, a.series_id, a.point_name, a.point_id, a.machine_id, a.machine_name, a.machine_type,
      w.samples, w.acquisitions, w.min, w.max, w.avg, w.last_at, w.last_value
    FROM anchor a
    LEFT JOIN LATERAL (
      SELECT
        count(*)::bigint AS samples,
        ${acquisitions} AS acquisitions,
        min(p.value) AS min, max(p.value) AS max, avg(p.value) AS avg,
        max(p."timestamp") AS last_at,
        (SELECT value FROM time_series_samples q
          WHERE q."timeSeriesId" = a.series_id AND q."timestamp" >= ${from} AND q."timestamp" < ${to}
          ORDER BY q."timestamp" DESC LIMIT 1) AS last_value
      FROM time_series_samples p
      WHERE p."timeSeriesId" = a.series_id
        AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
    ) w ON true
    ORDER BY a.machine_name ASC, a.point_name ASC
  `;
}

/**
 * Página de aquisições de um sensor.
 *
 * A consulta parte das AMOSTRAS da série âncora dentro da janela (índice
 * `(timeSeriesId, timestamp)`) e agrupa por ciclo — não do outro lado. Partir de
 * `ingestion_cycles` obrigava a calcular os limites de TODOS os ciclos do sensor antes de
 * filtrar pela janela: 1,04 s medidos contra ~60 ms desta forma.
 */
export function sensorAcquisitionsSql(
  serialNumber: string,
  from: Date,
  to: Date,
  limit: number,
  offset: number,
): Prisma.Sql {
  return Prisma.sql`
    WITH anchor AS (
      SELECT ts.id
      FROM time_series ts
      JOIN sensors s ON s.id = ts."sensorId"
      WHERE s."serialNumber" = ${serialNumber}
        AND ts."physicalQuantity" = 'ACCELERATION' AND ts.axis = 'Y'
      LIMIT 1
    ),
    cycles AS (
      SELECT
        p."ingestionCycleId" AS cycle_id,
        min(p."timestamp")   AS started_at,
        max(p."timestamp")   AS ended_at,
        count(*)::bigint     AS samples,
        min(p.value)         AS min,
        max(p.value)         AS max,
        avg(p.value)         AS avg
      FROM time_series_samples p
      JOIN anchor a ON a.id = p."timeSeriesId"
      WHERE p."ingestionCycleId" IS NOT NULL
        AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
      GROUP BY 1
      ORDER BY 2 DESC
      LIMIT ${limit} OFFSET ${offset}
    )
    SELECT
      c.cycle_id, ic."cycleId" AS external_cycle_id, ic."sampleCount" AS sample_count,
      ic."measurementCount" AS measurement_count, ic.configuration AS configuration,
      ic.metadata AS metadata, ic.tags AS tags, ic."createdAt" AS ingested_at,
      c.started_at, c.ended_at, c.min, c.max, c.avg, c.samples
    FROM cycles c
    JOIN ingestion_cycles ic ON ic.id = c.cycle_id
    ORDER BY c.started_at DESC
  `;
}

/** Total de aquisições do sensor na janela — só quando o cliente pede (`includeTotal`). */
export function sensorAcquisitionsCountSql(serialNumber: string, from: Date, to: Date): Prisma.Sql {
  return Prisma.sql`
    WITH anchor AS (
      SELECT ts.id
      FROM time_series ts
      JOIN sensors s ON s.id = ts."sensorId"
      WHERE s."serialNumber" = ${serialNumber}
        AND ts."physicalQuantity" = 'ACCELERATION' AND ts.axis = 'Y'
      LIMIT 1
    )
    SELECT count(*)::bigint AS count FROM (
      SELECT p."ingestionCycleId"
      FROM time_series_samples p
      JOIN anchor a ON a.id = p."timeSeriesId"
      WHERE p."ingestionCycleId" IS NOT NULL
        AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
      GROUP BY 1
    ) ciclos
  `;
}

/** Resumo estatístico de uma aquisição, uma linha por série. Universo pequeno por natureza. */
export function acquisitionSeriesSql(cycleId: string): Prisma.Sql {
  return Prisma.sql`
    SELECT
      ts.id AS series_id, ts."physicalQuantity" AS physical_quantity, ts.axis AS axis,
      ts.unit AS unit,
      count(*)::bigint AS samples,
      min(p.value) AS min, max(p.value) AS max, avg(p.value) AS avg,
      sqrt(avg(p.value * p.value)) AS rms,
      min(p."timestamp") AS started_at, max(p."timestamp") AS ended_at
    FROM time_series_samples p
    JOIN time_series ts ON ts.id = p."timeSeriesId"
    WHERE p."ingestionCycleId" = ${cycleId}
    GROUP BY 1, 2, 3, 4
    ORDER BY ts."physicalQuantity" ASC, ts.axis ASC
  `;
}

/**
 * Amostras de uma aquisição por KEYSET (timestamp, id): a página seguinte continua de onde
 * a anterior parou, sem `OFFSET` profundo. É o único lugar do sistema que devolve
 * telemetria bruta, e mesmo assim recortada por aquisição.
 */
export function acquisitionSamplesSql(
  cycleId: string,
  limit: number,
  cursor: { timestamp: Date; id: string } | null,
  filters: { quantity: string | null; axis: string | null },
): Prisma.Sql {
  const conditions: Prisma.Sql[] = [Prisma.sql`p."ingestionCycleId" = ${cycleId}`];
  if (cursor) {
    conditions.push(
      Prisma.sql`(p."timestamp", p.id) > (${cursor.timestamp}, ${cursor.id})`,
    );
  }
  if (filters.quantity) {
    conditions.push(Prisma.sql`ts."physicalQuantity"::text = ${filters.quantity}`);
  }
  if (filters.axis) {
    conditions.push(Prisma.sql`ts.axis::text = ${filters.axis}`);
  }

  return Prisma.sql`
    SELECT p.id, p."timestamp", p.value,
           ts."physicalQuantity" AS physical_quantity, ts.axis AS axis, ts.unit AS unit
    FROM time_series_samples p
    JOIN time_series ts ON ts.id = p."timeSeriesId"
    WHERE ${Prisma.join(conditions, ' AND ')}
    ORDER BY p."timestamp" ASC, p.id ASC
    LIMIT ${limit}
  `;
}

/** Buckets da tendência curta: doze pontos são suficientes para ler a direção. */
export const TREND_BUCKETS = 12;

/**
 * Tendência curta de cada sensor: RMS do eixo âncora (aceleração Y) por bucket.
 *
 * Serve às miniaturas — a pergunta é "sobe, estabiliza ou cai", não "qual o valor". Por
 * isso são doze buckets sobre a MESMA janela em que a condição é avaliada (as últimas 24 h
 * do recorte), e não sobre os trinta dias: um sparkline de 700 pontos não responde nada
 * melhor e custaria uma varredura inteira.
 *
 * A razão publicada continua vindo do RMS radial (Y/Z pareados) da `fleetConditionSql`;
 * aqui só a FORMA da curva importa, e o eixo âncora a descreve com metade da leitura.
 */
export function sensorTrendSql(from: Date, to: Date, serialNumbers?: readonly string[]): Prisma.Sql {
  const seconds = Math.max(60, Math.round((to.getTime() - from.getTime()) / 1000 / TREND_BUCKETS));
  const sensorFilter =
    serialNumbers === undefined
      ? Prisma.empty
      : Prisma.sql`AND s."serialNumber" IN (${Prisma.join(serialNumbers.map((serial) => Prisma.sql`${serial}`))})`;

  return Prisma.sql`
    WITH anchor AS (
      SELECT s."serialNumber" AS serial, ts.id AS series_id
      FROM time_series ts
      JOIN sensors s ON s.id = ts."sensorId"
      WHERE ts."physicalQuantity" = 'ACCELERATION' AND ts.axis = 'Y'
        ${sensorFilter}
    )
    SELECT a.serial, b.bucket_start, b.rms
    FROM anchor a
    CROSS JOIN LATERAL (
      SELECT
        to_timestamp(floor(extract(epoch FROM p."timestamp") / ${seconds}) * ${seconds}) AS bucket_start,
        sqrt(avg(p.value * p.value)) AS rms
      FROM time_series_samples p
      WHERE p."timeSeriesId" = a.series_id
        AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
      GROUP BY 1
      ORDER BY 1 ASC
    ) b
    ORDER BY a.serial ASC, b.bucket_start ASC
  `;
}

/**
 * Séries disponíveis de um sensor, com a última leitura de cada uma dentro da janela.
 * É inventário de grandezas — uma linha por série, nunca amostras.
 */
export function pointSeriesSql(serialNumber: string, from: Date, to: Date): Prisma.Sql {
  return Prisma.sql`
    SELECT
      ts.id AS series_id, ts."physicalQuantity" AS physical_quantity, ts.axis AS axis,
      ts.unit AS unit, last.value AS last_value, last."timestamp" AS last_at
    FROM time_series ts
    JOIN sensors s ON s.id = ts."sensorId"
    LEFT JOIN LATERAL (
      SELECT p.value, p."timestamp"
      FROM time_series_samples p
      WHERE p."timeSeriesId" = ts.id
        AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
      ORDER BY p."timestamp" DESC
      LIMIT 1
    ) last ON true
    WHERE s."serialNumber" = ${serialNumber}
    ORDER BY ts."physicalQuantity" ASC, ts.axis ASC
  `;
}
