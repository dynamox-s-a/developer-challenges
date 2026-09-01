/**
 * HISTÓRICO OPERACIONAL ANTERIOR — três meses de episódios de alerta ENCERRADOS
 * (01/03/2026 → 31/05/2026), todos anteriores à primeira amostra de telemetria (01/06).
 *
 * Por que existe: o motor de alertas real cobre só o mês de histórico sintético, e um mês
 * de planta bem calibrada produz poucos episódios — correto, mas irreal para demonstrar a
 * LISTAGEM (paginação, filtros, busca) como numa operação de verdade. Este seed popula a
 * operação anterior: paradas de domingo, quedas curtas de telemetria (a maior fonte de
 * eventos em campo), episódios de vibração e de temperatura com abertura, escalada,
 * reconhecimento e resolução próprios.
 *
 * Regras de honestidade, na ordem em que importam:
 *  1. NADA aqui toca o período rotulado (≥ 01/06): `alerts:validate` e `demo:verify`
 *     continuam medindo exclusivamente o que o MOTOR decidiu. Um assert garante a fronteira.
 *  2. Todos os episódios estão RESOLVIDOS — os alertas ativos da aplicação são sempre do
 *     motor. Nenhum KPI de "abertos" é inflado por este seed.
 *  3. Os episódios são bem-formados: snapshots do cadastro real, eventos completos
 *     (OPENED → ESCALATED? → ACKNOWLEDGED? → RESOLVED), evidência coerente com a regra
 *     (razão × baseline, ΔT, intervalos de silêncio) e `policyVersion` da regra vigente.
 *     Ciclos de ingestão não existem nesse período, então `triggerCycleId` fica nulo —
 *     exatamente como a UI degrada.
 *  4. "Randômico" aqui é PSEUDO-randômico com seed fixa: a mesma operação nasce igual em
 *     qualquer máquina, e reexecutar não duplica nada (IDs determinísticos + upsert).
 *
 * Uso:  npm run alerts:seed-history            # popula (idempotente)
 *       npm run alerts:seed-history -- --dry-run
 *       npm run alerts:seed-history -- --reset --yes   # apaga o lote (< 01/06) e recria
 */
import { PrismaClient, type Prisma } from '@prisma/client';

export const OPERATIONS_START_MS = Date.UTC(2026, 2, 1); // 01/03/2026
export const HISTORY_START_MS = Date.UTC(2026, 5, 1); // 01/06/2026 — primeira telemetria

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;
/** Margem de segurança: nenhum episódio encosta na fronteira do período rotulado. */
const SAFETY_MS = 6 * HOUR_MS;

const RULE_KEYS = ['vibration-radial', 'temperature-delta', 'telemetry-presence'] as const;

/** LCG com seed fixa — mesma sequência em qualquer máquina (mesma técnica do seed.ts). */
function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

/** UUID v4 derivado do PRNG: determinístico ⇒ reexecutar produz os MESMOS ids. */
function uuidFrom(rand: () => number): string {
  const bytes = Array.from({ length: 16 }, () => Math.floor(rand() * 256) & 0xff);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

interface InstrumentedPoint {
  machineId: string;
  machineName: string;
  pointId: string;
  pointName: string;
  sensorId: string;
  serial: string;
  /** Baseline plausível do RMS radial (g) — estável por sensor entre execuções. */
  vibrationBaseline: number;
  /** Temperatura típica do mancal (°C). */
  temperatureBaseline: number;
}

interface Episode {
  occurrence: Prisma.AlertOccurrenceCreateManyInput;
  events: Prisma.AlertEventCreateManyInput[];
}

export interface SeedHistoryOptions {
  dryRun?: boolean;
  log?: (line: string) => void;
}

export interface SeedHistoryResult {
  skipped: string | null;
  planned: number;
  created: number;
  alreadyExisting: number;
  byType: Record<string, number>;
}

const ACK_NOTES = [
  'Inspeção visual programada para o próximo turno.',
  'Equipe de manutenção acionada.',
  'Acompanhando a tendência após reaperto do mancal.',
  'Verificado com a operação: carga acima do usual no período.',
  null,
  null,
];

// eslint-disable-next-line complexity -- geração de cenário: sequência linear de sorteios
export async function seedOperationalHistory(
  prisma: PrismaClient,
  options: SeedHistoryOptions = {},
): Promise<SeedHistoryResult> {
  const log = options.log ?? ((line: string) => console.log(line));
  const empty: SeedHistoryResult = { skipped: null, planned: 0, created: 0, alreadyExisting: 0, byType: {} };

  const rules = await prisma.alertRule.findMany({ where: { key: { in: [...RULE_KEYS] } } });
  const byKey = new Map(rules.map((rule) => [rule.key, rule]));
  const vibration = byKey.get('vibration-radial');
  const temperature = byKey.get('temperature-delta');
  const presence = byKey.get('telemetry-presence');
  if (!vibration || !temperature || !presence) {
    return { ...empty, skipped: 'regras da política de alertas ausentes (rode o seed principal antes)' };
  }

  const rawPoints = await prisma.monitoringPoint.findMany({
    include: { machine: true, sensor: true },
    orderBy: [{ machine: { name: 'asc' } }, { name: 'asc' }],
  });
  const instrumented = rawPoints.filter((point) => point.sensor !== null);
  if (instrumented.length < 12) {
    return {
      ...empty,
      skipped: `planta completa ausente (${instrumented.length}/12 pontos instrumentados) — rode após o cadastro da planta de demonstração`,
    };
  }

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, orderBy: { email: 'asc' } });

  const rand = createRandom(0x5eeda1e7);
  const between = (min: number, max: number): number => min + rand() * (max - min);
  const chance = (probability: number): boolean => rand() < probability;
  const pick = <T>(items: readonly T[]): T => items[Math.floor(rand() * items.length)];

  const points: InstrumentedPoint[] = instrumented.map((point) => ({
    machineId: point.machineId,
    machineName: point.machine.name,
    pointId: point.id,
    pointName: point.name,
    sensorId: point.sensor!.id,
    serial: point.sensor!.serialNumber,
    vibrationBaseline: Number(between(0.014, 0.019).toFixed(4)),
    temperatureBaseline: Number(between(55, 73).toFixed(1)),
  }));

  const episodes: Episode[] = [];
  const round = (value: number, digits: number): number => Number(value.toFixed(digits));

  /** Reconhecimento humano opcional, entre a abertura e a resolução. */
  const maybeAcknowledge = (
    occurrence: Prisma.AlertOccurrenceCreateManyInput,
    events: Prisma.AlertEventCreateManyInput[],
    openedMs: number,
    resolvedMs: number,
    level: 'A1' | 'A2',
    probability: number,
  ): void => {
    if (!chance(probability)) return;
    const ackMs = openedMs + (resolvedMs - openedMs) * between(0.15, 0.7);
    const note = pick(ACK_NOTES);
    occurrence.acknowledgedAt = new Date(ackMs);
    occurrence.acknowledgedById = admin?.id ?? null;
    occurrence.acknowledgedByEmail = admin?.email ?? 'analista@dynamox.local';
    occurrence.acknowledgedLevel = level;
    occurrence.acknowledgeNote = note;
    events.push({
      id: uuidFrom(rand),
      alertId: occurrence.id!,
      type: 'ACKNOWLEDGED',
      fromState: 'ACTIVE',
      toState: 'ACTIVE',
      fromLevel: level,
      toLevel: level,
      occurredAt: new Date(ackMs),
      actorUserId: admin?.id ?? null,
      actorEmail: admin?.email ?? 'analista@dynamox.local',
      note,
    });
  };

  const conditionEpisode = (
    kind: 'vibration' | 'temperature',
    point: InstrumentedPoint,
    openedMsInput: number,
  ): Episode => {
    let openedMs = openedMsInput;
    const rule = kind === 'vibration' ? vibration : temperature;
    const escalates = chance(kind === 'vibration' ? 0.25 : 0.2);
    const durationMs =
      kind === 'vibration' ? between(4 * HOUR_MS, 4 * DAY_MS) : between(6 * HOUR_MS, 2 * DAY_MS);
    openedMs = Math.min(openedMs, HISTORY_START_MS - SAFETY_MS - durationMs);
    const resolvedMs = openedMs + durationMs;
    const id = uuidFrom(rand);

    const baseline = kind === 'vibration' ? point.vibrationBaseline : point.temperatureBaseline;
    // Medida na abertura (A1) e no pico — nas unidades da regra: razão (×) ou delta (°C).
    const triggerMeasure = kind === 'vibration' ? between(1.52, 1.78) : between(5.1, 6.4);
    const peakMeasure = escalates
      ? kind === 'vibration'
        ? between(2.1, 3.3)
        : between(10.2, 12.5)
      : kind === 'vibration'
        ? between(1.62, 1.98)
        : between(6.0, 9.4);
    const lastMeasure = kind === 'vibration' ? between(1.22, 1.38) : between(1.8, 2.9);
    const toValue = (measure: number): number =>
      kind === 'vibration' ? round(baseline * measure, 4) : round(baseline + measure, 1);

    const escalatedMs = openedMs + (resolvedMs - openedMs) * between(0.2, 0.6);
    const peakMs = escalates ? escalatedMs : openedMs + (resolvedMs - openedMs) * between(0.3, 0.8);
    const level: 'A1' | 'A2' = escalates ? 'A2' : 'A1';

    const occurrence: Prisma.AlertOccurrenceCreateManyInput = {
      id,
      ruleId: rule.id,
      type: rule.type,
      scope: 'POINT',
      level,
      state: 'RESOLVED',
      activeKey: null,
      machineId: point.machineId,
      machineName: point.machineName,
      monitoringPointId: point.pointId,
      monitoringPointName: point.pointName,
      sensorId: point.sensorId,
      sensorSerialNumber: point.serial,
      openedAt: new Date(openedMs),
      lastEvaluatedAt: new Date(resolvedMs),
      resolvedAt: new Date(resolvedMs),
      resolutionReason: 'CONDITION_CLEARED',
      metric: rule.metric,
      unit: rule.unit,
      thresholdMode: rule.thresholdMode,
      triggerCycleId: null,
      triggerAt: new Date(openedMs),
      triggerValue: toValue(triggerMeasure),
      triggerBaseline: baseline,
      triggerMeasure: round(triggerMeasure, 2),
      triggerThreshold: rule.a1Threshold,
      consecutiveEvaluations: rule.consecutiveTrigger,
      peakValue: toValue(peakMeasure),
      peakMeasure: round(peakMeasure, 2),
      peakAt: new Date(peakMs),
      peakCycleId: null,
      lastValue: toValue(lastMeasure),
      lastMeasure: round(lastMeasure, 2),
      lastCycleId: null,
      affectedCount: null,
      policyVersion: rule.policyVersion,
    };

    const events: Prisma.AlertEventCreateManyInput[] = [
      {
        id: uuidFrom(rand),
        alertId: id,
        type: 'OPENED',
        fromState: null,
        toState: 'ACTIVE',
        fromLevel: null,
        toLevel: 'A1',
        occurredAt: new Date(openedMs),
        value: occurrence.triggerValue,
        measure: occurrence.triggerMeasure,
        threshold: rule.a1Threshold,
      },
    ];
    if (escalates) {
      events.push({
        id: uuidFrom(rand),
        alertId: id,
        type: 'ESCALATED',
        fromState: 'ACTIVE',
        toState: 'ACTIVE',
        fromLevel: 'A1',
        toLevel: 'A2',
        occurredAt: new Date(escalatedMs),
        value: occurrence.peakValue,
        measure: occurrence.peakMeasure,
        threshold: rule.a2Threshold,
      });
    }
    maybeAcknowledge(occurrence, events, openedMs, resolvedMs, level, escalates ? 0.7 : 0.35);
    events.push({
      id: uuidFrom(rand),
      alertId: id,
      type: 'RESOLVED',
      fromState: 'ACTIVE',
      toState: 'RESOLVED',
      fromLevel: level,
      toLevel: level,
      occurredAt: new Date(resolvedMs),
      value: occurrence.lastValue,
      measure: occurrence.lastMeasure,
      threshold: rule.clearThreshold,
    });
    return { occurrence, events };
  };

  const silenceEpisode = (point: InstrumentedPoint, openedMsInput: number): Episode => {
    let openedMs = openedMsInput;
    const long = chance(0.12);
    const durationMs = long ? between(26 * HOUR_MS, 40 * HOUR_MS) : between(1.2 * HOUR_MS, 6 * HOUR_MS);
    openedMs = Math.min(openedMs, HISTORY_START_MS - SAFETY_MS - durationMs);
    const resolvedMs = openedMs + durationMs;
    const escalates = long && resolvedMs - openedMs > 24 * HOUR_MS;
    const level: 'A1' | 'A2' = escalates ? 'A2' : 'A1';
    const id = uuidFrom(rand);
    const intervalS = presence.expectedIntervalSeconds ?? 900;
    const silenceSeconds = Math.round((resolvedMs - openedMs) / 1000) + presence.a1Threshold * intervalS;

    const occurrence: Prisma.AlertOccurrenceCreateManyInput = {
      id,
      ruleId: presence.id,
      type: 'SENSOR_SILENT',
      scope: 'POINT',
      level,
      state: 'RESOLVED',
      activeKey: null,
      machineId: point.machineId,
      machineName: point.machineName,
      monitoringPointId: point.pointId,
      monitoringPointName: point.pointName,
      sensorId: point.sensorId,
      sensorSerialNumber: point.serial,
      openedAt: new Date(openedMs),
      lastEvaluatedAt: new Date(resolvedMs),
      resolvedAt: new Date(resolvedMs),
      resolutionReason: 'TELEMETRY_RESUMED',
      metric: presence.metric,
      unit: presence.unit,
      thresholdMode: presence.thresholdMode,
      triggerCycleId: null,
      triggerAt: new Date(openedMs),
      triggerValue: presence.a1Threshold * intervalS,
      triggerBaseline: null,
      triggerMeasure: presence.a1Threshold,
      triggerThreshold: presence.a1Threshold,
      consecutiveEvaluations: 1,
      peakValue: silenceSeconds,
      peakMeasure: round(silenceSeconds / intervalS, 1),
      peakAt: new Date(resolvedMs),
      peakCycleId: null,
      lastValue: silenceSeconds,
      lastMeasure: round(silenceSeconds / intervalS, 1),
      lastCycleId: null,
      affectedCount: null,
      policyVersion: presence.policyVersion,
    };
    const events: Prisma.AlertEventCreateManyInput[] = [
      {
        id: uuidFrom(rand),
        alertId: id,
        type: 'OPENED',
        fromState: null,
        toState: 'ACTIVE',
        fromLevel: null,
        toLevel: 'A1',
        occurredAt: new Date(openedMs),
        value: occurrence.triggerValue,
        measure: presence.a1Threshold,
        threshold: presence.a1Threshold,
      },
    ];
    if (escalates) {
      events.push({
        id: uuidFrom(rand),
        alertId: id,
        type: 'ESCALATED',
        fromState: 'ACTIVE',
        toState: 'ACTIVE',
        fromLevel: 'A1',
        toLevel: 'A2',
        occurredAt: new Date(openedMs + 24 * HOUR_MS),
        value: 24 * 3600,
        measure: presence.a2Threshold,
        threshold: presence.a2Threshold,
      });
    }
    maybeAcknowledge(occurrence, events, openedMs, resolvedMs, level, escalates ? 0.6 : 0.2);
    events.push({
      id: uuidFrom(rand),
      alertId: id,
      type: 'RESOLVED',
      fromState: 'ACTIVE',
      toState: 'RESOLVED',
      fromLevel: level,
      toLevel: level,
      occurredAt: new Date(resolvedMs),
      value: occurrence.lastValue,
      measure: occurrence.lastMeasure,
      threshold: presence.clearThreshold,
    });
    return { occurrence, events };
  };

  const fleetEpisode = (openedMsInput: number): Episode => {
    let openedMs = openedMsInput;
    const durationMs = between(4 * HOUR_MS, 9 * HOUR_MS);
    openedMs = Math.min(openedMs, HISTORY_START_MS - SAFETY_MS - durationMs);
    const resolvedMs = openedMs + durationMs;
    const id = uuidFrom(rand);
    const affected = 10 + Math.floor(rand() * 3);
    const intervalS = presence.expectedIntervalSeconds ?? 900;
    const silenceSeconds = Math.round((resolvedMs - openedMs) / 1000);
    const occurrence: Prisma.AlertOccurrenceCreateManyInput = {
      id,
      ruleId: presence.id,
      type: 'FLEET_SILENT',
      scope: 'FLEET',
      level: 'A1',
      state: 'RESOLVED',
      activeKey: null,
      machineId: null,
      machineName: null,
      monitoringPointId: null,
      monitoringPointName: null,
      sensorId: null,
      sensorSerialNumber: null,
      openedAt: new Date(openedMs),
      lastEvaluatedAt: new Date(resolvedMs),
      resolvedAt: new Date(resolvedMs),
      resolutionReason: 'TELEMETRY_RESUMED',
      metric: presence.metric,
      unit: presence.unit,
      thresholdMode: presence.thresholdMode,
      triggerCycleId: null,
      triggerAt: new Date(openedMs),
      triggerValue: presence.a1Threshold * intervalS,
      triggerBaseline: null,
      triggerMeasure: presence.a1Threshold,
      triggerThreshold: presence.a1Threshold,
      consecutiveEvaluations: 1,
      peakValue: silenceSeconds,
      peakMeasure: round(silenceSeconds / intervalS, 1),
      peakAt: new Date(resolvedMs),
      peakCycleId: null,
      lastValue: silenceSeconds,
      lastMeasure: round(silenceSeconds / intervalS, 1),
      lastCycleId: null,
      affectedCount: affected,
      policyVersion: presence.policyVersion,
    };
    const events: Prisma.AlertEventCreateManyInput[] = [
      {
        id: uuidFrom(rand),
        alertId: id,
        type: 'OPENED',
        fromState: null,
        toState: 'ACTIVE',
        fromLevel: null,
        toLevel: 'A1',
        occurredAt: new Date(openedMs),
        value: occurrence.triggerValue,
        measure: presence.a1Threshold,
        threshold: presence.a1Threshold,
      },
      {
        id: uuidFrom(rand),
        alertId: id,
        type: 'RESOLVED',
        fromState: 'ACTIVE',
        toState: 'RESOLVED',
        fromLevel: 'A1',
        toLevel: 'A1',
        occurredAt: new Date(resolvedMs),
        value: occurrence.lastValue,
        measure: occurrence.lastMeasure,
        threshold: presence.clearThreshold,
      },
    ];
    return { occurrence, events };
  };

  // ---- A operação, dia a dia ---------------------------------------------------------
  const totalDays = Math.round((HISTORY_START_MS - OPERATIONS_START_MS) / DAY_MS);
  for (let day = 0; day < totalDays; day += 1) {
    const dayStartMs = OPERATIONS_START_MS + day * DAY_MS;
    const weekday = new Date(dayStartMs).getUTCDay();

    // Parada programada de domingo: a planta silencia junto — um episódio de FROTA.
    if (weekday === 0) {
      episodes.push(fleetEpisode(dayStartMs + between(5, 8) * HOUR_MS));
    }

    // Quedas curtas de telemetria — a fonte mais comum de eventos numa frota real.
    if (chance(0.95)) {
      episodes.push(silenceEpisode(pick(points), dayStartMs + between(0, 22) * HOUR_MS));
    }
    if (chance(0.35)) {
      episodes.push(silenceEpisode(pick(points), dayStartMs + between(0, 22) * HOUR_MS));
    }

    // Episódios de condição: vibração mais frequente que temperatura, como em campo.
    if (chance(0.38)) {
      episodes.push(conditionEpisode('vibration', pick(points), dayStartMs + between(6, 20) * HOUR_MS));
    }
    if (chance(0.25)) {
      episodes.push(conditionEpisode('temperature', pick(points), dayStartMs + between(8, 20) * HOUR_MS));
    }
  }

  // ---- Fronteira dura: nada encosta no período rotulado -------------------------------
  for (const episode of episodes) {
    const opened = episode.occurrence.openedAt as Date;
    const resolved = episode.occurrence.resolvedAt as Date;
    if (resolved.getTime() >= HISTORY_START_MS) {
      throw new Error(
        `episódio ${episode.occurrence.id} terminaria em ${resolved.toISOString()}, dentro do período rotulado — bug do gerador`,
      );
    }
    if (resolved.getTime() <= opened.getTime()) {
      throw new Error(
        `episódio ${episode.occurrence.id} resolveria (${resolved.toISOString()}) antes de abrir (${opened.toISOString()}) — bug do gerador`,
      );
    }
  }

  const byType: Record<string, number> = {};
  for (const episode of episodes) {
    byType[episode.occurrence.type as string] = (byType[episode.occurrence.type as string] ?? 0) + 1;
  }

  const ids = episodes.map((episode) => episode.occurrence.id!);
  const existing = new Set(
    (await prisma.alertOccurrence.findMany({ where: { id: { in: ids } }, select: { id: true } })).map((row) => row.id),
  );
  const toCreate = episodes.filter((episode) => !existing.has(episode.occurrence.id!));

  if (!options.dryRun && toCreate.length > 0) {
    // Lotes: ~200 ocorrências e ~600 eventos — duas createMany dão conta.
    await prisma.$transaction([
      prisma.alertOccurrence.createMany({ data: toCreate.map((episode) => episode.occurrence) }),
      prisma.alertEvent.createMany({ data: toCreate.flatMap((episode) => episode.events) }),
    ]);
  }

  const acked = episodes.filter((episode) => episode.occurrence.acknowledgedAt).length;
  const a2 = episodes.filter((episode) => episode.occurrence.level === 'A2').length;
  log(
    `Histórico operacional 01/03 → 31/05: ${episodes.length} episódios ` +
      `(${Object.entries(byType).map(([type, count]) => `${type}: ${count}`).join(' · ')}; ${a2} chegaram a A2, ${acked} reconhecidos).`,
  );
  log(
    options.dryRun
      ? `--dry-run: nada gravado (${existing.size} já existiam).`
      : `${toCreate.length} criados agora, ${existing.size} já existiam — todos RESOLVED, todos antes de 01/06.`,
  );

  return {
    skipped: null,
    planned: episodes.length,
    created: options.dryRun ? 0 : toCreate.length,
    alreadyExisting: existing.size,
    byType,
  };
}

// ---- CLI ------------------------------------------------------------------------------

function assertLocalDatabase(): void {
  const url = process.env.DATABASE_URL ?? '';
  if (!/localhost|127\.0\.0\.1/.test(url)) {
    throw new Error('DATABASE_URL não aponta para um banco local — este seed é só para a demonstração.');
  }
}

async function cliMain(): Promise<void> {
  const args = process.argv.slice(2);
  const known = new Set(['--dry-run', '--reset', '--yes']);
  const unknown = args.filter((arg) => !known.has(arg));
  if (unknown.length > 0) {
    console.error(`Flag(s) desconhecida(s): ${unknown.join(', ')}. Aceitas: --dry-run, --reset, --yes.`);
    process.exitCode = 2;
    return;
  }
  assertLocalDatabase();
  const prisma = new PrismaClient();
  try {
    if (args.includes('--reset')) {
      if (!args.includes('--yes')) {
        console.error('--reset apaga TODOS os episódios anteriores a 01/06 (o lote deste seed). Confirme com --yes.');
        process.exitCode = 2;
        return;
      }
      const removed = await prisma.alertOccurrence.deleteMany({
        where: { openedAt: { lt: new Date(HISTORY_START_MS) } },
      });
      console.log(`Removidos ${removed.count} episódios anteriores a 01/06 (eventos em cascata).`);
    }
    const result = await seedOperationalHistory(prisma, { dryRun: args.includes('--dry-run') });
    if (result.skipped) {
      console.log(`Histórico operacional não populado: ${result.skipped}.`);
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

const isDirectRun = process.argv[1]?.endsWith('operational-history.ts') ?? false;
if (isDirectRun) {
  cliMain().catch((error: unknown) => {
    console.error(`alerts:seed-history falhou: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
