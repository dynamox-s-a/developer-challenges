import type { Axis, PhysicalQuantity } from '@dynamox/domain';

/**
 * Formatação de GRANDEZA (número, unidade, rótulo de métrica).
 *
 * Instantes não moram aqui: toda data/hora do produto passa por `features/time/instant.ts`,
 * que fixa a convenção UTC em um lugar só.
 */

const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 });

export const QUANTITY_LABELS: Record<PhysicalQuantity, string> = {
  acceleration: 'Aceleração',
  velocity: 'Velocidade',
  temperature: 'Temperatura',
  rotationalSpeed: 'Rotação',
};

export function formatNumber(value: number | null, maximumFractionDigits = 3): string {
  if (value === null || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits }).format(value);
}

/**
 * Rótulo de eixo: grandezas de vibração vivem em milésimos de g, então três casas fazem
 * dois valores distintos virarem o mesmo texto. A precisão acompanha a magnitude.
 */
export function formatAxisValue(value: number): string {
  const magnitude = Math.abs(value);
  if (magnitude === 0) return '0';
  if (magnitude < 0.01) return formatNumber(value, 5);
  if (magnitude < 0.1) return formatNumber(value, 4);
  if (magnitude < 1) return formatNumber(value, 3);
  return formatNumber(value, 2);
}

export function formatMeasurement(value: number | null, unit: string | null): string {
  if (value === null) return 'Sem leitura';
  return `${number.format(value)}${unit ? ` ${unit}` : ''}`;
}

export function seriesMetricLabel(quantity: PhysicalQuantity, axis: Axis | null): string {
  return `${QUANTITY_LABELS[quantity]}${axis ? ` · eixo ${axis.toUpperCase()}` : ''}`;
}

/** Percentual com uma casa; `—` quando não há denominador. */
export function formatPercent(part: number, total: number): string {
  if (total === 0) return '—';
  return `${formatNumber((part / total) * 100, 1)}%`;
}
