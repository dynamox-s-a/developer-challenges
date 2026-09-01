/**
 * Vocabulário de ALERTA na interface. O tipo descreve a REGRA que disparou — nunca um
 * diagnóstico: "vibração acima da baseline" é o que o motor sabe; "rolamento" seria
 * inventar causa.
 *
 * O mesmo vale para os alertas de telemetria: o sistema detecta AUSÊNCIA de dado. A causa
 * pode ser sensor, gateway, rede, energia, máquina parada ou manutenção — por isso o rótulo
 * é "sem telemetria", nunca "sensor com defeito" nem "parada".
 */
import type {
  AlertEventType,
  AlertLevel,
  AlertOccurrenceDto,
  AlertResolutionReason,
  AlertStatus,
  AlertThresholdMode,
  AlertType,
} from '@dynamox/domain';

import { formatNumber } from '../dashboard/dashboardFormatters';

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  'vibration-threshold': 'Vibração acima da baseline',
  'temperature-threshold': 'Temperatura acima da baseline',
  'sensor-silent': 'Ponto sem telemetria',
  'fleet-silent': 'Perda ampla de telemetria',
};

export const ALERT_TYPE_SHORT: Record<AlertType, string> = {
  'vibration-threshold': 'Vibração',
  'temperature-threshold': 'Temperatura',
  'sensor-silent': 'Sem telemetria',
  'fleet-silent': 'Frota sem telemetria',
};

/** O que o alerta afirma — e, no caso da telemetria, o que ele explicitamente NÃO afirma. */
export const ALERT_TYPE_HELP: Record<AlertType, string> = {
  'vibration-threshold':
    'O RMS radial (Y/Z) ficou acima da baseline aprendida deste ponto por leituras consecutivas. Descreve a regra que disparou, não a causa mecânica.',
  'temperature-threshold':
    'A temperatura ficou acima da baseline térmica aprendida deste ponto por leituras consecutivas. Descreve a regra, não a causa.',
  'sensor-silent':
    'O ponto deixou de reportar dentro da cadência esperada. O sistema detecta ausência de dado — a causa pode ser sensor, gateway, rede, energia, máquina parada ou manutenção.',
  'fleet-silent':
    'Mais da metade dos pontos monitorados deixou de reportar dentro da cadência esperada. É perda ampla de telemetria: o sistema não distingue parada planejada, trip, falha de gateway ou fim de dados.',
};

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  open: 'Aberto',
  acknowledged: 'Reconhecido',
  resolved: 'Resolvido',
};

export const ALERT_LEVEL_LABELS: Record<AlertLevel, string> = {
  A1: 'A1 · alerta',
  A2: 'A2 · crítico',
};

export const ALERT_EVENT_LABELS: Record<AlertEventType, string> = {
  opened: 'Aberto',
  escalated: 'Escalado',
  acknowledged: 'Reconhecido',
  resolved: 'Resolvido',
};

export const ALERT_RESOLUTION_LABELS: Record<AlertResolutionReason, string> = {
  'condition-cleared': 'condição normalizou',
  'telemetry-resumed': 'telemetria voltou',
};

export const ALERT_FAMILY_LABELS = {
  condition: 'Condição',
  'data-quality': 'Qualidade do dado',
} as const;

/**
 * Duração legível a partir de segundos. A regra de presença conta em "intervalos esperados"
 * — correto para o motor, ilegível numa tabela: 5.736,7 intervalos é "59 d 18 h".
 */
export function formatDuration(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return '—';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  if (hours < 48) return restMinutes === 0 ? `${hours} h` : `${hours} h ${restMinutes} min`;
  const days = Math.floor(hours / 24);
  const restHours = hours % 24;
  return restHours === 0 ? `${days} d` : `${days} d ${restHours} h`;
}

/** Medida comparada ao limiar, na unidade que faz sentido para o modo da regra. */
export function formatMeasure(measure: number | null, mode: AlertThresholdMode): string {
  if (measure === null || !Number.isFinite(measure)) return '—';
  switch (mode) {
    case 'ratio-to-baseline':
      return `${formatNumber(measure, 2)}×`;
    case 'delta-from-baseline':
      return `${measure >= 0 ? '+' : '−'}${formatNumber(Math.abs(measure), 1)} °C`;
    case 'elapsed-intervals':
      return `${formatNumber(measure, 1)} intervalos`;
    default:
      return formatNumber(measure, 2);
  }
}

/**
 * A magnitude que a pessoa lê na lista e no cabeçalho: razão, delta ou — para presença —
 * o tempo sem dado, que é a grandeza que importa (`value` já vem em segundos).
 */
export function formatMagnitude(
  reading: { value: number | null; measure: number | null },
  mode: AlertThresholdMode,
): string {
  return mode === 'elapsed-intervals' ? formatDuration(reading.value) : formatMeasure(reading.measure, mode);
}

export function formatThreshold(threshold: number | null, mode: AlertThresholdMode): string {
  return formatMeasure(threshold, mode);
}

/** Como o limiar é lido: "≥ 1,5× da baseline", "≥ +5 °C sobre a baseline", "> 4 intervalos de 15 min". */
export function describeThresholdMode(mode: AlertThresholdMode): string {
  switch (mode) {
    case 'ratio-to-baseline':
      return 'razão entre a leitura e a baseline aprendida do ponto';
    case 'delta-from-baseline':
      return 'diferença entre a leitura e a baseline aprendida do ponto';
    case 'elapsed-intervals':
      return 'intervalos esperados de aquisição decorridos sem dado';
    default:
      return mode;
  }
}

/** Identidade curta de um episódio: máquina · ponto · sensor, ou "planta" no escopo de frota. */
export function alertIdentity(alert: Pick<AlertOccurrenceDto, 'scope' | 'machineName' | 'monitoringPointName' | 'sensorSerialNumber' | 'affectedCount'>): string {
  if (alert.scope === 'fleet') {
    return alert.affectedCount ? `Frota · ${alert.affectedCount} pontos` : 'Frota';
  }
  return [alert.machineName, alert.monitoringPointName, alert.sensorSerialNumber].filter(Boolean).join(' · ') || '—';
}

/** Frase única de "o que está acontecendo", para lista e detalhe. */
export function alertSummary(alert: AlertOccurrenceDto): string {
  const last = formatMeasure(alert.last.measure, alert.thresholdMode);
  switch (alert.type) {
    case 'vibration-threshold':
      return `RMS radial em ${last} da baseline (limiar ${formatThreshold(alert.trigger.threshold, alert.thresholdMode)})`;
    case 'temperature-threshold':
      return `temperatura ${last} sobre a baseline (limiar ${formatThreshold(alert.trigger.threshold, alert.thresholdMode)})`;
    case 'sensor-silent':
      return `sem aquisição há ${formatDuration(alert.last.value)}`;
    case 'fleet-silent':
      return `${alert.affectedCount ?? 0} pontos sem aquisição há ${formatDuration(alert.last.value)}`;
    default:
      return last;
  }
}
