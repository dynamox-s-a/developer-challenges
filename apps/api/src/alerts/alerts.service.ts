/**
 * Fachada Nest do motor de alertas: garante as regras da política no boot, avalia cada
 * ciclo depois do commit da ingestão, varre a presença por timer e expõe o motor às
 * consultas.
 *
 * `ALERTS_EVALUATE_ON_INGEST=false` desliga a avaliação síncrona (útil para carregar um
 * histórico e reconciliá-lo depois com `alerts:backfill`). `ALERTS_PRESENCE_SWEEP_MS`
 * define a cadência da varredura de presença (padrão 5 min; `0` desliga). Sob Jest a
 * varredura nunca arma: o timer abriria FLEET_SILENT para a planta de demonstração no meio
 * de qualquer suíte.
 */
import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AlertEngine, type EvaluationSummary, type SweepOptions, type SweepSummary } from './alert-engine';
import { ensureAlertRules, type RuleRecord } from './alert-rules';

const DEFAULT_SWEEP_MS = 300_000;
const FIRST_SWEEP_DELAY_MS = 15_000;

export function presenceSweepIntervalMs(env: NodeJS.ProcessEnv = process.env): number {
  if (env.JEST_WORKER_ID !== undefined) return 0;
  const raw = env.ALERTS_PRESENCE_SWEEP_MS?.trim();
  if (raw === undefined || raw === '') return DEFAULT_SWEEP_MS;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : DEFAULT_SWEEP_MS;
}

@Injectable()
export class AlertsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AlertsService.name);
  private engine: AlertEngine | null = null;
  private rules: RuleRecord[] = [];
  private timers: Array<NodeJS.Timeout> = [];
  private sweeping = false;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.ready();
    const every = presenceSweepIntervalMs();
    if (every <= 0) return;
    const tick = () => void this.runPresenceSweep();
    // `unref`: o timer nunca segura o processo — um SIGTERM encerra a API na hora.
    this.timers = [setTimeout(tick, FIRST_SWEEP_DELAY_MS).unref(), setInterval(tick, every).unref()];
    this.logger.log(`Varredura de presença a cada ${Math.round(every / 1000)} s.`);
  }

  onModuleDestroy(): void {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers = [];
  }

  /** Varredura de presença com o relógio informado (parede no timer; replayado no backfill). */
  async sweepPresence(nowMs: number, options: SweepOptions = {}): Promise<SweepSummary> {
    const engine = await this.ready();
    return engine.sweepPresence(nowMs, options);
  }

  private async runPresenceSweep(): Promise<void> {
    if (this.sweeping) return;
    this.sweeping = true;
    try {
      const summary = await this.sweepPresence(Date.now());
      if (summary.opened + summary.escalated + summary.resolved > 0 || summary.fleet !== 'none') {
        this.logger.log(
          `Presença: ${summary.silent}/${summary.instrumented} mudos · abertos ${summary.opened} · ` +
            `escalados ${summary.escalated} · resolvidos ${summary.resolved} · frota ${summary.fleet}.`,
        );
      }
    } catch (error) {
      const detail = error instanceof Error ? error.stack ?? error.message : String(error);
      this.logger.error('Falha na varredura de presença.', detail);
    } finally {
      this.sweeping = false;
    }
  }

  get evaluateOnIngest(): boolean {
    return (process.env.ALERTS_EVALUATE_ON_INGEST ?? 'true').trim().toLowerCase() !== 'false';
  }

  /** Regras habilitadas da política ativa (garantidas no banco). */
  async loadRules(): Promise<RuleRecord[]> {
    await this.ready();
    return this.rules;
  }

  /** Chamado pela ingestão após o commit: nunca lança, nunca altera a resposta ao produtor. */
  async afterCycleIngested(cycleId: string): Promise<void> {
    if (!this.evaluateOnIngest) return;
    try {
      const summary = await this.evaluateCycle(cycleId);
      if (summary.outOfOrder > 0) {
        this.logger.warn(
          `Ciclo ${cycleId} é mais antigo que a marca d'água do ponto: avaliação registrada como OUT_OF_ORDER ` +
            `(${summary.outOfOrder} regra(s)); reconcilie com "npm run alerts:backfill".`,
        );
      }
      if (summary.opened + summary.escalated + summary.resolved + summary.resumed > 0) {
        this.logger.log(
          `Ciclo ${cycleId}: alertas abertos ${summary.opened}, escalados ${summary.escalated}, ` +
            `resolvidos ${summary.resolved + summary.resumed}.`,
        );
      }
    } catch (error) {
      const detail = error instanceof Error ? error.stack ?? error.message : String(error);
      this.logger.error(`Falha ao avaliar alertas do ciclo ${cycleId}; a ingestão não foi afetada.`, detail);
    }
  }

  async evaluateCycle(cycleId: string): Promise<EvaluationSummary> {
    const engine = await this.ready();
    return engine.evaluateCycle(cycleId);
  }

  private async ready(): Promise<AlertEngine> {
    if (this.engine) return this.engine;
    this.rules = (await ensureAlertRules(this.prisma)).filter((rule) => rule.enabled);
    this.engine = new AlertEngine(this.prisma, this.rules);
    return this.engine;
  }
}
