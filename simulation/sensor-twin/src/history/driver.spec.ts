import type { IngestAttempt } from '../ingest';
import { PLANT, plantSensors } from '../plant';
import type { GeneratedCycle, HistoryJob } from './build';
import { backoffMs, classifyAttempt, fatalHint, planJobs, runHistory, type DriverDeps } from './driver';
import { NARRATIVE } from './narrative';
import { buildHistorySchedule, resolveRange } from './schedule';

const SENSORS = plantSensors(PLANT).slice(0, 2); // P-101: SIM-HF-001 e SIM-HF-002
const RESOURCE_IDS = new Map(plantSensors(PLANT).map((s) => [s.sensorSerial, s.fixedResourceId ?? 'a'.repeat(24)]));
const SCHEDULE = buildHistorySchedule(
  resolveRange({ anchorMs: Date.parse('2026-08-29T04:00:00.000Z'), days: 1, everyMinutes: 15, untilOffsetHours: 4 }),
  NARRATIVE,
  SENSORS,
);

const attempt = (status: number, errorCode: string | null = null, networkError?: string): IngestAttempt => ({
  status,
  body: status === 200 || status === 201 ? ({ duplicate: status === 200 } as IngestAttempt['body']) : null,
  errorCode,
  errorBody: null,
  ...(networkError ? { networkError } : {}),
});

function fakeCycle(job: HistoryJob): GeneratedCycle {
  return { jobId: job.jobId, slot: job.slot, idempotencyKey: `k${job.jobId}`, fingerprint: `f${job.jobId}`, body: '{}', sampleCount: 300 };
}

function deps(post: (cycle: GeneratedCycle) => Promise<IngestAttempt>): DriverDeps & { logs: string[]; reauths: number } {
  let clock = 0;
  const d = {
    logs: [] as string[],
    reauths: 0,
    generate: async (job: HistoryJob) => fakeCycle(job),
    post,
    reauth: async () => {
      d.reauths += 1;
    },
    now: () => (clock += 10),
    sleep: async () => undefined,
    log: (line: string) => d.logs.push(line),
  };
  return d;
}

describe('classificação e política de retry', () => {
  it('classifica cada resposta na ação certa', () => {
    expect(classifyAttempt(attempt(201))).toBe('created');
    expect(classifyAttempt(attempt(200))).toBe('duplicate');
    expect(classifyAttempt(attempt(401))).toBe('reauth');
    for (const status of [0, 429, 500, 502, 503, 504]) expect(classifyAttempt(attempt(status))).toBe('retry');
    for (const status of [400, 404, 409, 422]) expect(classifyAttempt(attempt(status))).toBe('fatal');
  });

  it('backoff é determinístico e limitado', () => {
    expect(backoffMs(1, 0)).toBe(500);
    expect(backoffMs(2, 0)).toBe(1000);
    expect(backoffMs(10, 0)).toBe(8000);
    expect(backoffMs(1, 3)).toBe(backoffMs(1, 10)); // mesmo jitter para jobId ≡ (mod 7)
  });

  it('dá dicas acionáveis para os fatais do contrato', () => {
    const slot = SCHEDULE.slots[0];
    expect(fatalHint(attempt(409, 'SAMPLE_TIMESTAMP_CONFLICT'), slot)).toMatch(/history:purge/);
    expect(fatalHint(attempt(409, 'IDEMPOTENCY_KEY_REUSED'), slot)).toMatch(/purge/);
    expect(fatalHint(attempt(422, 'RESOURCE_ID_MISMATCH'), slot)).toMatch(/bootstrap/);
  });
});

describe('runHistory', () => {
  const options = { concurrency: 3, retries: 2, progressEveryMs: 0 };

  it('aquece cada sensor em sequência, depois respeita o limite de POSTs em voo', async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const order: string[] = [];
    const d = deps(async (cycle) => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      order.push(cycle.slot.sensorSerial);
      await new Promise((r) => setTimeout(r, 1));
      inFlight -= 1;
      return attempt(201);
    });
    const report = await runHistory(SCHEDULE, SENSORS, RESOURCE_IDS, d, { ...options, limit: 30 });
    expect(report.totals).toMatchObject({ planned: 30, created: 30, duplicate: 0, failed: 0, samples: 9000 });
    expect(order.slice(0, 2)).toEqual(['SIM-HF-001', 'SIM-HF-002']); // aquecimento na ordem do manifest
    expect(maxInFlight).toBeLessThanOrEqual(3);
    expect(report.perSensor['SIM-HF-001'].created + report.perSensor['SIM-HF-002'].created).toBe(30);
    expect(report.aborted).toBeUndefined();
  });

  it('reexecução: 200 vira duplicate, nada é contado como criado', async () => {
    const d = deps(async () => attempt(200));
    const report = await runHistory(SCHEDULE, SENSORS, RESOURCE_IDS, d, { ...options, limit: 12 });
    expect(report.totals).toMatchObject({ created: 0, duplicate: 12, samples: 0 });
  });

  it('5xx é repetido com backoff até criar; 401 dispara um único relogin', async () => {
    const seen = new Map<string, number>();
    const d = deps(async (cycle) => {
      const n = (seen.get(cycle.idempotencyKey) ?? 0) + 1;
      seen.set(cycle.idempotencyKey, n);
      if (cycle.jobId === 1 && n === 1) return attempt(503);
      if (cycle.jobId === 2 && n === 1) return attempt(401);
      return attempt(201);
    });
    const report = await runHistory(SCHEDULE, SENSORS, RESOURCE_IDS, d, { ...options, limit: 6 });
    expect(report.totals.created).toBe(6);
    expect(report.totals.retried).toBe(1);
    expect(d.reauths).toBe(1);
  });

  it('409 de colisão aborta com dica, sem continuar a despachar', async () => {
    let posted = 0;
    const d = deps(async (cycle) => {
      posted += 1;
      return cycle.jobId === 3 ? attempt(409, 'SAMPLE_TIMESTAMP_CONFLICT') : attempt(201);
    });
    const report = await runHistory(SCHEDULE, SENSORS, RESOURCE_IDS, d, { ...options, limit: 40 });
    expect(report.aborted?.reason).toBe('SAMPLE_TIMESTAMP_CONFLICT');
    expect(report.aborted?.hint).toMatch(/history:purge/);
    expect(report.totals.failed).toBe(1);
    expect(posted).toBeLessThan(40);
  });

  it('--since e --limit recortam os jobs em ordem cronológica', () => {
    const all = planJobs(SCHEDULE, SENSORS, RESOURCE_IDS);
    const since = planJobs(SCHEDULE, SENSORS, RESOURCE_IDS, { sinceMs: all[10].slot.startMs });
    expect(since[0].slot.startMs).toBe(all[10].slot.startMs);
    expect(planJobs(SCHEDULE, SENSORS, RESOURCE_IDS, { limit: 5 })).toHaveLength(5);
    for (let i = 1; i < all.length; i += 1) expect(all[i].slot.startMs).toBeGreaterThanOrEqual(all[i - 1].slot.startMs);
  });
});
