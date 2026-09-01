/**
 * `plant history` — popula o histórico sintético pelo MESMO contrato de ingestão da
 * planta: login, resourceIds resolvidos por GET (nada é criado), grade absoluta,
 * narrativa, geração (pool ou em processo) e POST /telemetry-cycles com idempotência.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { demoAnchorMs } from '@dynamox/contracts';

import { resolveResourceIds } from '../bootstrap';
import type { ResolvedResourceIds } from '../fleet';
import { fetchSeries, fetchSamples, loadTwinConfig, login, tryIngestPayload, type TwinApiConfig } from '../ingest';
import { PLANT, plantSensors, validatePlantManifest, type PlantSensor } from '../plant';
import { buildHistoryCycle, type HistoryJob } from './build';
import { parseHistoryArgs, type HistoryCliOptions } from './cli-args';
import { planJobs, runHistory, type HistoryReport } from './driver';
import { NARRATIVE } from './narrative';
import { GenerationPool, inProcessGenerator, type Generator } from './pool';
import {
  assertOutsideReservedWindows,
  buildHistorySchedule,
  floorUtcMidnight,
  machineIndexOf,
  machinePhaseMinutes,
  resolveRange,
  type HistorySchedule,
} from './schedule';

const HISTORY_HTTP_TIMEOUT_MS = 60_000;
const SAMPLE_BYTES_ESTIMATE = 343;

function show(label: string, value: unknown): void {
  console.log(`${label.padEnd(22, '.')}: ${String(value)}`);
}

/**
 * Época já usada por uma carga anterior, lida dos próprios dados: a amostra mais antiga
 * da série aceleração/Y do primeiro sensor cujo minuto casa com a fase da máquina.
 * Sem endpoint de ciclos, é a única fonte disponível via API; `--epoch` sobrepõe.
 */
export async function detectExistingEpoch(
  config: TwinApiConfig,
  token: string,
  sensor: PlantSensor,
  everyMinutes: number,
  capMs: number,
): Promise<number | null> {
  const series = (await fetchSeries(config, token)).find(
    (item) => item.sensorSerialNumber === sensor.sensorSerial && item.physicalQuantity === 'acceleration' && item.axis === 'y',
  );
  if (!series || series.sampleCount === 0) return null;
  const page = await fetchSamples(config, token, series.id, { limit: 5000, offset: 0 });
  const phase = machinePhaseMinutes(machineIndexOf(sensor));
  for (const sample of page.items) {
    const ms = Date.parse(sample.timestamp);
    const date = new Date(ms);
    const inPhase = date.getUTCMinutes() % everyMinutes === phase && date.getUTCSeconds() === 0 && ms % 1000 === 0;
    if (inPhase && ms < capMs) return floorUtcMidnight(ms);
  }
  return null;
}

function printPlan(options: HistoryCliOptions, schedule: HistorySchedule, epochSource: string, sensors: PlantSensor[]): void {
  const { range } = schedule;
  const planned = schedule.slots.length;
  console.log('Histórico sintético — plano');
  console.log('─'.repeat(72));
  show('faixa', `${new Date(range.epochMs).toISOString()} → ${new Date(range.endMs).toISOString()}`);
  show('época', `${new Date(range.epochMs).toISOString()} (${epochSource})`);
  show('cadência', `${range.everyMs / 60_000} min · fase por máquina :02..:07`);
  show('sensores', `${sensors.length} — ${sensors.map((s) => s.sensorSerial).join(', ')}`);
  show('ciclos planejados', planned);
  show('amostras estimadas', `${planned * 300} (≈ ${((planned * 300 * SAMPLE_BYTES_ESTIMATE) / 1e9).toFixed(2)} GB no Postgres)`);
  show('pulados por lacuna', JSON.stringify(schedule.skippedByGap));
  for (const gap of schedule.gaps) {
    console.log(
      `  lacuna ${gap.kind.padEnd(11)} ${new Date(gap.fromMs).toISOString()} → ${new Date(gap.toMs).toISOString()} (${gap.sensors === 'all' ? 'frota' : gap.sensors.join(',')})`,
    );
  }
  console.log(
    `  eventos: rampa ${NARRATIVE.ramp.sensor} → ${NARRATIVE.ramp.targetRatio}× · deriva ${NARRATIVE.thermal.sensor} +${NARRATIVE.thermal.deltaC} °C · mudo ${NARRATIVE.mute.sensor} d${NARRATIVE.mute.fromDay}–${NARRATIVE.mute.toDay} · pico ${NARRATIVE.spike.sensor} d${NARRATIVE.spike.day} ${NARRATIVE.spike.ratio}×`,
  );
  show('execução', options.dryRun ? 'dry-run (sem POST)' : `${options.workers} worker(s) · ${options.concurrency} POST(s) em voo · ${options.retries} retries`);
}

function printReport(report: HistoryReport): void {
  console.log('─'.repeat(72));
  show('planejados', report.totals.planned);
  show('criados (201)', report.totals.created);
  show('duplicados (200)', report.totals.duplicate);
  show('retries', report.totals.retried);
  show('falhas', report.totals.failed);
  show('amostras inseridas', report.totals.samples);
  show('tempo total', `${(report.timing.elapsedMs / 1000).toFixed(1)} s`);
  show('geração média', `${report.timing.generateAvgMs} ms/ciclo`);
  show('POST média / p95', `${report.timing.postAvgMs} / ${report.timing.postP95Ms} ms`);
  show('throughput', `${report.timing.cyclesPerSecond} ciclos/s · ${report.timing.samplesPerSecond} amostras/s`);
  if (report.aborted) {
    console.error(`ABORTADO em ${report.aborted.sensor} @ ${report.aborted.slot}: ${report.aborted.reason}`);
    console.error(`  → ${report.aborted.hint}`);
  }
}

async function benchGeneration(jobs: HistoryJob[], count = 10): Promise<number> {
  const sample = jobs.slice(0, count);
  const t0 = performance.now();
  for (const job of sample) buildHistoryCycle(job);
  return sample.length === 0 ? 0 : (performance.now() - t0) / sample.length;
}

export async function runPlantHistory(argv: string[]): Promise<void> {
  const options = parseHistoryArgs(argv);
  validatePlantManifest(PLANT);
  const sensors = plantSensors(PLANT).filter((sensor) => options.sensors.includes(sensor.sensorSerial));
  const anchorMs = demoAnchorMs();
  const capMs = anchorMs - options.untilOffsetHours * 3_600_000;

  let config: TwinApiConfig | null = null;
  let token = '';
  let resourceIds: ResolvedResourceIds = new Map(sensors.map((s) => [s.sensorSerial, s.fixedResourceId ?? '0'.repeat(24)]));
  let epochMs: number | undefined = options.epochIso ? Date.parse(options.epochIso) : undefined;
  let epochSource = options.epochIso ? '--epoch' : 'padrão (meia-noite UTC de fim − dias)';

  if (!options.offline) {
    config = loadTwinConfig();
    token = await login(config);
    show('login', `OK (${config.email} em ${config.baseUrl})`);
    resourceIds = await resolveResourceIds(config, token, PLANT);
    if (epochMs === undefined && !options.noDetect) {
      const detected = await detectExistingEpoch(config, token, sensors[0], options.everyMinutes, capMs);
      if (detected !== null) {
        epochMs = detected;
        epochSource = 'detectada nos dados existentes';
      }
    }
  }

  const range = resolveRange({
    anchorMs,
    days: options.days,
    everyMinutes: options.everyMinutes,
    untilOffsetHours: options.untilOffsetHours,
    epochMs,
    toMs: options.toIso ? Date.parse(options.toIso) : undefined,
  });
  const schedule = buildHistorySchedule(range, NARRATIVE, sensors);
  assertOutsideReservedWindows(schedule, anchorMs);
  printPlan(options, schedule, epochSource, sensors);

  const sinceMs = options.sinceIso ? Date.parse(options.sinceIso) : undefined;
  if (options.dryRun) {
    const jobs = planJobs(schedule, sensors, resourceIds, { sinceMs, limit: options.limit });
    const perCycleMs = await benchGeneration(jobs);
    const etaMin = (jobs.length * perCycleMs) / options.workers / 60_000;
    show('bench geração', `${perCycleMs.toFixed(1)} ms/ciclo em processo → ≈ ${etaMin.toFixed(1)} min só de geração com ${options.workers} worker(s)`);
    show('janelas reservadas', 'nenhuma interseção (verificado)');
    return;
  }
  if (!config) throw new Error('--offline só faz sentido com --dry-run.');

  let generator: Generator = inProcessGenerator();
  if (options.workers > 1) {
    const pool = new GenerationPool(options.workers);
    try {
      const probe = planJobs(schedule, sensors, resourceIds, { sinceMs, limit: 1 })[0];
      if (probe) await pool.smoke(probe);
      generator = pool;
    } catch (error) {
      await pool.close();
      console.warn(`workers indisponíveis (${(error as Error).message}); seguindo em processo único.`);
    }
  }

  const activeConfig = config;
  const deps = {
    generate: (job: HistoryJob) => generator.generate(job),
    post: (cycle: { body: string; idempotencyKey: string }) =>
      tryIngestPayload(activeConfig, token, cycle.body, cycle.idempotencyKey, { timeoutMs: HISTORY_HTTP_TIMEOUT_MS }),
    reauth: async () => {
      token = await login(activeConfig);
    },
    now: () => Date.now(),
    sleep: (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
    log: (line: string) => console.log(line),
  };

  try {
    const report = await runHistory(schedule, sensors, resourceIds, deps, {
      concurrency: options.concurrency,
      lanes: options.concurrency + Math.max(1, generator.size),
      retries: options.retries,
      sinceMs,
      limit: options.limit,
      progressEveryMs: 5_000,
    });
    printReport(report);
    if (options.reportPath) {
      mkdirSync(dirname(options.reportPath), { recursive: true });
      writeFileSync(options.reportPath, JSON.stringify(report, null, 2));
      show('relatório', options.reportPath);
    }
    if (report.aborted) process.exitCode = 1;
  } finally {
    await generator.close();
  }
}
