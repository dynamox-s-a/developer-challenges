/**
 * O motor: aplica evidência de ciclos ao estado persistido e abre, escala, atualiza e
 * resolve episódios. Não conhece Nest — o serviço e os CLIs o instanciam com um
 * `PrismaClient` qualquer.
 *
 * Garantias, na ordem em que a transação as obtém:
 *  1. evidência imutável gravada com `ON CONFLICT DO NOTHING` (recalcular é idempotente);
 *  2. estados (regra, ponto) criados com `skipDuplicates` e travados com `FOR UPDATE`
 *     em ordem determinística de `ruleId` — duas avaliações do mesmo ponto se serializam;
 *  3. a avaliação (ciclo, regra, versão) é inserida com `ON CONFLICT DO NOTHING RETURNING`:
 *     sem linha de volta, o ciclo já foi avaliado por esta política e NADA é aplicado —
 *     exactly-once garantido pela constraint, sem exceção como fluxo de controle;
 *  4. `activeKey` única no banco é a última linha de defesa do dedup: o motor nunca cria
 *     um segundo episódio ativo para a mesma (regra, ponto), e se algum caminho tentasse,
 *     o banco recusaria.
 *
 * Tempo: toda data escrita em ocorrência, evento e estado é o tempo DO DADO (início do ciclo),
 * não o relógio da máquina — assim o backfill de 30 dias produz a mesma linha do tempo que a
 * ingestão ao vivo produziria.
 */
import { randomUUID } from 'node:crypto';

import type { AlertOccurrence, AlertRuleState, Prisma, PrismaClient } from '@prisma/client';

import { DEFAULT_CONDITION_POLICY, type AlertLevel } from '@dynamox/domain';

import {
  toDomainAlertLevel,
  toPrismaAlertLevel,
  toPrismaAlertThresholdMode,
  toPrismaAlertType,
} from '../common/alert.mapper';
import type { RuleRecord } from './alert-rules';
import { OUTCOME_TO_PRISMA, type StateRecord, stateUpdateData, toStateRecord } from './alert-state';
import { type CycleEvidence, loadCycleEvidence, loadLearningRows } from './alerts.sql';
import { buildBaselineProfile } from './core/baseline';
import { stepThreshold } from './core/decision';
import { type FleetPresenceDecision, type PresencePoint, sweepPresence } from './core/presence';
import type { ActiveEpisode, CycleSample, StepResult, ThresholdState } from './core/types';

type Tx = Prisma.TransactionClient;
type EngineClient = Pick<PrismaClient, '$transaction' | '$queryRaw'>;

export interface EvaluationSummary {
  cycles: number;
  evaluations: number;
  opened: number;
  escalated: number;
  resolved: number;
  resumed: number;
  outOfOrder: number;
  unassigned: number;
}

export const EMPTY_SUMMARY: Readonly<EvaluationSummary> = Object.freeze({
  cycles: 0,
  evaluations: 0,
  opened: 0,
  escalated: 0,
  resolved: 0,
  resumed: 0,
  outOfOrder: 0,
  unassigned: 0,
});

export function mergeSummaries(target: EvaluationSummary, delta: EvaluationSummary): EvaluationSummary {
  for (const key of Object.keys(EMPTY_SUMMARY) as Array<keyof EvaluationSummary>) target[key] += delta[key];
  return target;
}

interface PointIdentity {
  machineId: string | null;
  machineName: string | null;
  monitoringPointName: string | null;
}

/** Tudo que a transação sabe de um ponto: estados travados, episódios ativos e cadastro. */
interface PointContext {
  monitoringPointId: string;
  states: Map<string, StateRecord>;
  actives: Map<string, AlertOccurrence | null>;
  dirty: Set<string>;
  identity: PointIdentity | null;
}

export const activeKeyFor = (ruleId: string, scope: string): string => `${ruleId}:${scope}`;

function toEpisode(row: AlertOccurrence | null): ActiveEpisode | null {
  return row
    ? {
        id: row.id,
        level: toDomainAlertLevel(row.level),
        acknowledgedAtMs: row.acknowledgedAt?.getTime() ?? null,
        peakMeasure: row.peakMeasure,
      }
    : null;
}

/** A grandeza que cada regra avalia — a mesma exigência mínima de amostras da condição. */
export function valueFor(rule: RuleRecord, cycle: CycleEvidence): number | null {
  switch (rule.type) {
    case 'vibration-threshold':
      return cycle.radialSampleCount >= DEFAULT_CONDITION_POLICY.minWindowSamples ? cycle.radialRms : null;
    case 'temperature-threshold':
      return cycle.temperatureCount > 0 ? cycle.temperatureAvg : null;
    default:
      return null;
  }
}

export const isPresenceRule = (rule: RuleRecord): boolean => rule.thresholdMode === 'elapsed-intervals';

export interface ApplyOptions {
  /** Timeout da transação; o padrão cobre um ciclo, o backfill pede mais para um dia inteiro. */
  timeoutMs?: number;
}

export interface SweepOptions {
  /**
   * Restringe a varredura aos pontos de UMA máquina — só presença por sensor, sem frota
   * (a frota é a planta inteira; um recorte não pode abrir nem resolver o episódio dela).
   */
  machineId?: string;
  timeoutMs?: number;
}

export interface SweepSummary {
  instrumented: number;
  silent: number;
  opened: number;
  escalated: number;
  resolved: number;
  fleet: FleetPresenceDecision['kind'];
}

export const EMPTY_SWEEP: Readonly<SweepSummary> = Object.freeze({
  instrumented: 0,
  silent: 0,
  opened: 0,
  escalated: 0,
  resolved: 0,
  fleet: 'none',
});

export const FLEET_SCOPE = 'fleet';

export class AlertEngine {
  constructor(
    private readonly prisma: EngineClient,
    private readonly rules: readonly RuleRecord[],
  ) {}

  get enabledRules(): readonly RuleRecord[] {
    return this.rules;
  }

  /** Avalia UM ciclo recém-ingerido: evidência fora da transação, decisão e escrita dentro. */
  async evaluateCycle(cycleId: string): Promise<EvaluationSummary> {
    const evidence = await loadCycleEvidence(this.prisma, [cycleId]);
    return this.applyEvidence(evidence);
  }

  /** Aplica um lote de evidências (já em ordem temporal) numa única transação. */
  async applyEvidence(evidence: readonly CycleEvidence[], options: ApplyOptions = {}): Promise<EvaluationSummary> {
    if (evidence.length === 0) return { ...EMPTY_SUMMARY };
    return this.prisma.$transaction((tx) => this.applyInTransaction(tx, evidence), {
      maxWait: 5_000,
      timeout: options.timeoutMs ?? 15_000,
    });
  }

  private async applyInTransaction(tx: Tx, evidence: readonly CycleEvidence[]): Promise<EvaluationSummary> {
    const summary: EvaluationSummary = { ...EMPTY_SUMMARY, cycles: evidence.length };
    const thresholdRules = this.rules.filter((rule) => !isPresenceRule(rule));
    const presenceRule = this.rules.find(isPresenceRule) ?? null;

    await tx.alertCycleEvidence.createMany({
      data: evidence.map((cycle) => ({
        cycleId: cycle.cycleId,
        monitoringPointId: cycle.monitoringPointId,
        sensorId: cycle.sensorId,
        sensorSerialNumber: cycle.sensorSerialNumber,
        startedAt: cycle.startedAt,
        endedAt: cycle.endedAt,
        radialRms: cycle.radialRms,
        radialSampleCount: cycle.radialSampleCount,
        temperatureAvg: cycle.temperatureAvg,
        temperatureCount: cycle.temperatureCount,
        rpmAvg: cycle.rpmAvg,
      })),
      skipDuplicates: true,
    });

    const points = new Map<string, PointContext>();

    for (const cycle of evidence) {
      if (cycle.monitoringPointId === null) {
        // Sensor sem ponto: fica no ledger como UNASSIGNED — o ciclo existe, ninguém o avalia.
        for (const rule of thresholdRules) {
          if (await this.insertEvaluation(tx, cycle.cycleId, rule, 'UNASSIGNED', null)) summary.evaluations += 1;
        }
        summary.unassigned += 1;
        continue;
      }

      const point = await this.lockPoint(tx, points, cycle.monitoringPointId);

      for (const rule of thresholdRules) {
        const state = point.states.get(rule.id);
        if (!state) continue;
        const active = point.actives.get(rule.id) ?? null;
        const sample: CycleSample = {
          cycleId: cycle.cycleId,
          sensorId: cycle.sensorId,
          startedAtMs: cycle.startedAt.getTime(),
          endedAtMs: cycle.endedAt.getTime(),
          value: valueFor(rule, cycle),
        };
        const result = stepThreshold(rule, state.core, toEpisode(active), sample);

        const inserted = await this.insertEvaluation(
          tx,
          cycle.cycleId,
          rule,
          OUTCOME_TO_PRISMA[result.outcome],
          result.measure,
        );
        if (!inserted) continue; // já avaliado por esta versão da política: nada a aplicar
        summary.evaluations += 1;
        if (result.outcome === 'out-of-order') {
          summary.outOfOrder += 1;
          continue;
        }

        let core = result.state;
        if (result.outcome === 'learning' && core.learningCount === 1) {
          state.baselineFrom = cycle.startedAt;
          state.baselineTo = null;
          state.baselineEstablishedAt = null;
        }
        if (result.establishBaseline) core = await this.establishBaseline(tx, rule, state, core, cycle);
        state.core = core;
        point.dirty.add(rule.id);

        if (result.outcome !== 'evaluated') continue;
        await this.applyDecision(tx, point, rule, active, cycle, sample, result, summary);
      }

      if (presenceRule) await this.touchPresence(tx, point, presenceRule, cycle, summary);
    }

    for (const point of points.values()) {
      for (const ruleId of point.dirty) {
        const state = point.states.get(ruleId);
        if (state) await tx.alertRuleState.update({ where: { id: state.id }, data: stateUpdateData(state) });
      }
    }

    return summary;
  }

  /** Cria (se preciso) e trava os estados do ponto; carrega os episódios ativos. Uma vez por transação. */
  private async lockPoint(tx: Tx, points: Map<string, PointContext>, monitoringPointId: string): Promise<PointContext> {
    const cached = points.get(monitoringPointId);
    if (cached) return cached;

    const ruleIds = this.rules.map((rule) => rule.id);
    await tx.alertRuleState.createMany({
      data: ruleIds.map((ruleId) => ({ id: randomUUID(), ruleId, monitoringPointId })),
      skipDuplicates: true,
    });
    await tx.$queryRaw`
      SELECT s.id FROM alert_rule_states s
      WHERE s."monitoringPointId" = ${monitoringPointId} AND s."ruleId" = ANY(${ruleIds}::text[])
      ORDER BY s."ruleId"
      FOR UPDATE OF s
    `;
    const rows: AlertRuleState[] = await tx.alertRuleState.findMany({
      where: { monitoringPointId, ruleId: { in: ruleIds } },
    });
    const actives = await tx.alertOccurrence.findMany({
      where: { activeKey: { in: ruleIds.map((ruleId) => activeKeyFor(ruleId, monitoringPointId)) } },
    });

    const context: PointContext = {
      monitoringPointId,
      states: new Map(rows.map((row) => [row.ruleId, toStateRecord(row)])),
      actives: new Map(ruleIds.map((ruleId) => [ruleId, actives.find((row) => row.ruleId === ruleId) ?? null])),
      dirty: new Set(),
      identity: null,
    };
    points.set(monitoringPointId, context);
    return context;
  }

  private async insertEvaluation(
    tx: Tx,
    cycleId: string,
    rule: RuleRecord,
    outcome: string,
    measure: number | null,
  ): Promise<boolean> {
    const rows = await tx.$queryRaw<Array<{ id: string }>>`
      INSERT INTO alert_rule_evaluations ("id", "cycleId", "ruleId", "policyVersion", "outcome", "measure", "evaluatedAt")
      VALUES (${randomUUID()}, ${cycleId}, ${rule.id}, ${rule.policyVersion},
              ${outcome}::"AlertEvaluationOutcome", ${measure}::double precision, now())
      ON CONFLICT ("cycleId", "ruleId", "policyVersion") DO NOTHING
      RETURNING "id"
    `;
    return rows.length > 0;
  }

  private async establishBaseline(
    tx: Tx,
    rule: RuleRecord,
    state: StateRecord,
    core: ThresholdState,
    cycle: CycleEvidence,
  ): Promise<ThresholdState> {
    if (core.baselineSensorId === null || rule.learningCycles === null) return core;
    const rows = await loadLearningRows(tx, {
      ruleId: rule.id,
      policyVersion: rule.policyVersion,
      monitoringPointId: state.monitoringPointId,
      sensorId: core.baselineSensorId,
      from: state.baselineFrom ?? new Date(0),
      limit: rule.learningCycles,
      column: rule.type === 'temperature-threshold' ? 'temperatureAvg' : 'radialRms',
    });
    const built = buildBaselineProfile(
      rows.map((row) => ({ startedAtMs: row.startedAt.getTime(), value: row.value })),
      rule.minBinCount ?? 1,
    );
    if (!built) return core;
    state.baselineTo = cycle.startedAt;
    state.baselineEstablishedAt = cycle.startedAt;
    return {
      ...core,
      baselineStatus: 'established',
      baselineValue: built.overall,
      baselineProfile: built.profile,
      baselineBinCounts: built.binCounts,
    };
  }

  private async identityOf(tx: Tx, point: PointContext): Promise<PointIdentity> {
    if (point.identity) return point.identity;
    const row = await tx.monitoringPoint.findUnique({
      where: { id: point.monitoringPointId },
      include: { machine: { select: { id: true, name: true } } },
    });
    point.identity = {
      machineId: row?.machine.id ?? null,
      machineName: row?.machine.name ?? null,
      monitoringPointName: row?.name ?? null,
    };
    return point.identity;
  }

  private async applyDecision(
    tx: Tx,
    point: PointContext,
    rule: RuleRecord,
    active: AlertOccurrence | null,
    cycle: CycleEvidence,
    sample: CycleSample,
    result: StepResult,
    summary: EvaluationSummary,
  ): Promise<void> {
    const reading = { cycleId: cycle.cycleId, value: sample.value, measure: result.measure };
    const { decision } = result;

    if (decision.kind === 'open') {
      const identity = await this.identityOf(tx, point);
      const threshold = decision.level === 'A2' && rule.a2Threshold !== null ? rule.a2Threshold : rule.a1Threshold;
      const created = await tx.alertOccurrence.create({
        data: {
          ruleId: rule.id,
          type: toPrismaAlertType(rule.type),
          scope: 'POINT',
          level: toPrismaAlertLevel(decision.level),
          state: 'ACTIVE',
          activeKey: activeKeyFor(rule.id, point.monitoringPointId),
          machineId: identity.machineId,
          machineName: identity.machineName,
          monitoringPointId: point.monitoringPointId,
          monitoringPointName: identity.monitoringPointName,
          sensorId: cycle.sensorId,
          sensorSerialNumber: cycle.sensorSerialNumber,
          openedAt: cycle.startedAt,
          lastEvaluatedAt: cycle.startedAt,
          metric: rule.metric,
          unit: rule.unit,
          thresholdMode: toPrismaAlertThresholdMode(rule.thresholdMode),
          triggerCycleId: cycle.cycleId,
          triggerAt: cycle.startedAt,
          triggerValue: sample.value,
          triggerBaseline: result.baseline,
          triggerMeasure: result.measure,
          triggerThreshold: threshold,
          consecutiveEvaluations: rule.consecutiveTrigger,
          peakValue: sample.value,
          peakMeasure: result.measure,
          peakAt: cycle.startedAt,
          peakCycleId: cycle.cycleId,
          lastValue: sample.value,
          lastMeasure: result.measure,
          lastCycleId: cycle.cycleId,
          policyVersion: rule.policyVersion,
        },
      });
      await tx.alertEvent.create({
        data: {
          alertId: created.id,
          type: 'OPENED',
          toState: 'ACTIVE',
          toLevel: created.level,
          occurredAt: cycle.startedAt,
          threshold,
          ...reading,
        },
      });
      point.actives.set(rule.id, created);
      summary.opened += 1;
      return;
    }

    if (!active) return;

    const peak =
      result.measure !== null && (active.peakMeasure === null || result.measure > active.peakMeasure)
        ? { peakValue: sample.value, peakMeasure: result.measure, peakAt: cycle.startedAt, peakCycleId: cycle.cycleId }
        : {};
    const progress = {
      lastEvaluatedAt: cycle.startedAt,
      lastValue: sample.value,
      lastMeasure: result.measure,
      lastCycleId: cycle.cycleId,
      ...peak,
    };

    if (decision.kind === 'escalate') {
      const hadAck = active.acknowledgedAt !== null;
      const updated = await tx.alertOccurrence.update({
        where: { id: active.id },
        data: {
          ...progress,
          level: 'A2',
          // Mudança de prioridade exige novo reconhecimento: o anterior deixa de valer.
          acknowledgedAt: null,
          acknowledgedById: null,
          acknowledgedByEmail: null,
          acknowledgedLevel: null,
          acknowledgeNote: null,
        },
      });
      await tx.alertEvent.create({
        data: {
          alertId: active.id,
          type: 'ESCALATED',
          fromState: 'ACTIVE',
          toState: 'ACTIVE',
          fromLevel: active.level,
          toLevel: 'A2',
          occurredAt: cycle.startedAt,
          threshold: rule.a2Threshold,
          note: hadAck ? 'Reconhecimento anterior invalidado pela escalada.' : null,
          ...reading,
        },
      });
      point.actives.set(rule.id, updated);
      summary.escalated += 1;
      return;
    }

    if (decision.kind === 'resolve') {
      await tx.alertOccurrence.update({
        where: { id: active.id },
        data: {
          ...progress,
          state: 'RESOLVED',
          activeKey: null,
          resolvedAt: cycle.startedAt,
          resolutionReason: 'CONDITION_CLEARED',
        },
      });
      await tx.alertEvent.create({
        data: {
          alertId: active.id,
          type: 'RESOLVED',
          fromState: 'ACTIVE',
          toState: 'RESOLVED',
          fromLevel: active.level,
          toLevel: active.level,
          occurredAt: cycle.startedAt,
          threshold: rule.clearThreshold,
          ...reading,
        },
      });
      point.actives.set(rule.id, null);
      summary.resolved += 1;
      return;
    }

    // Continua acima (ou abaixo, ainda sem clear): a mesma linha avança — nunca uma nova.
    const updated = await tx.alertOccurrence.update({ where: { id: active.id }, data: progress });
    point.actives.set(rule.id, updated);
  }

  /**
   * Presença do PRÓPRIO ponto: avança `lastSeenAt` de forma monotônica (um ciclo atrasado
   * não recua a presença) e resolve um SENSOR_SILENT aberto — a telemetria voltou.
   */
  private async touchPresence(
    tx: Tx,
    point: PointContext,
    rule: RuleRecord,
    cycle: CycleEvidence,
    summary: EvaluationSummary,
  ): Promise<void> {
    const state = point.states.get(rule.id);
    if (!state) return;
    const startedAtMs = cycle.startedAt.getTime();
    const endedAtMs = cycle.endedAt.getTime();
    const core = state.core;
    const advances = core.lastEvaluatedAtMs === null || startedAtMs > core.lastEvaluatedAtMs;
    if (advances || (core.lastSeenAtMs ?? 0) < endedAtMs) {
      state.core = {
        ...core,
        baselineSensorId: cycle.sensorId ?? core.baselineSensorId,
        lastSeenAtMs: Math.max(core.lastSeenAtMs ?? 0, endedAtMs),
        lastEvaluatedAtMs: Math.max(core.lastEvaluatedAtMs ?? 0, startedAtMs),
        lastEvaluatedCycleId: advances ? cycle.cycleId : core.lastEvaluatedCycleId,
      };
      point.dirty.add(rule.id);
    }

    const active = point.actives.get(rule.id) ?? null;
    if (!active || cycle.startedAt < active.openedAt) return;
    await this.resolveSilence(tx, active, cycle.startedAt, cycle.cycleId);
    point.actives.set(rule.id, null);
    summary.resumed += 1;
  }

  /**
   * Varredura de presença com um relógio dado (o de parede no timer, o replayado no backfill):
   * quem está mudo, há quanto tempo, e se a planta inteira parou junto. Trava os estados de
   * presença dos pontos instrumentados para não abrir um SENSOR_SILENT por cima de um ciclo
   * que está sendo aplicado neste exato momento.
   */
  async sweepPresence(nowMs: number, options: SweepOptions = {}): Promise<SweepSummary> {
    const rule = this.rules.find(isPresenceRule);
    if (!rule) return { ...EMPTY_SWEEP };
    const scoped = options.machineId !== undefined;
    const effectiveRule: RuleRecord = scoped ? { ...rule, fleetCollapseFraction: null } : rule;
    const fleetKey = activeKeyFor(rule.id, FLEET_SCOPE);

    return this.prisma.$transaction(
      async (tx) => {
        const candidates = await tx.alertRuleState.findMany({
          where: {
            ruleId: rule.id,
            lastSeenAt: { not: null },
            monitoringPoint: { sensor: { isNot: null }, ...(scoped ? { machineId: options.machineId } : {}) },
          },
          include: { monitoringPoint: { include: { machine: true, sensor: true } } },
          orderBy: { id: 'asc' },
        });
        if (candidates.length === 0) return { ...EMPTY_SWEEP };

        const ids = candidates.map((row) => row.id);
        await tx.$queryRaw`SELECT s.id FROM alert_rule_states s WHERE s.id = ANY(${ids}::text[]) ORDER BY s.id FOR UPDATE OF s`;
        // Relê depois do lock: o valor que decide é o que ninguém mais está alterando.
        const fresh = new Map(
          (await tx.alertRuleState.findMany({ where: { id: { in: ids } }, select: { id: true, lastSeenAt: true } })).map(
            (row) => [row.id, row.lastSeenAt],
          ),
        );
        const actives = await tx.alertOccurrence.findMany({
          where: {
            activeKey: { in: [...candidates.map((row) => activeKeyFor(rule.id, row.monitoringPointId)), fleetKey] },
          },
        });
        // Um episódio aberto DEPOIS deste relógio (varredura ao vivo durante um backfill, por
        // exemplo) não existe para esta varredura: nem se atualiza nem se resolve no passado.
        const activeFor = (scope: string) =>
          actives.find((row) => row.activeKey === activeKeyFor(rule.id, scope) && row.openedAt.getTime() <= nowMs) ?? null;

        const points: PresencePoint[] = candidates.flatMap((row) => {
          const lastSeenAt = fresh.get(row.id) ?? row.lastSeenAt;
          if (!lastSeenAt) return [];
          return [
            {
              monitoringPointId: row.monitoringPointId,
              sensorId: row.monitoringPoint.sensor?.id ?? null,
              lastSeenAtMs: lastSeenAt.getTime(),
              active: toEpisode(activeFor(row.monitoringPointId)),
            },
          ];
        });
        const activeFleet = scoped ? null : activeFor(FLEET_SCOPE);
        const sweep = sweepPresence(effectiveRule, points, toEpisode(activeFleet), nowMs);
        const intervalSeconds = rule.expectedIntervalSeconds ?? 900;
        const summary: SweepSummary = {
          ...EMPTY_SWEEP,
          instrumented: points.length,
          // Mudos de fato (cobertos pela frota ou não) — o que o operador quer saber do log.
          silent: points.filter((p) => (nowMs - p.lastSeenAtMs) / (intervalSeconds * 1000) > rule.a1Threshold).length,
          fleet: scoped ? 'none' : sweep.fleet.kind,
        };
        const now = new Date(nowMs);
        const elapsedSeconds = (intervals: number) => Math.round(intervals * intervalSeconds);
        const thresholdFor = (level: AlertLevel) => (level === 'A2' && rule.a2Threshold !== null ? rule.a2Threshold : rule.a1Threshold);

        if (!scoped && sweep.fleet.kind === 'open') {
          const { level, affectedCount, elapsedIntervals, silentSinceMs } = sweep.fleet;
          const created = await tx.alertOccurrence.create({
            data: {
              ruleId: rule.id,
              type: 'FLEET_SILENT',
              scope: 'FLEET',
              level: toPrismaAlertLevel(level),
              state: 'ACTIVE',
              activeKey: fleetKey,
              openedAt: now,
              lastEvaluatedAt: now,
              metric: rule.metric,
              unit: rule.unit,
              thresholdMode: toPrismaAlertThresholdMode(rule.thresholdMode),
              triggerAt: new Date(silentSinceMs),
              triggerValue: elapsedSeconds(elapsedIntervals),
              triggerBaseline: intervalSeconds,
              triggerMeasure: elapsedIntervals,
              triggerThreshold: thresholdFor(level),
              consecutiveEvaluations: 1,
              peakValue: elapsedSeconds(elapsedIntervals),
              peakMeasure: elapsedIntervals,
              peakAt: now,
              lastValue: elapsedSeconds(elapsedIntervals),
              lastMeasure: elapsedIntervals,
              affectedCount,
              policyVersion: rule.policyVersion,
            },
          });
          await tx.alertEvent.create({
            data: {
              alertId: created.id,
              type: 'OPENED',
              toState: 'ACTIVE',
              toLevel: created.level,
              occurredAt: now,
              value: elapsedSeconds(elapsedIntervals),
              measure: elapsedIntervals,
              threshold: thresholdFor(level),
            },
          });
          summary.opened += 1;
        } else if (!scoped && sweep.fleet.kind === 'update' && activeFleet) {
          const { level, affectedCount, elapsedIntervals, escalate } = sweep.fleet;
          await tx.alertOccurrence.update({
            where: { id: activeFleet.id },
            data: {
              lastEvaluatedAt: now,
              lastValue: elapsedSeconds(elapsedIntervals),
              lastMeasure: elapsedIntervals,
              peakValue: elapsedSeconds(elapsedIntervals),
              peakMeasure: elapsedIntervals,
              peakAt: now,
              affectedCount,
              ...(escalate
                ? {
                    level: 'A2' as const,
                    acknowledgedAt: null,
                    acknowledgedById: null,
                    acknowledgedByEmail: null,
                    acknowledgedLevel: null,
                    acknowledgeNote: null,
                  }
                : {}),
            },
          });
          if (escalate) {
            await tx.alertEvent.create({
              data: {
                alertId: activeFleet.id,
                type: 'ESCALATED',
                fromState: 'ACTIVE',
                toState: 'ACTIVE',
                fromLevel: activeFleet.level,
                toLevel: 'A2',
                occurredAt: now,
                value: elapsedSeconds(elapsedIntervals),
                measure: elapsedIntervals,
                threshold: thresholdFor(level),
                note: activeFleet.acknowledgedAt ? 'Reconhecimento anterior invalidado pela escalada.' : null,
              },
            });
            summary.escalated += 1;
          }
        } else if (!scoped && sweep.fleet.kind === 'resolve' && activeFleet) {
          await this.resolveSilence(tx, activeFleet, now, null);
          summary.resolved += 1;
        }

        for (const entry of sweep.points) {
          const row = candidates.find((candidate) => candidate.monitoringPointId === entry.monitoringPointId);
          if (!row) continue;
          const active = activeFor(entry.monitoringPointId);
          const { decision } = entry;

          if (decision.kind === 'open') {
            const created = await tx.alertOccurrence.create({
              data: {
                ruleId: rule.id,
                type: 'SENSOR_SILENT',
                scope: 'POINT',
                level: toPrismaAlertLevel(decision.level),
                state: 'ACTIVE',
                activeKey: activeKeyFor(rule.id, entry.monitoringPointId),
                machineId: row.monitoringPoint.machine.id,
                machineName: row.monitoringPoint.machine.name,
                monitoringPointId: entry.monitoringPointId,
                monitoringPointName: row.monitoringPoint.name,
                sensorId: row.monitoringPoint.sensor?.id ?? null,
                sensorSerialNumber: row.monitoringPoint.sensor?.serialNumber ?? null,
                openedAt: now,
                lastEvaluatedAt: now,
                metric: rule.metric,
                unit: rule.unit,
                thresholdMode: toPrismaAlertThresholdMode(rule.thresholdMode),
                triggerAt: new Date(decision.silentSinceMs),
                triggerValue: elapsedSeconds(decision.elapsedIntervals),
                triggerBaseline: intervalSeconds,
                triggerMeasure: decision.elapsedIntervals,
                triggerThreshold: thresholdFor(decision.level),
                consecutiveEvaluations: 1,
                peakValue: elapsedSeconds(decision.elapsedIntervals),
                peakMeasure: decision.elapsedIntervals,
                peakAt: now,
                lastValue: elapsedSeconds(decision.elapsedIntervals),
                lastMeasure: decision.elapsedIntervals,
                policyVersion: rule.policyVersion,
              },
            });
            await tx.alertEvent.create({
              data: {
                alertId: created.id,
                type: 'OPENED',
                toState: 'ACTIVE',
                toLevel: created.level,
                occurredAt: now,
                value: elapsedSeconds(decision.elapsedIntervals),
                measure: decision.elapsedIntervals,
                threshold: thresholdFor(decision.level),
              },
            });
            summary.opened += 1;
          } else if (decision.kind === 'escalate' && active) {
            await tx.alertOccurrence.update({
              where: { id: active.id },
              data: {
                level: 'A2',
                lastEvaluatedAt: now,
                lastValue: elapsedSeconds(decision.elapsedIntervals),
                lastMeasure: decision.elapsedIntervals,
                peakValue: elapsedSeconds(decision.elapsedIntervals),
                peakMeasure: decision.elapsedIntervals,
                peakAt: now,
                acknowledgedAt: null,
                acknowledgedById: null,
                acknowledgedByEmail: null,
                acknowledgedLevel: null,
                acknowledgeNote: null,
              },
            });
            await tx.alertEvent.create({
              data: {
                alertId: active.id,
                type: 'ESCALATED',
                fromState: 'ACTIVE',
                toState: 'ACTIVE',
                fromLevel: active.level,
                toLevel: 'A2',
                occurredAt: now,
                value: elapsedSeconds(decision.elapsedIntervals),
                measure: decision.elapsedIntervals,
                threshold: thresholdFor('A2'),
                note: active.acknowledgedAt ? 'Reconhecimento anterior invalidado pela escalada.' : null,
              },
            });
            summary.escalated += 1;
          } else if (decision.kind === 'resolve' && active) {
            await this.resolveSilence(tx, active, now, null);
            summary.resolved += 1;
          } else if (active && active.level === 'A2') {
            // Continua mudo: a mesma linha avança.
            const elapsedIntervals = (nowMs - (fresh.get(row.id)?.getTime() ?? nowMs)) / (intervalSeconds * 1000);
            await tx.alertOccurrence.update({
              where: { id: active.id },
              data: {
                lastEvaluatedAt: now,
                lastValue: elapsedSeconds(elapsedIntervals),
                lastMeasure: elapsedIntervals,
                peakValue: elapsedSeconds(elapsedIntervals),
                peakMeasure: elapsedIntervals,
                peakAt: now,
              },
            });
          }
        }

        return summary;
      },
      { maxWait: 5_000, timeout: options.timeoutMs ?? 15_000 },
    );
  }

  protected async resolveSilence(tx: Tx, active: AlertOccurrence, at: Date, cycleId: string | null): Promise<void> {
    await tx.alertOccurrence.update({
      where: { id: active.id },
      data: {
        state: 'RESOLVED',
        activeKey: null,
        resolvedAt: at,
        resolutionReason: 'TELEMETRY_RESUMED',
        lastEvaluatedAt: at,
        lastCycleId: cycleId,
      },
    });
    await tx.alertEvent.create({
      data: {
        alertId: active.id,
        type: 'RESOLVED',
        fromState: 'ACTIVE',
        toState: 'RESOLVED',
        fromLevel: active.level,
        toLevel: active.level,
        occurredAt: at,
        cycleId,
      },
    });
  }
}

export type { AlertLevel };
