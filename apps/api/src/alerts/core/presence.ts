/**
 * Regra de presença — silêncio de telemetria — e o colapso de frota.
 *
 * Ausência de dado não é falha mecânica: é qualidade de dado/conectividade, e a família do
 * alerta diz isso. Dois escopos:
 *  - SENSOR_SILENT: um ponto instrumentado que já reportou e passou `a1Threshold` intervalos
 *    esperados sem aquisição (A2 aos `a2Threshold` intervalos);
 *  - FLEET_SILENT: quando mais que `fleetCollapseFraction` dos pontos instrumentados estão
 *    mudos SEM episódio próprio, é a planta — parada, gateway, fim de dados —, não um sensor.
 *    Vira UM episódio, e os pontos cobertos não abrem alertas próprios. Quem já tinha o seu
 *    SENSOR_SILENT (mudo há dias) fica de fora da conta e preserva o episódio: o sensor que
 *    morreu sozinho continua sendo um caso à parte, mesmo durante a parada.
 *
 * Não se exige simultaneidade: uma planta pode desligar máquina a máquina ao longo de horas,
 * e continua sendo um fato da planta. O que o modelo não sabe, e declara: se a parada foi
 * planejada. Sem calendário de operação, uma parada de domingo e uma falha de gateway são o
 * mesmo fato observável.
 */
import type { AlertLevel } from '@dynamox/domain';

import type { ActiveEpisode, RuleParams } from './types';

export interface PresencePoint {
  monitoringPointId: string;
  sensorId: string | null;
  /** Fim do último ciclo avaliado; pontos que nunca reportaram não entram na varredura. */
  lastSeenAtMs: number;
  /** Episódio SENSOR_SILENT já aberto para o ponto, se houver. */
  active: ActiveEpisode | null;
}

export type PointPresenceDecision =
  | { kind: 'none' }
  | { kind: 'open'; level: AlertLevel; elapsedIntervals: number; silentSinceMs: number }
  | { kind: 'escalate'; toLevel: 'A2'; elapsedIntervals: number }
  | { kind: 'resolve' };

export type FleetPresenceDecision =
  | { kind: 'none' }
  | { kind: 'open'; level: AlertLevel; affectedCount: number; elapsedIntervals: number; silentSinceMs: number }
  | { kind: 'update'; level: AlertLevel; affectedCount: number; elapsedIntervals: number; escalate: boolean }
  | { kind: 'resolve' };

export interface PresenceSweep {
  fleet: FleetPresenceDecision;
  points: Array<{ monitoringPointId: string; decision: PointPresenceDecision }>;
}

function levelFor(rule: RuleParams, elapsedIntervals: number): AlertLevel {
  return rule.a2Threshold !== null && elapsedIntervals >= rule.a2Threshold ? 'A2' : 'A1';
}

export function sweepPresence(
  rule: RuleParams,
  points: readonly PresencePoint[],
  activeFleet: ActiveEpisode | null,
  nowMs: number,
): PresenceSweep {
  const intervalMs = (rule.expectedIntervalSeconds ?? 900) * 1000;
  const elapsedOf = (point: PresencePoint) => (nowMs - point.lastSeenAtMs) / intervalMs;
  const silent = points.filter((point) => elapsedOf(point) > rule.a1Threshold);

  // Quem já tem episódio próprio não conta para o colapso: seis sensores que morreram um a
  // um ao longo do mês não viram "planta muda" quando o sétimo cala — e o sensor mudo há
  // três dias não impede que a parada de hoje seja reconhecida como parada.
  const freshlySilent = silent.filter((point) => point.active === null);
  const stops = freshlySilent.map((point) => point.lastSeenAtMs);
  const collapse =
    rule.fleetCollapseFraction !== null &&
    points.length >= 2 &&
    freshlySilent.length / points.length > rule.fleetCollapseFraction;

  const decisions: PresenceSweep['points'] = [];
  let fleet: FleetPresenceDecision = { kind: 'none' };

  if (collapse) {
    const silentSinceMs = Math.max(...stops);
    const elapsedIntervals = (nowMs - silentSinceMs) / intervalMs;
    const level = levelFor(rule, elapsedIntervals);
    fleet =
      activeFleet === null
        ? { kind: 'open', level, affectedCount: freshlySilent.length, elapsedIntervals, silentSinceMs }
        : {
            kind: 'update',
            level,
            affectedCount: freshlySilent.length,
            elapsedIntervals,
            escalate: activeFleet.level === 'A1' && level === 'A2',
          };
  } else if (activeFleet !== null) {
    fleet = { kind: 'resolve' };
  }

  for (const point of points) {
    const elapsedIntervals = elapsedOf(point);
    const isSilent = elapsedIntervals > rule.a1Threshold;
    if (!isSilent) {
      decisions.push({
        monitoringPointId: point.monitoringPointId,
        decision: point.active ? { kind: 'resolve' } : { kind: 'none' },
      });
      continue;
    }
    if (point.active === null) {
      // Coberto pelo episódio de frota: não abre alerta próprio.
      decisions.push({
        monitoringPointId: point.monitoringPointId,
        decision: collapse
          ? { kind: 'none' }
          : {
              kind: 'open',
              level: levelFor(rule, elapsedIntervals),
              elapsedIntervals,
              silentSinceMs: point.lastSeenAtMs,
            },
      });
      continue;
    }
    const level = levelFor(rule, elapsedIntervals);
    decisions.push({
      monitoringPointId: point.monitoringPointId,
      decision:
        point.active.level === 'A1' && level === 'A2'
          ? { kind: 'escalate', toLevel: 'A2', elapsedIntervals }
          : { kind: 'none' },
    });
  }

  return { fleet, points: decisions };
}
