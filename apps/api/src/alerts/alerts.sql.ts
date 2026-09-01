/**
 * Consultas do motor de alertas — só o que o banco faz melhor: reduzir amostras a evidência
 * por ciclo e listar ciclos por janela. Nenhuma consulta cresce com o histórico inteiro:
 * evidência é por lista de ciclos (índice em `ingestionCycleId`), listagem é por dia.
 *
 * O que estas consultas NÃO leem, de propósito: nenhuma coluna JSON do ciclo. O motor só
 * enxerga amostras, séries e cadastro — nunca o que o produtor disse sobre o ciclo.
 */
import { Prisma, type PrismaClient } from '@prisma/client';

type SqlClient = Pick<PrismaClient, '$queryRaw'>;

export interface CycleEvidence {
  cycleId: string;
  sensorSerialNumber: string;
  sensorId: string | null;
  monitoringPointId: string | null;
  startedAt: Date;
  endedAt: Date;
  radialRms: number | null;
  radialSampleCount: number;
  temperatureAvg: number | null;
  temperatureCount: number;
  rpmAvg: number | null;
}

interface EvidenceRow {
  cycle_id: string;
  serial: string;
  sensor_id: string | null;
  point_id: string | null;
  started_at: Date;
  ended_at: Date;
  radial_rms: number | null;
  radial_n: bigint;
  temperature_avg: number | null;
  temperature_n: bigint;
  rpm_avg: number | null;
}

/**
 * Evidência física de cada ciclo: RMS radial Y/Z pareado por instante (a MESMA fórmula da
 * condição), temperatura média, rpm médio e os limites temporais. O sensor e o ponto são os
 * do cadastro no momento do cálculo — um ciclo de sensor desassociado sai com ponto nulo.
 */
export async function loadCycleEvidence(
  client: SqlClient,
  cycleIds: readonly string[],
): Promise<CycleEvidence[]> {
  if (cycleIds.length === 0) return [];
  const ids = [...cycleIds];
  const rows = await client.$queryRaw<EvidenceRow[]>`
    WITH cyc AS (
      SELECT c.id AS cycle_id, c."measuringSystemUid" AS serial, s.id AS sensor_id, s."monitoringPointId" AS point_id
      FROM ingestion_cycles c
      LEFT JOIN sensors s ON s."serialNumber" = c."measuringSystemUid"
      WHERE c.id = ANY(${ids}::text[])
    ),
    samples AS (
      SELECT p."ingestionCycleId" AS cycle_id, ts."physicalQuantity" AS quantity, ts.axis AS axis,
             p."timestamp" AS at, p.value AS value
      FROM time_series_samples p
      JOIN time_series ts ON ts.id = p."timeSeriesId"
      WHERE p."ingestionCycleId" = ANY(${ids}::text[])
    ),
    bounds AS (
      SELECT cycle_id, min(at) AS started_at, max(at) AS ended_at FROM samples GROUP BY cycle_id
    ),
    radial AS (
      SELECT y.cycle_id,
             sqrt(avg((y.value * y.value + z.value * z.value) / 2)) AS radial_rms,
             count(*)::bigint AS radial_n
      FROM samples y
      JOIN samples z ON z.cycle_id = y.cycle_id AND z.at = y.at AND z.quantity = 'ACCELERATION' AND z.axis = 'Z'
      WHERE y.quantity = 'ACCELERATION' AND y.axis = 'Y'
      GROUP BY y.cycle_id
    ),
    temperature AS (
      SELECT cycle_id, avg(value) AS temperature_avg, count(*)::bigint AS temperature_n
      FROM samples WHERE quantity = 'TEMPERATURE' GROUP BY cycle_id
    ),
    rpm AS (
      SELECT cycle_id, avg(value) AS rpm_avg FROM samples WHERE quantity = 'ROTATIONAL_SPEED' GROUP BY cycle_id
    )
    SELECT cyc.cycle_id, cyc.serial, cyc.sensor_id, cyc.point_id,
           b.started_at, b.ended_at,
           r.radial_rms, coalesce(r.radial_n, 0)::bigint AS radial_n,
           t.temperature_avg, coalesce(t.temperature_n, 0)::bigint AS temperature_n,
           rp.rpm_avg
    FROM cyc
    JOIN bounds b ON b.cycle_id = cyc.cycle_id
    LEFT JOIN radial r ON r.cycle_id = cyc.cycle_id
    LEFT JOIN temperature t ON t.cycle_id = cyc.cycle_id
    LEFT JOIN rpm rp ON rp.cycle_id = cyc.cycle_id
    ORDER BY b.started_at, cyc.cycle_id
  `;
  return rows.map((row) => ({
    cycleId: row.cycle_id,
    sensorSerialNumber: row.serial,
    sensorId: row.sensor_id,
    monitoringPointId: row.point_id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    radialRms: row.radial_rms,
    radialSampleCount: Number(row.radial_n),
    temperatureAvg: row.temperature_avg,
    temperatureCount: Number(row.temperature_n),
    rpmAvg: row.rpm_avg,
  }));
}

export interface CycleRef {
  cycleId: string;
  startedAt: Date;
}

/**
 * Ciclos cuja aquisição começou na janela, na ordem em que o motor deve aplicá-los. Usa a
 * série Y de aceleração como âncora (toda aquisição do contrato a traz) porque o índice
 * `(timeSeriesId, timestamp)` torna a busca por janela barata; o `createdAt` do ciclo não
 * serve — a ordem de ingestão não é a ordem dos fatos.
 */
export async function listCyclesStartedBetween(
  client: SqlClient,
  from: Date,
  to: Date,
  serialNumbers?: readonly string[],
): Promise<CycleRef[]> {
  const serialFilter =
    serialNumbers && serialNumbers.length > 0
      ? Prisma.sql`AND s."serialNumber" = ANY(${[...serialNumbers]}::text[])`
      : Prisma.empty;
  const rows = await client.$queryRaw<Array<{ cycle_id: string; started_at: Date }>>`
    SELECT p."ingestionCycleId" AS cycle_id, min(p."timestamp") AS started_at
    FROM time_series ts
    JOIN sensors s ON s.id = ts."sensorId"
    JOIN time_series_samples p ON p."timeSeriesId" = ts.id
    WHERE ts."physicalQuantity" = 'ACCELERATION' AND ts.axis = 'Y'
      AND p."ingestionCycleId" IS NOT NULL
      AND p."timestamp" >= ${from} AND p."timestamp" < ${to}
      ${serialFilter}
    GROUP BY 1
    ORDER BY 2, 1
  `;
  return rows.map((row) => ({ cycleId: row.cycle_id, startedAt: row.started_at }));
}

export interface LearningRow {
  startedAt: Date;
  value: number;
}

/**
 * As leituras que contaram para o aprendizado de (regra, ponto, sensor): as avaliações
 * LEARNING desta versão da política, unidas à evidência imutável. É daqui — nunca das
 * amostras — que o perfil de baseline é calculado.
 */
export async function loadLearningRows(
  client: SqlClient,
  params: {
    ruleId: string;
    policyVersion: number;
    monitoringPointId: string;
    sensorId: string;
    from: Date;
    limit: number;
    column: 'radialRms' | 'temperatureAvg';
  },
): Promise<LearningRow[]> {
  const column = params.column === 'radialRms' ? Prisma.raw('e."radialRms"') : Prisma.raw('e."temperatureAvg"');
  const rows = await client.$queryRaw<Array<{ started_at: Date; value: number | null }>>`
    SELECT e."startedAt" AS started_at, ${column} AS value
    FROM alert_rule_evaluations ev
    JOIN alert_cycle_evidence e ON e."cycleId" = ev."cycleId"
    WHERE ev."ruleId" = ${params.ruleId}
      AND ev."policyVersion" = ${params.policyVersion}
      AND ev.outcome = 'LEARNING'
      AND e."monitoringPointId" = ${params.monitoringPointId}
      AND e."sensorId" = ${params.sensorId}
      AND e."startedAt" >= ${params.from}
    ORDER BY e."startedAt", e."cycleId"
    LIMIT ${params.limit}
  `;
  return rows.flatMap((row) => (row.value === null ? [] : [{ startedAt: row.started_at, value: row.value }]));
}
