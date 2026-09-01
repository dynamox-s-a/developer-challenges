import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { DEFAULT_CONDITION_POLICY } from '@dynamox/domain';
import { EmptyState } from '@dynamox/ui';

import type { DashboardView } from '../../features/dashboard/dashboardAggregations';
import { formatNumber } from '../../features/dashboard/dashboardFormatters';
import { severityColor } from './ActivityHeatmap';
import { DashboardCard } from './DashboardCard';
import { axisTickStyle, chartGridStroke, chartTooltipStyles } from './chartTheme';
import { FleetConditionStrip } from './FleetConditionStrip';

const { observationRatio, attentionRatio } = DEFAULT_CONDITION_POLICY;

/** Nome curto da máquina para o eixo X (antes do primeiro separador). */
function shortName(name: string): string {
  return name.split(' — ')[0].trim();
}

/**
 * Desvio por ativo — o ponto mais desviado de cada máquina, contra a baseline da condição.
 *
 * A versão anterior empilhava a CONTAGEM de condições por máquina: com dois pontos por
 * máquina a proporção só pode ser 0/50/100% — um gráfico ternário por construção, que numa
 * frota sadia vira seis barras idênticas. A magnitude responde o que o operador pergunta
 * de verdade: QUÃO PERTO do limiar cada ativo opera — 1,06× e 1,49× são ambos "normais",
 * mas não são a mesma coisa. As linhas tracejadas são as faixas da política, a mesma
 * régua do mapa de severidade.
 */
export function AssetConditionColumns({
  view,
  loading,
}: {
  view: DashboardView;
  loading: boolean;
}): JSX.Element {
  const muiTheme = useTheme();
  const tooltip = chartTooltipStyles(muiTheme);

  const data = view.rows
    .filter((row) => row.cells.length > 0)
    .map((row) => {
      let worst: { ratio: number; position: string; sensor: string | null } | null = null;
      for (const cell of row.cells) {
        const ratio = cell.assessment?.deviationRatio ?? null;
        if (ratio !== null && (worst === null || ratio > worst.ratio)) {
          worst = { ratio, position: cell.positionLabel, sensor: cell.sensorSerial };
        }
      }
      return {
        name: shortName(row.machine.name),
        ratio: worst?.ratio ?? null,
        position: worst?.position ?? null,
        sensor: worst?.sensor ?? null,
      };
    });
  const hasRatios = data.some((row) => row.ratio !== null);

  return (
    <DashboardCard
      title="Desvio por ativo"
      titleId="asset-condition-title"
      size="chart"
      subtitle="O ponto mais desviado de cada máquina, contra a baseline da condição — e a frota inteira na faixa acima."
      info="Mesma régua do mapa de severidade: as linhas tracejadas são as faixas da política (1,5× observação, 2× atenção). Barra baixa também informa — diz quão longe do limiar o ativo opera."
    >
      {loading ? <Skeleton variant="rounded" height={180} /> : null}
      {!loading ? <FleetConditionStrip view={view} /> : null}
      {!loading && data.length === 0 ? (
        <EmptyState title="Sem ativos com pontos" description="Cadastre pontos de monitoramento." />
      ) : null}
      {!loading && data.length > 0 && !hasRatios ? (
        <EmptyState
          title="Sem referência comparável na janela"
          description="A condição compara duas aquisições sincronizadas dentro da janela selecionada. Amplie o período para reavaliar."
        />
      ) : null}
      {!loading && hasRatios ? (
        <Box sx={{ width: '100%', flexGrow: 1, minHeight: 132 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <CartesianGrid vertical={false} stroke={chartGridStroke(muiTheme)} />
              <XAxis
                dataKey="name"
                tick={axisTickStyle(muiTheme)}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={data.length > 5 ? -28 : 0}
                height={data.length > 5 ? 44 : 24}
                textAnchor={data.length > 5 ? 'end' : 'middle'}
              />
              <YAxis
                tick={axisTickStyle(muiTheme)}
                tickLine={false}
                axisLine={false}
                width={46}
                domain={[0, (dataMax: number) => Math.max(attentionRatio * 1.15, dataMax * 1.08)]}
                tickFormatter={(value: number) => `${formatNumber(value, 1)}×`}
              />
              <Tooltip
                {...tooltip}
                cursor={{ fill: chartGridStroke(muiTheme) }}
                formatter={(value: number, _name, entry) => {
                  const payload = entry?.payload as { position: string | null; sensor: string | null };
                  return [
                    `${formatNumber(value, 2)}× — ${[payload.position, payload.sensor].filter(Boolean).join(' · ')}`,
                    'Pior desvio',
                  ];
                }}
              />
              <ReferenceLine y={observationRatio} stroke={muiTheme.palette.condition.observation} strokeDasharray="4 3" />
              <ReferenceLine y={attentionRatio} stroke={muiTheme.palette.condition.attention} strokeDasharray="4 3" />
              <Bar dataKey="ratio" isAnimationActive={false} maxBarSize={34}>
                {data.map((row) => (
                  <Cell key={row.name} fill={severityColor(row.ratio, muiTheme.palette)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      ) : null}
    </DashboardCard>
  );
}
