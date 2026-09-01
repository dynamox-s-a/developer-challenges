import type { Theme } from '@mui/material/styles';
import type { CSSProperties } from 'react';

/**
 * Configuração comum dos gráficos Recharts, derivada do theme. Todos os gráficos do
 * dashboard usam os mesmos ticks, a mesma grade e o mesmo tooltip branco — em vez de
 * cada painel redecidir tipografia e cor.
 */

export function axisTickStyle(theme: Theme): { fontSize: number; fill: string } {
  return {
    fontSize: theme.dashboard.chart.tickFontSize,
    fill: theme.dashboard.chart.axisColor,
  };
}

export function chartGridStroke(theme: Theme): string {
  return theme.dashboard.chart.gridColor;
}

/** Estilos do tooltip Recharts (contentStyle/labelStyle/itemStyle) — nunca o preto padrão. */
export function chartTooltipStyles(theme: Theme): {
  contentStyle: CSSProperties;
  labelStyle: CSSProperties;
  itemStyle: CSSProperties;
} {
  const tokens = theme.dashboard.chart.tooltip;
  return {
    contentStyle: {
      background: tokens.background,
      border: `1px solid ${tokens.border}`,
      borderRadius: tokens.radius,
      boxShadow: tokens.shadow,
      fontSize: tokens.fontSize,
      padding: '8px 10px',
    },
    labelStyle: {
      color: theme.palette.text.primary,
      fontWeight: 600,
      fontSize: tokens.fontSize,
      marginBottom: 4,
    },
    itemStyle: {
      color: theme.palette.text.secondary,
      fontSize: tokens.fontSize,
      padding: 0,
    },
  };
}

/**
 * Domínio vertical de uma série de valores pequenos e positivos.
 *
 * Dois erros opostos escondem a verdade num gráfico de vibração:
 *
 *  - **Ancorar em zero** achata tudo: a variação operacional vive em milésimos de g, e uma
 *    escala 0→máximo transforma uma degradação real numa linha reta.
 *  - **Colar em dataMin/dataMax** faz o contrário: ruído de meio por cento passa a ocupar a
 *    altura inteira do card, e um ativo perfeitamente normal parece estar oscilando.
 *
 * A regra aqui é uma faixa MÍNIMA proporcional ao próprio nível do sinal: quando a variação
 * real é menor que `minimumSpanRatio` do valor médio, o eixo abre até essa faixa e a curva
 * volta a parecer o que é — plana. Acima disso, quem manda são os dados.
 */
export function paddedDomain(
  values: readonly number[],
  { minimumSpanRatio = 0.1, padRatio = 0.12 }: { minimumSpanRatio?: number; padRatio?: number } = {},
): [number, number] | undefined {
  const finite = values.filter((value) => Number.isFinite(value));
  if (finite.length === 0) return undefined;

  const low = Math.min(...finite);
  const high = Math.max(...finite);
  const center = (low + high) / 2;
  const half = Math.max((high - low) / 2, Math.abs(center) * (minimumSpanRatio / 2));
  const pad = half * padRatio;
  // Grandezas de vibração não são negativas: o piso nunca desce abaixo de zero.
  return [Math.max(0, center - half - pad), center + half + pad];
}
