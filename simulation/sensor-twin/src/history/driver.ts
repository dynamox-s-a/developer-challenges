/**
 * Orquestração da carga histórica — dependências injetadas (geração, POST, relogin,
 * relógio) para ser testável sem workers nem rede. Fluxo: aquecimento sequencial por
 * sensor (cria séries sem corrida), depois faixas concorrentes com limite de POSTs em
 * voo, retry determinístico e abort alto em erro de contrato/colisão.
 */
import type { IngestAttempt } from '../ingest';
import type { PlantSensor } from '../plant';
import type { ResolvedResourceIds } from '../fleet';
import { identityFor } from '../fleet';
import type { GeneratedCycle, HistoryJob } from './build';
import { planSlot } from './narrative';
import type { HistoryGap, HistorySchedule, HistorySlot } from './schedule';

export type AttemptClass = 'created' | 'duplicate' | 'retry' | 'reauth' | 'fatal';

const RETRYABLE_STATUS = new Set([0, 408, 425, 429, 500, 502, 503, 504]);

export function classifyAttempt(attempt: IngestAttempt): AttemptClass {
  if (attempt.status === 201) return 'created';
  if (attempt.status === 200) return 'duplicate';
  if (attempt.status === 401) return 'reauth';
  if (RETRYABLE_STATUS.has(attempt.status)) return 'retry';
  return 'fatal';
}

/** Backoff exponencial com jitter DETERMINÍSTICO (derivado do jobId; nada do gerador nativo). */
export function backoffMs(attempt: number, jobId: number): number {
  return Math.min(8_000, 500 * 2 ** (attempt - 1)) + 137 * (jobId % 7);
}

export function fatalHint(attempt: IngestAttempt, slot: HistorySlot): string {
  const where = `${slot.sensorSerial} @ ${slot.startIso}`;
  switch (attempt.errorCode) {
    case 'SAMPLE_TIMESTAMP_CONFLICT':
      return `${where}: a série já tem amostras nesse instante com conteúdo diferente — época/narrativa divergente ou dado estranho. Reexecute com --epoch <época detectada> ou rode npm run history:purge.`;
    case 'IDEMPOTENCY_KEY_REUSED':
      return `${where}: gerador ou narrativa mudaram desde que este slot foi ingerido — rode npm run history:purge antes de regenerar.`;
    case 'RESOURCE_ID_MISMATCH':
    case 'SENSOR_NOT_FOUND':
    case 'SENSOR_NOT_ASSOCIATED':
      return `${where}: a planta não está como o manifest espera — rode npm run plant -- bootstrap.`;
    case 'CONTRACT_VIOLATION':
    case 'NON_CANONICAL_TIMESTAMP':
    case 'QUANTITY_AXIS_MISMATCH':
      return `${where}: o gerador produziu um ciclo fora do contrato (HTTP ${attempt.status} ${attempt.errorCode}) — bug, não reexecute.`;
    default:
      return `${where}: HTTP ${attempt.status} ${attempt.errorCode ?? ''} ${attempt.networkError ?? ''}`.trim();
  }
}

export interface DriverDeps {
  generate(job: HistoryJob): Promise<GeneratedCycle>;
  post(cycle: GeneratedCycle): Promise<IngestAttempt>;
  reauth(): Promise<void>;
  now(): number;
  sleep(ms: number): Promise<void>;
  log(line: string): void;
}

export interface DriverOptions {
  /** POSTs simultâneos. */
  concurrency: number;
  /** Faixas de trabalho (geração adiantada); default concurrency + 2. */
  lanes?: number;
  retries: number;
  sinceMs?: number;
  limit?: number;
  progressEveryMs: number;
}

export interface SensorReport {
  planned: number;
  created: number;
  duplicate: number;
  failed: number;
  firstSlot: string | null;
  lastSlot: string | null;
  lastDoneSlot: string | null;
}

export interface HistoryReport {
  range: { epoch: string; end: string; everyMinutes: number; days: number };
  sensors: string[];
  totals: { planned: number; created: number; duplicate: number; retried: number; failed: number; samples: number };
  perSensor: Record<string, SensorReport>;
  gaps: Array<{ kind: HistoryGap['kind']; from: string; to: string; sensors: 'all' | readonly string[] }>;
  timing: {
    elapsedMs: number;
    generateAvgMs: number;
    postAvgMs: number;
    postP95Ms: number;
    cyclesPerSecond: number;
    samplesPerSecond: number;
    throughputWindows: Array<{ atMs: number; done: number; cyclesPerSecond: number }>;
  };
  aborted?: { reason: string; slot: string; sensor: string; hint: string };
}

export function planJobs(
  schedule: HistorySchedule,
  sensors: readonly PlantSensor[],
  resourceIds: ResolvedResourceIds,
  options: Pick<DriverOptions, 'sinceMs' | 'limit'> = {},
): HistoryJob[] {
  const bySerial = new Map(sensors.map((sensor) => [sensor.sensorSerial, sensor]));
  const identities = new Map(sensors.map((sensor) => [sensor.sensorSerial, identityFor(sensor, resourceIds)]));
  const jobs: HistoryJob[] = [];
  for (const slot of schedule.slots) {
    if (options.sinceMs !== undefined && slot.startMs < options.sinceMs) continue;
    const sensor = bySerial.get(slot.sensorSerial);
    if (!sensor) continue;
    const planned = planSlot(slot, sensor, schedule);
    jobs.push({
      jobId: jobs.length,
      slot,
      identity: identities.get(slot.sensorSerial)!,
      overrides: planned.overrides,
      extras: planned.extras,
    });
    if (options.limit !== undefined && jobs.length >= options.limit) break;
  }
  return jobs;
}

class Semaphore {
  private queue: Array<() => void> = [];
  private active = 0;
  constructor(private readonly max: number) {}
  async acquire(): Promise<void> {
    if (this.active < this.max) {
      this.active += 1;
      return;
    }
    await new Promise<void>((resolve) => this.queue.push(resolve));
    this.active += 1;
  }
  release(): void {
    this.active -= 1;
    const next = this.queue.shift();
    if (next) next();
  }
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
}

export async function runHistory(
  schedule: HistorySchedule,
  sensors: readonly PlantSensor[],
  resourceIds: ResolvedResourceIds,
  deps: DriverDeps,
  options: DriverOptions,
): Promise<HistoryReport> {
  const startedAt = deps.now();
  const jobs = planJobs(schedule, sensors, resourceIds, options);
  const perSensor: Record<string, SensorReport> = {};
  for (const sensor of sensors) {
    const own = jobs.filter((job) => job.slot.sensorSerial === sensor.sensorSerial);
    perSensor[sensor.sensorSerial] = {
      planned: own.length,
      created: 0,
      duplicate: 0,
      failed: 0,
      firstSlot: own[0]?.slot.startIso ?? null,
      lastSlot: own[own.length - 1]?.slot.startIso ?? null,
      lastDoneSlot: null,
    };
  }
  const totals = { planned: jobs.length, created: 0, duplicate: 0, retried: 0, failed: 0, samples: 0 };
  const generateMs: number[] = [];
  const postMs: number[] = [];
  const throughputWindows: HistoryReport['timing']['throughputWindows'] = [];
  let aborted: HistoryReport['aborted'];
  let done = 0;
  let lastProgressAt = startedAt;
  let lastProgressDone = 0;
  let lastSlotIso = '—';

  const progress = (force = false) => {
    const now = deps.now();
    if (!force && now - lastProgressAt < options.progressEveryMs) return;
    const windowSeconds = Math.max(0.001, (now - lastProgressAt) / 1000);
    const rate = (done - lastProgressDone) / windowSeconds;
    throughputWindows.push({ atMs: now - startedAt, done, cyclesPerSecond: Number(rate.toFixed(2)) });
    const remaining = totals.planned - done;
    const overall = done / Math.max(0.001, (now - startedAt) / 1000);
    const etaSeconds = overall > 0 ? remaining / overall : 0;
    const pct = totals.planned > 0 ? ((done / totals.planned) * 100).toFixed(1) : '100.0';
    deps.log(
      `${String(done).padStart(6)}/${totals.planned} (${pct}%) criados=${totals.created} dup=${totals.duplicate} falhas=${totals.failed} | ${rate.toFixed(1)} cic/s | ETA ${Math.round(etaSeconds / 60)} min | último=${lastSlotIso}`,
    );
    lastProgressAt = now;
    lastProgressDone = done;
  };

  const postSemaphore = new Semaphore(options.concurrency);
  let reauthPending: Promise<void> | null = null;

  const postWithRetry = async (job: HistoryJob, cycle: GeneratedCycle): Promise<AttemptClass> => {
    let attempt = 0;
    let reauthed = false;
    for (;;) {
      attempt += 1;
      await postSemaphore.acquire();
      const t0 = deps.now();
      let result: IngestAttempt;
      try {
        result = await deps.post(cycle);
      } finally {
        postMs.push(deps.now() - t0);
        postSemaphore.release();
      }
      const cls = classifyAttempt(result);
      if (cls === 'created' || cls === 'duplicate') return cls;
      if (cls === 'reauth' && !reauthed) {
        reauthed = true;
        reauthPending ??= deps.reauth().finally(() => {
          reauthPending = null;
        });
        await reauthPending;
        continue;
      }
      if (cls === 'retry' && attempt <= options.retries) {
        totals.retried += 1;
        await deps.sleep(backoffMs(attempt, job.jobId));
        continue;
      }
      aborted ??= {
        reason: result.errorCode ?? (result.networkError ? `rede: ${result.networkError}` : `HTTP ${result.status}`),
        slot: job.slot.startIso,
        sensor: job.slot.sensorSerial,
        hint: cls === 'retry' ? `${fatalHint(result, job.slot)} (tentativas esgotadas)` : fatalHint(result, job.slot),
      };
      return 'fatal';
    }
  };

  const record = (job: HistoryJob, cycle: GeneratedCycle, cls: AttemptClass) => {
    const sensor = perSensor[job.slot.sensorSerial];
    if (cls === 'created') {
      totals.created += 1;
      totals.samples += cycle.sampleCount;
      sensor.created += 1;
    } else if (cls === 'duplicate') {
      totals.duplicate += 1;
      sensor.duplicate += 1;
    } else {
      totals.failed += 1;
      sensor.failed += 1;
    }
    if (cls !== 'fatal') sensor.lastDoneSlot = job.slot.startIso;
    done += 1;
    lastSlotIso = job.slot.startIso;
    progress();
  };

  const processJob = async (job: HistoryJob): Promise<AttemptClass> => {
    const g0 = deps.now();
    const cycle = await deps.generate(job);
    generateMs.push(deps.now() - g0);
    const cls = await postWithRetry(job, cycle);
    record(job, cycle, cls);
    return cls;
  };

  // 1) Aquecimento: o primeiro slot de cada sensor, em sequência — cria as séries que
  //    ainda não existam sem dois ciclos do mesmo sensor correrem no mesmo instante.
  const warmed = new Set<number>();
  for (const sensor of sensors) {
    if (aborted) break;
    const first = jobs.find((job) => job.slot.sensorSerial === sensor.sensorSerial);
    if (!first) continue;
    warmed.add(first.jobId);
    await processJob(first);
  }

  // 2) Faixas concorrentes: cada faixa gera o próximo ciclo enquanto os POSTs anteriores
  //    ainda estão em voo; o semáforo limita os POSTs simultâneos.
  if (!aborted) {
    let cursor = 0;
    const nextJob = (): HistoryJob | null => {
      while (cursor < jobs.length) {
        const job = jobs[cursor];
        cursor += 1;
        if (!warmed.has(job.jobId)) return job;
      }
      return null;
    };
    const lane = async () => {
      for (;;) {
        if (aborted) return;
        const job = nextJob();
        if (!job) return;
        await processJob(job);
      }
    };
    const laneCount = Math.max(1, options.lanes ?? options.concurrency + 2);
    await Promise.all(Array.from({ length: laneCount }, () => lane()));
  }

  progress(true);
  const elapsedMs = deps.now() - startedAt;
  const avg = (values: number[]) => (values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length);
  return {
    range: {
      epoch: new Date(schedule.range.epochMs).toISOString(),
      end: new Date(schedule.range.endMs).toISOString(),
      everyMinutes: schedule.range.everyMs / 60_000,
      days: schedule.range.days,
    },
    sensors: sensors.map((sensor) => sensor.sensorSerial),
    totals,
    perSensor,
    gaps: schedule.gaps.map((gap) => ({
      kind: gap.kind,
      from: new Date(gap.fromMs).toISOString(),
      to: new Date(gap.toMs).toISOString(),
      sensors: gap.sensors,
    })),
    timing: {
      elapsedMs,
      generateAvgMs: Number(avg(generateMs).toFixed(1)),
      postAvgMs: Number(avg(postMs).toFixed(1)),
      postP95Ms: percentile(postMs, 0.95),
      cyclesPerSecond: Number((done / Math.max(0.001, elapsedMs / 1000)).toFixed(2)),
      samplesPerSecond: Number((totals.samples / Math.max(0.001, elapsedMs / 1000)).toFixed(0)),
      throughputWindows,
    },
    ...(aborted ? { aborted } : {}),
  };
}
