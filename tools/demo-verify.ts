/**
 * Conferência rápida da demonstração: os invariantes que precisam valer para a aplicação
 * contar a história certa.
 *
 *   npm run demo:verify              # banco + motor (não exige API no ar)
 *   npm run demo:verify -- --api     # inclui as rotas HTTP (exige API no ar)
 *
 * O que ele NÃO checa de propósito: ids, timestamps exatos e contagens de alerta que mudam
 * com um reconhecimento ou com o relógio. Isso tornaria a demo frágil sem provar nada. Aqui
 * valem invariantes semânticos — "a rampa gerou episódio", "o transiente não gerou" —, que é
 * o que quebraria se o motor regredisse.
 */
import { PrismaClient } from '@prisma/client';

interface Check {
  name: string;
  ok: boolean;
  detail: string;
  /** Falso quando o desvio é aceitável (a demo continua utilizável). */
  fatal: boolean;
}

const prisma = new PrismaClient();
const checks: Check[] = [];

function record(name: string, ok: boolean, detail: string, fatal = true): void {
  checks.push({ name, ok, detail, fatal });
}

/** Primeira amostra de telemetria: antes disto só existe o histórico operacional seedado. */
const HISTORY_START = new Date('2026-06-01T00:00:00.000Z');

const API_PORT = process.env.API_PORT ?? '3000';
const API = `http://localhost:${API_PORT}/api`;

async function checkDatabase(): Promise<void> {
  const [machines, points, sensors, samples, cycles] = await Promise.all([
    prisma.machine.count(),
    prisma.monitoringPoint.count(),
    prisma.sensor.count(),
    prisma.timeSeriesSample.count(),
    prisma.ingestionCycle.count(),
  ]);
  record('cadastro: 6 máquinas', machines === 6, `${machines} máquinas`);
  record('cadastro: 12 pontos', points === 12, `${points} pontos`);
  record('cadastro: 12 sensores', sensors === 12, `${sensors} sensores`);
  record('telemetria: mais de 10 M amostras', samples > 10_000_000, `${samples.toLocaleString('pt-BR')} amostras em ${cycles.toLocaleString('pt-BR')} ciclos`);
}

async function checkRules(): Promise<void> {
  const rules = await prisma.alertRule.findMany({ orderBy: { key: 'asc' } });
  const keys = rules.map((rule) => rule.key);
  const expected = ['temperature-delta', 'telemetry-presence', 'vibration-radial'];
  record('política: as três regras v1 existem', expected.every((key) => keys.includes(key)), keys.join(', '));
  record(
    'política: todas na versão 1',
    rules.length > 0 && rules.every((rule) => rule.policyVersion === 1),
    rules.map((rule) => `${rule.key} v${rule.policyVersion}`).join(', '),
  );
  const vibration = rules.find((rule) => rule.key === 'vibration-radial');
  record(
    'política: limiares de vibração 1,5 / 2,0 / 1,4 com 2 consecutivas',
    vibration?.a1Threshold === 1.5 && vibration?.a2Threshold === 2 && vibration?.clearThreshold === 1.4 && vibration?.consecutiveTrigger === 2,
    vibration ? `A1 ${vibration.a1Threshold} · A2 ${vibration.a2Threshold} · clear ${vibration.clearThreshold} · ${vibration.consecutiveTrigger}×` : 'regra ausente',
  );
}

async function checkEngine(): Promise<void> {
  const [evidence, evaluations, occurrences, states] = await Promise.all([
    prisma.alertCycleEvidence.count(),
    prisma.alertRuleEvaluation.count(),
    prisma.alertOccurrence.count(),
    prisma.alertRuleState.count(),
  ]);
  record('motor: evidência calculada para os ciclos', evidence > 0, `${evidence.toLocaleString('pt-BR')} ciclos com evidência`);
  record('motor: ledger de avaliações populado', evaluations > 0, `${evaluations.toLocaleString('pt-BR')} avaliações`);
  record('motor: estado por (regra, ponto)', states > 0, `${states} estados`);
  record('motor: episódios persistidos', occurrences > 0, `${occurrences} ocorrências`, true);

  const outOfOrder = await prisma.alertRuleEvaluation.count({ where: { outcome: 'OUT_OF_ORDER' } });
  record(
    'motor: nenhum ciclo aplicado fora de ordem',
    outOfOrder === 0,
    outOfOrder === 0 ? 'nenhum' : `${outOfOrder} avaliações OUT_OF_ORDER — rode "npm run alerts:backfill -- --reset --yes"`,
    false,
  );

  const learning = await prisma.alertRuleState.count({ where: { baselineStatus: 'LEARNING', rule: { learningCycles: { not: null } } } });
  record(
    'motor: baselines comissionadas',
    learning === 0,
    learning === 0 ? 'todas estabelecidas' : `${learning} par(es) (regra, ponto) ainda aprendendo`,
    false,
  );
}

/** Um episódio da família, para o sensor, em qualquer estado — SÓ no período do histórico
 * (o lote seedado de mar–mai não é decisão do motor e não entra nos cenários). */
async function episodesOf(serial: string, type: 'VIBRATION_THRESHOLD' | 'TEMPERATURE_THRESHOLD' | 'SENSOR_SILENT') {
  return prisma.alertOccurrence.findMany({
    where: { sensorSerialNumber: serial, type, openedAt: { gte: HISTORY_START } },
    orderBy: { openedAt: 'asc' },
  });
}

async function checkScenarios(): Promise<void> {
  const ramp = await episodesOf('SIM-HF-002', 'VIBRATION_THRESHOLD');
  record(
    'cenário: a rampa de SIM-HF-002 gerou alerta de vibração',
    ramp.length > 0,
    ramp.length > 0 ? `${ramp.length} episódio(s), aberto em ${ramp[0].openedAt.toISOString()}` : 'nenhum episódio',
  );
  record(
    'cenário: a rampa escalou para A2',
    ramp.some((alert) => alert.level === 'A2'),
    ramp.map((alert) => alert.level).join(', ') || '—',
  );

  const transient = await episodesOf('SIM-HF-005', 'VIBRATION_THRESHOLD');
  record(
    'cenário: o transiente de SIM-HF-005 NÃO virou episódio (gatilho consecutivo)',
    transient.length === 0,
    transient.length === 0 ? 'nenhum episódio, como esperado' : `${transient.length} episódio(s) — o gatilho consecutivo regrediu`,
  );

  const thermal = await episodesOf('SIM-HF-007', 'TEMPERATURE_THRESHOLD');
  record(
    'cenário: a deriva térmica de SIM-HF-007 gerou alerta de temperatura',
    thermal.length > 0,
    thermal.length > 0 ? `aberto em ${thermal[0].openedAt.toISOString()}` : 'nenhum episódio',
  );

  const silent = await episodesOf('SIM-TCAS-001', 'SENSOR_SILENT');
  record(
    'cenário: o silêncio de SIM-TCAS-001 gerou alerta de telemetria',
    silent.length > 0,
    silent.length > 0 ? `${silent.length} episódio(s), o primeiro em ${silent[0].openedAt.toISOString()}` : 'nenhum episódio',
  );

  const fleet = await prisma.alertOccurrence.count({ where: { type: 'FLEET_SILENT', openedAt: { gte: HISTORY_START } } });
  record('cenário: perda ampla de telemetria detectada nas paradas', fleet > 0, `${fleet} episódio(s) de frota`);

  const healthy = await prisma.alertOccurrence.count({
    where: {
      // Só o período do histórico: a operação anterior seedada não é decisão do motor.
      openedAt: { gte: HISTORY_START },
      type: { in: ['VIBRATION_THRESHOLD', 'TEMPERATURE_THRESHOLD'] },
      sensorSerialNumber: { in: ['SIM-HF-001', 'SIM-HF-003', 'SIM-HF-004', 'SIM-HF-006', 'SIM-HF-008', 'SIM-TCAG-001', 'SIM-TCAG-002', 'SIM-TCAS-002'] },
    },
  });
  record('cenário: sensores sadios sem alerta de condição', healthy === 0, healthy === 0 ? 'nenhum' : `${healthy} alerta(s) inesperado(s)`);
}

/** O lote do `alerts:seed-history`: popular a listagem sem contaminar o que é do motor. */
async function checkOperationalHistory(): Promise<void> {
  const [prior, activePrior] = await Promise.all([
    prisma.alertOccurrence.count({ where: { openedAt: { lt: HISTORY_START } } }),
    prisma.alertOccurrence.count({ where: { openedAt: { lt: HISTORY_START }, state: 'ACTIVE' } }),
  ]);
  record(
    'listagem: operação anterior populada (≥ 100 episódios)',
    prior >= 100,
    prior >= 100 ? `${prior} episódios encerrados antes de 01/06` : `${prior} — rode "npm run alerts:seed-history"`,
    false,
  );
  record(
    'listagem: nenhum episódio seedado continua ativo',
    activePrior === 0,
    activePrior === 0 ? 'todos encerrados — os ativos são sempre do motor' : `${activePrior} ativo(s) antes do histórico`,
  );
}

async function checkApi(): Promise<void> {
  const login = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SEED_USER_EMAIL ?? 'analista@dynamox.local',
      password: process.env.SEED_USER_PASSWORD ?? 'Dynamox@2026',
    }),
  });
  record('API: login responde', login.ok, `HTTP ${login.status}`);
  if (!login.ok) return;
  const { token } = (await login.json()) as { token: string };
  const authed = (path: string) => fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });

  const health = await fetch(`${API}/health`);
  record('API: health', health.ok, `HTTP ${health.status}`);

  const to = new Date().toISOString();
  const from = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const condition = await authed(`/analytics/fleet-condition?from=${from}&to=${to}`);
  const conditionBody = condition.ok
    ? ((await condition.json()) as { points: unknown[]; counts: { unclassified: number; noData: number } })
    : { points: [], counts: { unclassified: -1, noData: -1 } };
  record('API: /analytics/fleet-condition responde com os 12 pontos', condition.ok && conditionBody.points.length === 12, `HTTP ${condition.status} · ${conditionBody.points.length} pontos`);
  record(
    'API: condição segue classificada com o relógio além do dado',
    condition.ok && conditionBody.counts.unclassified === 0 && conditionBody.counts.noData === 0,
    `unclassified=${conditionBody.counts.unclassified} · noData=${conditionBody.counts.noData} — a janela ancora na última amostra, não em Date.now()`,
  );

  const heatmap = await authed(`/analytics/heatmap?from=${from}&to=${to}&bucket=hour`);
  const heatmapBody = heatmap.ok ? ((await heatmap.json()) as { buckets: Array<{ maxDeviationRatio: number | null }> }) : { buckets: [] };
  const comSeveridade = heatmapBody.buckets.filter((bucket) => bucket.maxDeviationRatio !== null);
  record(
    'API: /analytics/heatmap traz severidade (não só cobertura)',
    heatmap.ok && comSeveridade.length > 0,
    `HTTP ${heatmap.status} · ${comSeveridade.length}/${heatmapBody.buckets.length} buckets com desvio calculado`,
    // Sem baseline aprendida o mapa fica neutro: é sinal de backfill não executado, não de bug.
    false,
  );

  const alerts = await authed('/alerts?status=active');
  const alertsBody = alerts.ok ? ((await alerts.json()) as { total: number; counts: Record<string, number> }) : null;
  record('API: /alerts responde', alerts.ok, `HTTP ${alerts.status}${alertsBody ? ` · ${alertsBody.total} ativos de ${alertsBody.counts.total}` : ''}`);

  const anonymous = await fetch(`${API}/alerts`);
  record('API: /alerts exige token', anonymous.status === 401, `HTTP ${anonymous.status}`);
}

async function main(): Promise<void> {
  const withApi = process.argv.slice(2).includes('--api');
  try {
    await checkDatabase();
    await checkRules();
    await checkEngine();
    await checkScenarios();
    await checkOperationalHistory();
    if (withApi) await checkApi();
  } finally {
    await prisma.$disconnect();
  }

  console.log('');
  for (const check of checks) {
    const mark = check.ok ? 'OK  ' : check.fatal ? 'FALHA' : 'aviso';
    console.log(`${mark.padEnd(6)} ${check.name.padEnd(62)} ${check.detail}`);
  }
  const failures = checks.filter((check) => !check.ok && check.fatal);
  const warnings = checks.filter((check) => !check.ok && !check.fatal);
  console.log('');
  console.log(`${checks.length - failures.length - warnings.length}/${checks.length} invariantes OK · ${warnings.length} aviso(s) · ${failures.length} falha(s).`);
  if (!withApi) console.log('Rotas HTTP não conferidas (use --api com a API no ar).');
  if (failures.length > 0) {
    console.log('\nA demo NÃO está pronta. Rode "npm run demo:prepare" para reconstruí-la do zero.');
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(`demo:verify falhou: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
