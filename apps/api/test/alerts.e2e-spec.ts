/**
 * Motor de alertas contra a API real: a ingestão de ciclos abre, escala e resolve episódios.
 *
 * Isolamento: fixtures com prefixo ALR- (máquina, ponto, sensor, usuário) e uma janela em
 * abril/2026, longe do histórico e da planta. A baseline do ponto é semeada já ESTABELECIDA
 * (0,02 g em todas as horas) para que a razão de cada ciclo seja a amplitude ÷ 0,02.
 */
import { randomBytes, scryptSync } from 'node:crypto';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { deterministicResourceId, type TelemetryCyclePayload } from '@dynamox/contracts';
import type { AlertOccurrenceDto } from '@dynamox/domain';

import { AlertsService } from '../src/alerts/alerts.service';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const PREFIX = 'ALR-';
const MACHINE_NAME = `${PREFIX}P-950`;
const POINT_NAME = `${PREFIX}Mancal LA`;
const SENSOR_SERIAL = `${PREFIX}HF-001`;
const ADMIN_EMAIL = 'alerts-e2e@dynamox.local';
const ADMIN_PASSWORD = 'Senha-ALR@2026';
const VIEWER_EMAIL = 'alerts-e2e-viewer@dynamox.local';
const VIEWER_PASSWORD = 'Senha-ALR-Viewer@2026';
const BASELINE_G = 0.02;
const RESOURCE_ID = deterministicResourceId('dynamox-challenge', 'monitoring-point', MACHINE_NAME, POINT_NAME);

const T = (hhmm: string) => `2026-04-01T${hhmm}:00.000Z`;

/** Um ciclo de 3 amostras Y/Z pareadas com amplitude = razão × baseline, mais temperatura. */
function cyclePayload(startIso: string, ratio: number, temperature = 40): TelemetryCyclePayload {
  const start = Date.parse(startIso);
  const at = (seconds: number) => new Date(start + seconds * 1000).toISOString();
  const amplitude = Number((BASELINE_G * ratio).toFixed(6));
  const radial = (axis: 'y' | 'z') => ({
    resourceId: RESOURCE_ID,
    attributes: { physicalQuantity: 'acceleration' as const, axis, unit: 'g' },
    dataPoints: [0, 1, 2].map((second) => ({ timestamp: at(second), value: amplitude })),
  });
  return {
    telemetryCycleData: {
      measuringSystemUniqueIdentifier: SENSOR_SERIAL,
      measuringSystemModel: { name: 'industrial-condition-sensor-sim', version: 1 },
      measurements: [
        radial('y'),
        radial('z'),
        {
          resourceId: RESOURCE_ID,
          attributes: { physicalQuantity: 'temperature', unit: 'degC' },
          dataPoints: [0, 1].map((second) => ({ timestamp: at(second), value: temperature })),
        },
      ],
      metadata: {
        origin: 'simulation',
        generator: { name: 'industrial-condition-sensor-sim', version: '0.1.0' },
        profile: 'HF+',
        cycleId: `alr-${startIso}`,
        synthetic: true,
      },
      tags: ['simulated', 'e2e', 'alerts'],
    },
    configuration: {
      monitoringLocationMap: [{ mapLabel: POINT_NAME, mapValue: RESOURCE_ID }],
      rpm: 1750,
      scenario: 'normal',
      seed: 20260401,
    },
  };
}

describe('Alertas (e2e) — avaliação após a ingestão', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let bearer: string;
  let viewerBearer: string;
  let machineId: string;
  let pointId: string;
  let sensorId: string;
  let vibrationRuleId: string;
  let temperatureRuleId: string;
  let presenceRuleId: string;

  const http = () => request(app.getHttpServer());
  const ingest = (payload: TelemetryCyclePayload) =>
    http().post('/api/telemetry-cycles').set('Authorization', bearer).send(payload);

  async function removeFixtures(): Promise<void> {
    const cycles = await prisma.ingestionCycle.findMany({
      where: { measuringSystemUid: { startsWith: PREFIX } },
      select: { id: true },
    });
    await prisma.alertRuleEvaluation.deleteMany({ where: { cycleId: { in: cycles.map((c) => c.id) } } });
    await prisma.alertOccurrence.deleteMany({ where: { machineName: { startsWith: PREFIX } } });
    const sensors = await prisma.sensor.findMany({ where: { serialNumber: { startsWith: PREFIX } }, select: { id: true } });
    const series = await prisma.timeSeries.findMany({ where: { sensorId: { in: sensors.map((s) => s.id) } }, select: { id: true } });
    await prisma.timeSeriesSample.deleteMany({ where: { timeSeriesId: { in: series.map((s) => s.id) } } });
    await prisma.ingestionCycle.deleteMany({ where: { measuringSystemUid: { startsWith: PREFIX } } });
    await prisma.timeSeries.deleteMany({ where: { id: { in: series.map((s) => s.id) } } });
    await prisma.sensor.deleteMany({ where: { serialNumber: { startsWith: PREFIX } } });
    await prisma.machine.deleteMany({ where: { name: { startsWith: PREFIX } } });
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    prisma = app.get(PrismaService);
    await removeFixtures();

    const machine = await prisma.machine.create({ data: { name: MACHINE_NAME, type: 'PUMP' } });
    machineId = machine.id;
    const point = await prisma.monitoringPoint.create({
      data: { name: POINT_NAME, machineId: machine.id, externalResourceId: RESOURCE_ID },
    });
    pointId = point.id;
    const sensor = await prisma.sensor.create({
      data: { serialNumber: SENSOR_SERIAL, model: 'HF_PLUS', monitoringPointId: point.id },
    });
    sensorId = sensor.id;

    // As regras da política v1 foram garantidas no boot do módulo.
    const rules = await prisma.alertRule.findMany({ where: { key: { in: ['vibration-radial', 'temperature-delta', 'telemetry-presence'] } } });
    vibrationRuleId = rules.find((r) => r.key === 'vibration-radial')!.id;
    temperatureRuleId = rules.find((r) => r.key === 'temperature-delta')!.id;
    presenceRuleId = rules.find((r) => r.key === 'telemetry-presence')!.id;

    // Baseline já comissionada: 0,02 g em todas as horas.
    await prisma.alertRuleState.create({
      data: {
        ruleId: vibrationRuleId,
        monitoringPointId: point.id,
        baselineStatus: 'ESTABLISHED',
        baselineSensorId: sensor.id,
        learningCount: 192,
        baselineValue: BASELINE_G,
        baselineProfile: Array.from({ length: 24 }, () => BASELINE_G),
        baselineBinCounts: Array.from({ length: 24 }, () => 8),
        baselineFrom: new Date('2026-03-30T00:00:00.000Z'),
        baselineTo: new Date('2026-04-01T00:00:00.000Z'),
        baselineEstablishedAt: new Date('2026-04-01T00:00:00.000Z'),
      },
    });

    for (const [email, password, role, name] of [
      [ADMIN_EMAIL, ADMIN_PASSWORD, 'ADMIN', 'Alerts E2E'],
      [VIEWER_EMAIL, VIEWER_PASSWORD, 'VIEWER', 'Alerts E2E Viewer'],
    ] as const) {
      const salt = randomBytes(16).toString('hex');
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, name, passwordHash: `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`, role },
      });
    }
    const login = await http().post('/api/auth/login').send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }).expect(201);
    bearer = `Bearer ${login.body.token}`;
    const viewerLogin = await http().post('/api/auth/login').send({ email: VIEWER_EMAIL, password: VIEWER_PASSWORD }).expect(201);
    viewerBearer = `Bearer ${viewerLogin.body.token}`;
  }, 60000);

  afterAll(async () => {
    await removeFixtures();
    await prisma.user.deleteMany({ where: { email: { in: [ADMIN_EMAIL, VIEWER_EMAIL] } } });
    await app.close();
  });

  const occurrences = () =>
    prisma.alertOccurrence.findMany({ where: { monitoringPointId: pointId }, orderBy: { openedAt: 'asc' } });
  const evaluations = (ruleId: string) =>
    prisma.$queryRaw<Array<{ outcome: string; measure: number | null; started_at: Date }>>`
      SELECT ev.outcome::text AS outcome, ev.measure, e."startedAt" AS started_at
      FROM alert_rule_evaluations ev
      JOIN alert_cycle_evidence e ON e."cycleId" = ev."cycleId"
      WHERE ev."ruleId" = ${ruleId} AND e."monitoringPointId" = ${pointId}
      ORDER BY e."startedAt"
    `;

  it('uma leitura a 1,6× não abre nada; a segunda consecutiva abre A1 com a evidência do disparo', async () => {
    await ingest(cyclePayload(T('10:00'), 1.6)).expect(201);
    expect(await occurrences()).toHaveLength(0);

    await ingest(cyclePayload(T('10:15'), 1.6)).expect(201);
    const [alert] = await occurrences();
    expect(alert).toBeDefined();
    expect(alert.type).toBe('VIBRATION_THRESHOLD');
    expect(alert.level).toBe('A1');
    expect(alert.state).toBe('ACTIVE');
    expect(alert.activeKey).toBe(`${vibrationRuleId}:${pointId}`);
    expect(alert.openedAt.toISOString()).toBe(T('10:15'));
    expect(alert.triggerAt.toISOString()).toBe(T('10:15'));
    expect(alert.triggerValue).toBeCloseTo(0.032, 6);
    expect(alert.triggerBaseline).toBeCloseTo(BASELINE_G, 9);
    expect(alert.triggerMeasure).toBeCloseTo(1.6, 6);
    expect(alert.triggerThreshold).toBe(1.5);
    expect(alert.consecutiveEvaluations).toBe(2);
    expect(alert.machineName).toBe(MACHINE_NAME);
    expect(alert.monitoringPointName).toBe(POINT_NAME);
    expect(alert.sensorSerialNumber).toBe(SENSOR_SERIAL);
    expect(alert.sensorId).toBe(sensorId);
    expect(alert.policyVersion).toBe(1);
    expect(alert.acknowledgedAt).toBeNull();
  });

  it('reenviar o mesmo ciclo (200) não gera nova avaliação nem mexe no episódio', async () => {
    const before = await evaluations(vibrationRuleId);
    const [alertBefore] = await occurrences();
    await ingest(cyclePayload(T('10:15'), 1.6)).expect(200);
    const after = await evaluations(vibrationRuleId);
    const [alertAfter] = await occurrences();
    expect(after).toHaveLength(before.length);
    expect(alertAfter.updatedAt.getTime()).toBe(alertBefore.updatedAt.getTime());
  });

  it('duas leituras consecutivas ≥ 2,0× escalam o MESMO episódio para A2 (nunca um segundo)', async () => {
    await ingest(cyclePayload(T('10:30'), 2.5)).expect(201);
    let [alert] = await occurrences();
    expect(alert.level).toBe('A1');
    expect(alert.peakMeasure).toBeCloseTo(2.5, 6);
    expect(alert.lastMeasure).toBeCloseTo(2.5, 6);

    await ingest(cyclePayload(T('10:45'), 2.5)).expect(201);
    const all = await occurrences();
    expect(all).toHaveLength(1);
    [alert] = all;
    expect(alert.level).toBe('A2');
    expect(alert.state).toBe('ACTIVE');
    expect(alert.openedAt.toISOString()).toBe(T('10:15'));
    expect(alert.lastEvaluatedAt.toISOString()).toBe(T('10:45'));

    const events = await prisma.alertEvent.findMany({ where: { alertId: alert.id }, orderBy: { occurredAt: 'asc' } });
    expect(events.map((e) => e.type)).toEqual(['OPENED', 'ESCALATED']);
    expect(events[1]).toMatchObject({ fromLevel: 'A1', toLevel: 'A2', fromState: 'ACTIVE', toState: 'ACTIVE', threshold: 2 });
    expect(events[1].occurredAt.toISOString()).toBe(T('10:45'));
  });

  it('só a quarta leitura consecutiva abaixo de 1,4× resolve — e a linha é a mesma', async () => {
    for (const hhmm of ['11:00', '11:15', '11:30']) {
      await ingest(cyclePayload(T(hhmm), 1.0)).expect(201);
    }
    let [alert] = await occurrences();
    expect(alert.state).toBe('ACTIVE');
    expect(alert.level).toBe('A2');
    expect(alert.lastMeasure).toBeCloseTo(1.0, 6);
    expect(alert.peakMeasure).toBeCloseTo(2.5, 6);

    await ingest(cyclePayload(T('11:45'), 1.0)).expect(201);
    const all = await occurrences();
    expect(all).toHaveLength(1);
    [alert] = all;
    expect(alert.state).toBe('RESOLVED');
    expect(alert.level).toBe('A2');
    expect(alert.activeKey).toBeNull();
    expect(alert.resolvedAt?.toISOString()).toBe(T('11:45'));
    expect(alert.resolutionReason).toBe('CONDITION_CLEARED');

    const events = await prisma.alertEvent.findMany({ where: { alertId: alert.id }, orderBy: { occurredAt: 'asc' } });
    expect(events.map((e) => e.type)).toEqual(['OPENED', 'ESCALATED', 'RESOLVED']);
    expect(events[2]).toMatchObject({ fromState: 'ACTIVE', toState: 'RESOLVED', threshold: 1.4 });
  });

  it('um ciclo mais antigo que a marca d\'água é registrado como OUT_OF_ORDER, não aplicado nem descartado', async () => {
    await ingest(cyclePayload(T('09:00'), 3.0)).expect(201);
    const rows = await evaluations(vibrationRuleId);
    const stale = rows.find((row) => row.started_at.toISOString() === T('09:00'));
    expect(stale?.outcome).toBe('OUT_OF_ORDER');
    expect(await occurrences()).toHaveLength(1);
    const state = await prisma.alertRuleState.findUniqueOrThrow({
      where: { ruleId_monitoringPointId: { ruleId: vibrationRuleId, monitoringPointId: pointId } },
    });
    expect(state.lastEvaluatedAt?.toISOString()).toBe(T('11:45'));
    expect(state.belowClearStreak).toBe(4);
    // A evidência do ciclo existe mesmo assim — o backfill pode reconciliar.
    const evidence = await prisma.alertCycleEvidence.findMany({ where: { monitoringPointId: pointId, startedAt: new Date(T('09:00')) } });
    expect(evidence).toHaveLength(1);
    expect(evidence[0].radialRms).toBeCloseTo(0.06, 6);
  });

  it('o ledger tem exatamente uma avaliação por (ciclo, regra, versão), com o desfecho de cada uma', async () => {
    const rows = await evaluations(vibrationRuleId);
    expect(rows.map((row) => row.outcome)).toEqual([
      'OUT_OF_ORDER',
      ...Array.from({ length: 8 }, () => 'EVALUATED'),
    ]);
    expect(rows.slice(1).map((row) => Number(row.measure?.toFixed(3)))).toEqual([1.6, 1.6, 2.5, 2.5, 1, 1, 1, 1]);
  });

  it('a regra de temperatura aprendeu só com os ciclos em ordem; a presença viu o último', async () => {
    const temperature = await prisma.alertRuleState.findUniqueOrThrow({
      where: { ruleId_monitoringPointId: { ruleId: temperatureRuleId, monitoringPointId: pointId } },
    });
    expect(temperature.baselineStatus).toBe('LEARNING');
    expect(temperature.learningCount).toBe(8);
    expect(temperature.baselineSensorId).toBe(sensorId);
    expect(temperature.baselineFrom?.toISOString()).toBe(T('10:00'));
    const temperatureRows = await evaluations(temperatureRuleId);
    expect(temperatureRows.map((row) => row.outcome)).toEqual(['OUT_OF_ORDER', ...Array.from({ length: 8 }, () => 'LEARNING')]);

    const presence = await prisma.alertRuleState.findUniqueOrThrow({
      where: { ruleId_monitoringPointId: { ruleId: presenceRuleId, monitoringPointId: pointId } },
    });
    expect(presence.lastSeenAt?.toISOString()).toBe('2026-04-01T11:45:02.000Z');
    expect(presence.lastEvaluatedAt?.toISOString()).toBe(T('11:45'));
  });

  it('o motor nunca leu o rótulo do produtor: a ocorrência não conhece cenário algum', async () => {
    const [alert] = await occurrences();
    expect(JSON.stringify(alert)).not.toMatch(/scenario|groundTruth/);
  });

  describe('presença — varredura com relógio replayado, restrita à máquina da fixture', () => {
    const sweep = (iso: string) => app.get(AlertsService).sweepPresence(Date.parse(iso), { machineId });
    const silence = () =>
      prisma.alertOccurrence.findMany({ where: { monitoringPointId: pointId, type: 'SENSOR_SILENT' }, orderBy: { openedAt: 'asc' } });

    it('sob Jest o timer nunca arma; 3 intervalos de silêncio ainda não são alerta', async () => {
      expect(app.get(AlertsService)['timers']).toHaveLength(0);
      const summary = await sweep('2026-04-01T12:30:00.000Z');
      expect(summary.instrumented).toBe(1);
      expect(summary.opened).toBe(0);
      expect(await silence()).toHaveLength(0);
    });

    it('passadas 4 aquisições esperadas sem dado, abre SENSOR_SILENT A1 com o silêncio desde a última leitura', async () => {
      const summary = await sweep('2026-04-01T13:00:00.000Z');
      expect(summary).toMatchObject({ opened: 1, fleet: 'none' });
      const [alert] = await silence();
      expect(alert.type).toBe('SENSOR_SILENT');
      expect(alert.level).toBe('A1');
      expect(alert.scope).toBe('POINT');
      expect(alert.openedAt.toISOString()).toBe('2026-04-01T13:00:00.000Z');
      expect(alert.triggerAt.toISOString()).toBe('2026-04-01T11:45:02.000Z');
      expect(alert.triggerThreshold).toBe(4);
      expect(alert.triggerBaseline).toBe(900);
      expect(alert.triggerMeasure).toBeCloseTo((Date.parse('2026-04-01T13:00:00.000Z') - Date.parse('2026-04-01T11:45:02.000Z')) / 900_000, 6);
      expect(alert.machineName).toBe(MACHINE_NAME);
      expect(alert.sensorSerialNumber).toBe(SENSOR_SERIAL);
    });

    it('a varredura seguinte não duplica; após 24 h escala o mesmo episódio para A2', async () => {
      await sweep('2026-04-01T14:00:00.000Z');
      expect(await silence()).toHaveLength(1);
      const summary = await sweep('2026-04-02T12:00:00.000Z');
      expect(summary.escalated).toBe(1);
      const [alert] = await silence();
      expect(alert.level).toBe('A2');
      expect(alert.state).toBe('ACTIVE');
      const events = await prisma.alertEvent.findMany({ where: { alertId: alert.id }, orderBy: { occurredAt: 'asc' } });
      expect(events.map((e) => e.type)).toEqual(['OPENED', 'ESCALATED']);
    });

    it('a telemetria voltando resolve o silêncio no próprio ciclo (TELEMETRY_RESUMED)', async () => {
      await ingest(cyclePayload(T('12:00').replace('2026-04-01', '2026-04-03'), 1.0)).expect(201);
      const [alert] = await silence();
      expect(alert.state).toBe('RESOLVED');
      expect(alert.resolutionReason).toBe('TELEMETRY_RESUMED');
      expect(alert.resolvedAt?.toISOString()).toBe('2026-04-03T12:00:00.000Z');
      expect(alert.activeKey).toBeNull();
      // Presença não aprende baseline: o detalhe diz isso com null, não com um número inventado.
      const detail = await http().get(`/api/alerts/${alert.id}`).set('Authorization', bearer).expect(200);
      expect(detail.body.baseline).toBeNull();
      // O episódio de vibração resolvido antes continua sendo o único da família de condição.
      const all = await occurrences();
      expect(all.map((a) => a.type).sort()).toEqual(['SENSOR_SILENT', 'VIBRATION_THRESHOLD']);
    });
  });

  describe('API — GET /alerts, GET /alerts/:id, POST /alerts/:id/acknowledge', () => {
    const get = (url: string, token = bearer) => http().get(url).set('Authorization', token);
    const ours = (body: { items: AlertOccurrenceDto[] }) => body.items.filter((item) => item.machineName === MACHINE_NAME);

    it('exige token e rejeita parâmetro desconhecido, valores fora do vocabulário e janela invertida', async () => {
      await http().get('/api/alerts').expect(401);
      const unknown = await get('/api/alerts?inventado=1').expect(400);
      expect(unknown.body.code).toBe('INVALID_ALERTS_QUERY');
      await get('/api/alerts?status=fechado').expect(400);
      await get('/api/alerts?level=A3').expect(400);
      await get('/api/alerts?pageSize=0').expect(400);
      await get('/api/alerts?from=2026-04-02T00:00:00.000Z&to=2026-04-01T00:00:00.000Z').expect(400);
      await get('/api/alerts/nao-e-uuid').expect(400);
      const missing = await get('/api/alerts/00000000-0000-4000-8000-000000000000').expect(404);
      expect(missing.body.code).toBe('ALERT_NOT_FOUND');
      const machine = await get('/api/alerts?machine=ALR-INEXISTENTE').expect(404);
      expect(machine.body.code).toBe('MACHINE_NOT_FOUND');
    });

    it('lista os episódios da máquina com status derivado, contagens do universo e ordenação', async () => {
      const response = await get(`/api/alerts?machine=${encodeURIComponent(MACHINE_NAME)}&pageSize=50`).expect(200);
      const items = ours(response.body);
      expect(items).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.counts).toEqual({ total: 2, open: 0, acknowledged: 0, resolved: 2, activeA1: 0, activeA2: 0 });
      // Padrão: openedAt desc — o silêncio (13:00) vem antes da vibração (10:15).
      expect(items.map((item) => item.type)).toEqual(['sensor-silent', 'vibration-threshold']);
      const vibration = items[1];
      expect(vibration).toMatchObject({
        family: 'condition',
        scope: 'point',
        level: 'A2',
        state: 'resolved',
        status: 'resolved',
        machineType: 'Pump',
        sensorModel: 'HF+',
        sensorSerialNumber: SENSOR_SERIAL,
        resolutionReason: 'condition-cleared',
        thresholdMode: 'ratio-to-baseline',
        policyVersion: 1,
      });
      expect(vibration.trigger).toMatchObject({ threshold: 1.5, consecutiveEvaluations: 2 });
      expect(vibration.trigger.measure).toBeCloseTo(1.6, 6);
      expect(vibration.peak.measure).toBeCloseTo(2.5, 6);
      expect(items[0]).toMatchObject({ family: 'data-quality', type: 'sensor-silent', resolutionReason: 'telemetry-resumed' });

      const asc = await get(`/api/alerts?machine=${encodeURIComponent(MACHINE_NAME)}&sortBy=openedAt&sortDir=asc`).expect(200);
      expect(ours(asc.body).map((item) => item.type)).toEqual(['vibration-threshold', 'sensor-silent']);
      const byLevel = await get(`/api/alerts?machine=${encodeURIComponent(MACHINE_NAME)}&level=A2&type=vibration-threshold`).expect(200);
      expect(ours(byLevel.body)).toHaveLength(1);
      expect(byLevel.body.counts.total).toBe(1);
    });

    it('search recorta por sensor, máquina ou ponto nos snapshots, sem diferenciar maiúsculas', async () => {
      // Pelo nome da máquina, em minúsculas: os dois episódios da fixture.
      const maquina = await get(`/api/alerts?search=${encodeURIComponent(MACHINE_NAME.toLowerCase())}&pageSize=50`).expect(200);
      expect(ours(maquina.body)).toHaveLength(2);
      expect(maquina.body.search).toBe(MACHINE_NAME.toLowerCase());
      // Pelo número de série do sensor.
      const sensor = await get(`/api/alerts?search=${encodeURIComponent(SENSOR_SERIAL.toLowerCase())}&pageSize=50`).expect(200);
      expect(ours(sensor.body)).toHaveLength(2);
      // Pelo nome do ponto (fragmento).
      const ponto = await get(`/api/alerts?search=${encodeURIComponent(POINT_NAME.toLowerCase())}&pageSize=50`).expect(200);
      expect(ours(ponto.body)).toHaveLength(2);
      // Sem correspondência: universo vazio, counts idem.
      const nada = await get('/api/alerts?search=zzz-sem-correspondencia').expect(200);
      expect(nada.body.total).toBe(0);
      expect(nada.body.counts.total).toBe(0);
      // Busca combinada com os demais recortes.
      const combinada = await get(`/api/alerts?search=${encodeURIComponent(MACHINE_NAME.toLowerCase())}&type=vibration-threshold&status=resolved`).expect(200);
      expect(ours(combinada.body).map((item) => item.type)).toEqual(['vibration-threshold']);
      // Longa demais: 400 do vocabulário fechado.
      await get(`/api/alerts?search=${'x'.repeat(200)}`).expect(400);
    });

    it('status recorta a página, mas counts continua descrevendo o universo; from/to é interseção', async () => {
      const key = `machine=${encodeURIComponent(MACHINE_NAME)}`;
      const open = await get(`/api/alerts?${key}&status=open`).expect(200);
      expect(open.body.total).toBe(0);
      expect(open.body.counts.total).toBe(2);
      // Janela que contém só o meio do episódio de vibração (10:15 → 11:45): entra por interseção.
      const inside = await get(`/api/alerts?${key}&from=2026-04-01T11:00:00.000Z&to=2026-04-01T11:10:00.000Z`).expect(200);
      expect(ours(inside.body).map((item) => item.type)).toEqual(['vibration-threshold']);
      // Janela antes de tudo: vazia. Janela depois da resolução da vibração: só o silêncio.
      const before = await get(`/api/alerts?${key}&to=2026-04-01T10:00:00.000Z`).expect(200);
      expect(ours(before.body)).toHaveLength(0);
      const after = await get(`/api/alerts?${key}&from=2026-04-01T12:00:00.000Z`).expect(200);
      expect(ours(after.body).map((item) => item.type)).toEqual(['sensor-silent']);
      // Recorte por sensor e paginação.
      const paged = await get(`/api/alerts?sensor=${SENSOR_SERIAL}&pageSize=1&page=2&sortBy=openedAt&sortDir=asc`).expect(200);
      expect(paged.body.items).toHaveLength(1);
      expect(paged.body.items[0].type).toBe('sensor-silent');
      expect(paged.body.totalPages).toBe(2);
    });

    it('detalhe traz a regra, a baseline aprendida e a linha do tempo completa', async () => {
      const [alert] = await occurrences();
      const response = await get(`/api/alerts/${alert.id}`).expect(200);
      expect(response.body.rule).toMatchObject({ key: 'vibration-radial', a1Threshold: 1.5, a2Threshold: 2, clearThreshold: 1.4, policyVersion: 1 });
      // A baseline é a referência que explica o limiar: sem ela, "1,5×" não diz de quê.
      expect(response.body.baseline).toMatchObject({
        status: 'established',
        learningCycles: 192,
        sensorSerialNumber: SENSOR_SERIAL,
        minBinCount: 8,
        maxBinCount: 8,
      });
      expect(response.body.baseline.value).toBeCloseTo(BASELINE_G, 9);
      expect(response.body.baseline.learnedFrom).toBe('2026-03-30T00:00:00.000Z');
      expect(response.body.baseline.learnedTo).toBe('2026-04-01T00:00:00.000Z');
      expect(response.body.events.map((e: { type: string }) => e.type)).toEqual(['opened', 'escalated', 'resolved']);
      expect(response.body.events[1]).toMatchObject({ fromLevel: 'A1', toLevel: 'A2', fromState: 'active', toState: 'active' });
      // Leitura liberada ao VIEWER.
      await get(`/api/alerts/${alert.id}`, viewerBearer).expect(200);
    });

    it('reconhecer: VIEWER recebe 403; ADMIN reconhece (mesmo resolvido), é idempotente e valida o corpo', async () => {
      const [alert] = await occurrences();
      const forbidden = await http().post(`/api/alerts/${alert.id}/acknowledge`).set('Authorization', viewerBearer).send({}).expect(403);
      expect(forbidden.body.code).toBe('FORBIDDEN');
      await http().post(`/api/alerts/${alert.id}/acknowledge`).send({}).expect(401);
      const bad = await http().post(`/api/alerts/${alert.id}/acknowledge`).set('Authorization', bearer).send({ nota: 'x' }).expect(400);
      expect(bad.body.code).toBe('INVALID_ACKNOWLEDGE_PAYLOAD');

      const first = await http()
        .post(`/api/alerts/${alert.id}/acknowledge`)
        .set('Authorization', bearer)
        .send({ note: 'Voltou ao normal; ciente.' })
        .expect(200);
      expect(first.body.status).toBe('resolved');
      expect(first.body.state).toBe('resolved');
      expect(first.body.acknowledgedBy).toBe(ADMIN_EMAIL);
      expect(first.body.acknowledgedLevel).toBe('A2');
      expect(first.body.acknowledgeNote).toBe('Voltou ao normal; ciente.');
      expect(first.body.events.map((e: { type: string }) => e.type)).toEqual(['opened', 'escalated', 'resolved', 'acknowledged']);
      expect(first.body.events[3]).toMatchObject({ actor: ADMIN_EMAIL, note: 'Voltou ao normal; ciente.', fromState: 'resolved', toState: 'resolved' });

      const again = await http().post(`/api/alerts/${alert.id}/acknowledge`).set('Authorization', bearer).send({ note: 'outra' }).expect(200);
      expect(again.body.acknowledgedAt).toBe(first.body.acknowledgedAt);
      expect(again.body.acknowledgeNote).toBe('Voltou ao normal; ciente.');
      expect(again.body.events).toHaveLength(4);

      const list = await get(`/api/alerts?machine=${encodeURIComponent(MACHINE_NAME)}`).expect(200);
      // Reconhecido depois de resolvido continua contando como resolvido — ACK é ortogonal.
      expect(list.body.counts).toEqual({ total: 2, open: 0, acknowledged: 0, resolved: 2, activeA1: 0, activeA2: 0 });
    });

    it('reconhecer um episódio ATIVO muda o status para acknowledged, e a escalada limpa o reconhecimento', async () => {
      // Novo episódio A1 no mesmo ponto: dois ciclos a 1,7× depois da retomada (03/04 12:00).
      const day = (hhmm: string) => `2026-04-03T${hhmm}:00.000Z`;
      await ingest(cyclePayload(day('12:15'), 1.7)).expect(201);
      await ingest(cyclePayload(day('12:30'), 1.7)).expect(201);
      const active = await prisma.alertOccurrence.findFirstOrThrow({ where: { monitoringPointId: pointId, state: 'ACTIVE', type: 'VIBRATION_THRESHOLD' } });
      const acked = await http().post(`/api/alerts/${active.id}/acknowledge`).set('Authorization', bearer).send({}).expect(200);
      expect(acked.body).toMatchObject({ status: 'acknowledged', state: 'active', level: 'A1', acknowledgedLevel: 'A1' });
      let list = await get(`/api/alerts?machine=${encodeURIComponent(MACHINE_NAME)}&status=acknowledged`).expect(200);
      expect(list.body.total).toBe(1);
      expect(list.body.counts).toMatchObject({ open: 0, acknowledged: 1, activeA1: 1 });

      await ingest(cyclePayload(day('12:45'), 2.6)).expect(201);
      await ingest(cyclePayload(day('13:00'), 2.6)).expect(201);
      const escalated = await get(`/api/alerts/${active.id}`).expect(200);
      expect(escalated.body).toMatchObject({ level: 'A2', status: 'open', acknowledgedAt: null, acknowledgedBy: null, acknowledgedLevel: null });
      const escalation = escalated.body.events.find((e: { type: string }) => e.type === 'escalated');
      expect(escalation.note).toMatch(/invalidado pela escalada/);
      list = await get(`/api/alerts?machine=${encodeURIComponent(MACHINE_NAME)}&status=active`).expect(200);
      expect(list.body.counts).toMatchObject({ open: 1, acknowledged: 0, activeA2: 1 });
    });
  });
});
