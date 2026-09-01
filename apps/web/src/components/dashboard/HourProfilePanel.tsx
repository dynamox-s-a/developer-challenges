import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
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

import { DEFAULT_CONDITION_POLICY, type HeatmapResponseDto } from '@dynamox/domain';
import { EmptyState } from '@dynamox/ui';

import { formatMeasurement, formatNumber } from '../../features/dashboard/dashboardFormatters';
import { formatDayKey } from '../../features/time/instant';
import { severityColor } from './ActivityHeatmap';
import { DashboardCard } from './DashboardCard';
import { axisTickStyle, chartGridStroke, chartTooltipStyles } from './chartTheme';

/**
 * Severidade hora a hora do dia escolhido — o detalhe (mestre/detalhe) do mapa de severidade.
 *
 * A versão anterior plotava "% de sensores com leitura por hora", que numa frota de cadência
 * fixa (12 sensores a cada 15 min) é uma régua binária: 100% em operação, 0% em parada — o
 * dado está certo, o gráfico é que não tinha o que dizer. As barras agora usam a MESMA
 * métrica do mapa — o pior desvio da frota contra a baseline aprendida do ponto —, então uma
 * rampa aparece como degraus subindo ao longo do dia e um transiente como uma barra alta
 * isolada. Consome os mesmos buckets agregados: trocar de dia não dispara consulta nova, e
 * clicar numa barra abre a janela correspondente na investigação.
 */
export interface HourProfilePanelProps {
  data: HeatmapResponseDto | null;
  loading: boolean;
  /** Dia (YYYY-MM-DD) exibido; sem escolha, o mais recente com atividade. */
  selectedDay: string | null;
  onSelectDay: (day: string) => void;
  onSelectWindow: (bucketStart: string) => void;
}

const { observationRatio, attentionRatio } = DEFAULT_CONDITION_POLICY;

export function HourProfilePanel({
  data,
  loading,
  selectedDay,
  onSelectDay,
  onSelectWindow,
}: HourProfilePanelProps): JSX.Element {
  const muiTheme = useTheme();
  const tooltip = chartTooltipStyles(muiTheme);

  const days = [...new Set((data?.buckets ?? []).map((bucket) => bucket.day))].sort().reverse();
  const day = selectedDay && days.includes(selectedDay) ? selectedDay : (days[0] ?? null);
  const byHour = new Map(
    (data?.buckets ?? []).filter((bucket) => bucket.day === day).map((bucket) => [bucket.hour, bucket]),
  );

  const chart = Array.from({ length: 24 }, (_, hour) => {
    const bucket = byHour.get(hour);
    return {
      label: String(hour).padStart(2, '0'),
      ratio: bucket?.maxDeviationRatio ?? null,
      value: bucket?.maxDeviationValue ?? null,
      sensor: bucket?.maxDeviationSensor ?? null,
      bucketStart: bucket?.bucketStart ?? null,
    };
  });
  const hasData = chart.some((entry) => entry.ratio !== null);
  const worst = chart.reduce<(typeof chart)[number] | null>(
    (max, entry) => (entry.ratio !== null && (max === null || entry.ratio > (max.ratio ?? 0)) ? entry : max),
    null,
  );

  return (
    <DashboardCard
      title="Severidade do dia (24 h)"
      titleId="hour-profile-title"
      size="chart"
      subtitle="Pior desvio da frota em cada hora do dia selecionado — o corte horário do mapa."
      info="Mesmos buckets do mapa de severidade: trocar de dia não faz nova consulta. As linhas tracejadas são as faixas da política (observação e atenção); hora sem aquisição, ou sem baseline estabelecida, fica sem barra."
      action={
        days.length > 0 ? (
          <ToggleButtonGroup
            exclusive
            size="small"
            value={day}
            onChange={(_event, next: string | null) => {
              if (next) onSelectDay(next);
            }}
            sx={{ '& .MuiToggleButton-root': { flex: 1, px: 0.5, py: 0.35, minHeight: 26, fontSize: 10.5 } }}
          >
            {days.slice(0, 4).map((value) => (
              <ToggleButton key={value} value={value} aria-label={formatDayKey(value)}>
                {formatDayKey(value)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        ) : undefined
      }
    >
      {loading ? <Skeleton variant="rounded" height={150} /> : null}

      {!loading && !hasData ? (
        <EmptyState
          title="Sem desvio calculável neste dia"
          description="Escolha outro dia no seletor, ou aguarde as baselines serem estabelecidas."
        />
      ) : null}

      {!loading && hasData ? (
        <>
          <Box
            role="img"
            aria-label={
              worst && day
                ? `Severidade por hora de ${formatDayKey(day)} — pior às ${worst.label}h: ${formatNumber(worst.ratio, 2)}× em ${worst.sensor ?? '—'}`
                : undefined
            }
            sx={{ width: '100%', flexGrow: 1, minHeight: 118 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <CartesianGrid vertical={false} stroke={chartGridStroke(muiTheme)} />
                <XAxis
                  dataKey="label"
                  tick={axisTickStyle(muiTheme)}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
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
                    const payload = entry?.payload as { value: number | null; sensor: string | null };
                    return [
                      `${formatNumber(value, 2)}× (${formatMeasurement(payload.value, 'g')}) em ${payload.sensor ?? '—'}`,
                      'Pior desvio',
                    ];
                  }}
                  labelFormatter={(label) => `${label}h — clique para investigar`}
                />
                {/* As faixas da política, para a barra ser lida contra o que dispara alerta. */}
                <ReferenceLine y={observationRatio} stroke={muiTheme.palette.condition.observation} strokeDasharray="4 3" />
                <ReferenceLine y={attentionRatio} stroke={muiTheme.palette.condition.attention} strokeDasharray="4 3" />
                <Bar
                  dataKey="ratio"
                  isAnimationActive={false}
                  maxBarSize={16}
                  cursor="pointer"
                  onClick={(entry: { bucketStart: string | null }) => {
                    if (entry.bucketStart) onSelectWindow(entry.bucketStart);
                  }}
                >
                  {chart.map((entry) => (
                    <Cell key={entry.label} fill={severityColor(entry.ratio, muiTheme.palette)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          {worst ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              • Pior hora do dia: {worst.label}h — {formatNumber(worst.ratio, 2)}× em {worst.sensor ?? '—'}.
            </Typography>
          ) : null}
        </>
      ) : null}
    </DashboardCard>
  );
}
