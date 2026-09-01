import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMemo, type RefObject } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { DEFAULT_CONDITION_POLICY, type SeriesPointsResponseDto, type TimeSeriesSummary } from '@dynamox/domain';
import { EmptyState, ErrorState } from '@dynamox/ui';

import type { DashboardPeriod } from '../../features/dashboard/dashboardSlice';
import {
  formatAxisValue,
  formatMeasurement,
  formatNumber,
  seriesMetricLabel,
} from '../../features/dashboard/dashboardFormatters';
import { bucketToMs, useTimeZoom } from '../../features/dashboard/useTimeZoom';
import { formatChartTick, formatDateTime, formatRange } from '../../features/time/instant';
import type { RequestStatus } from '../../store/requestStatus';
import { DashboardCard } from './DashboardCard';
import { SeriesHierarchyFilters } from './SeriesHierarchyFilters';
import { axisTickStyle, chartGridStroke, chartTooltipStyles, paddedDomain } from './chartTheme';

const ATTENTION_RATIO = DEFAULT_CONDITION_POLICY.attentionRatio;

const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  '24h': '24 horas',
  '7d': '7 dias',
  '30d': '30 dias',
  all: 'todo o histórico',
};

export interface TrendPanelProps {
  period: DashboardPeriod;
  series: TimeSeriesSummary[];
  selectedSeriesId: string | null;
  /** A resposta de `/analytics/series/:id/points`, como o servidor a devolveu. */
  detail: SeriesPointsResponseDto | null;
  status: RequestStatus;
  error: string | null;
  onRetry: () => void;
  onSelectSeries: (seriesId: string) => void;
  /** Muda o período global — usado pelo estado vazio para alcançar o dado existente. */
  onPeriodChange: (period: DashboardPeriod) => void;
  /** Alvo do drill-down: o painel recebe foco quando uma exceção é aberta. */
  headingRef?: RefObject<HTMLHeadingElement>;
}

interface ChartPoint {
  t: number;
  value: number | null;
  band?: [number, number];
}

/**
 * Série temporal — o ÚNICO painel de série da home, tudo do servidor.
 *
 * Cada ponto é um bucket agregado no banco (`/analytics/series/:id/points`): média com a
 * faixa mín–máx sombreada; as estatísticas da janela vêm de `stats`, calculadas na mesma
 * consulta — nada é recontado no cliente. Antes existiam DOIS painéis desta mesma série
 * (este e um "explorador"), com os mesmos filtros e a mesma curva, cada um re-agregando no
 * browser um dado que já chegava agregado; sobrou o painel, morreu a duplicata.
 *
 * Lacunas maiores que dois buckets viram quebra na linha: entre aquisições não existe
 * medição, e ligar a reta inventaria uma curva que ninguém observou. Zoom com a roda do
 * mouse, centrado no cursor; duplo clique volta ao período inteiro.
 */
export function TrendPanel({
  period,
  series,
  selectedSeriesId,
  detail,
  status,
  error,
  onRetry,
  onSelectSeries,
  onPeriodChange,
  headingRef,
}: TrendPanelProps): JSX.Element {
  const muiTheme = useTheme();
  const tooltip = chartTooltipStyles(muiTheme);
  const selected = series.find((item) => item.id === selectedSeriesId) ?? null;
  const stats = detail?.stats ?? null;

  const points = useMemo<ChartPoint[]>(() => {
    if (!detail) return [];
    const gapMs = bucketToMs(detail.bucket) * 2;
    const rows: ChartPoint[] = [];
    let previous: number | null = null;
    for (const bucket of detail.points) {
      if (bucket.avg === null) continue;
      const t = Date.parse(bucket.bucketStart);
      if (previous !== null && t - previous > gapMs) {
        // Quebra explícita: silêncio não vira reta.
        rows.push({ t: previous + 1, value: null });
      }
      rows.push({
        t,
        value: bucket.avg,
        band: bucket.min !== null && bucket.max !== null ? [bucket.min, bucket.max] : undefined,
      });
      previous = t;
    }
    return rows;
  }, [detail]);

  const measured = useMemo(() => points.filter((point) => point.value !== null), [points]);
  const extent = useMemo<[number, number] | null>(
    () => (measured.length > 1 ? [measured[0].t, measured[measured.length - 1].t] : null),
    [measured],
  );
  const zoom = useTimeZoom(extent, detail ? bucketToMs(detail.bucket) * 3 : 3_600_000);
  const visible = useMemo(
    () => (zoom.zoomed && zoom.domain ? points.filter((point) => point.t >= zoom.domain![0] && point.t <= zoom.domain![1]) : points),
    [points, zoom.zoomed, zoom.domain],
  );
  const yDomain = useMemo(
    () =>
      paddedDomain(
        visible.flatMap((point) => [point.value, ...(point.band ?? [])]).filter((value): value is number => value !== null),
      ),
    [visible],
  );

  // Referências da janela, ambas do servidor: a média de `stats` e o limiar didático sobre ela.
  const average = stats?.avg ?? null;

  return (
    <DashboardCard
      title={`Série temporal — ${PERIOD_LABELS[period]}`}
      titleId="trend-title"
      size="primaryChart"
      subtitle={
        selected
          ? `${selected.machineName ?? 'Máquina não associada'} · ${selected.monitoringPointName ?? 'Sem ponto'} · ${selected.sensorSerialNumber} · ${seriesMetricLabel(selected.physicalQuantity, selected.axis)} — um ponto por bucket de ${detail?.bucket ?? '—'}, agregado no banco`
          : 'Selecione um item na prioridade de inspeção ou na matriz da frota.'
      }
      info="Tudo desta seção vem de /analytics/series/:id/points: a curva (média por bucket com faixa mín–máx) e as estatísticas da janela, calculadas no banco. Nenhuma amostra bruta é transportada nem reagregada no navegador. Scroll aproxima; duplo clique volta ao período."
      action={
        zoom.zoomed && zoom.domain ? (
          <Button size="small" variant="text" onClick={zoom.reset}>
            Ver período todo
          </Button>
        ) : undefined
      }
    >
      {series.length > 0 ? (
        <Box sx={{ mb: 1.25 }}>
          <SeriesHierarchyFilters
            series={series}
            selectedSeriesId={selectedSeriesId}
            onSelect={onSelectSeries}
            compact
          />
        </Box>
      ) : null}

      {/* Alvo de foco do drill-down; invisível, não altera o layout. */}
      <Typography
        component="h3"
        ref={headingRef}
        tabIndex={-1}
        sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', m: 0 }}
      >
        {selected ? `Investigação — ${selected.sensorSerialNumber}` : 'Investigação'}
      </Typography>

      {series.length === 0 && status !== 'loading' ? (
        <EmptyState
          title="Nenhuma série persistida"
          description="Sensores instalados aparecerão aqui após a primeira ingestão de telemetria."
        />
      ) : null}

      {series.length > 0 && (status === 'loading' || status === 'idle') ? (
        <Skeleton variant="rounded" height={300} aria-label="Carregando série" />
      ) : null}

      {status === 'failed' ? (
        <ErrorState
          title="Não foi possível carregar a série"
          message={error ?? 'A série selecionada não respondeu.'}
          onRetry={onRetry}
        />
      ) : null}

      {status === 'succeeded' && measured.length === 0 ? (
        <EmptyState
          title={`Sem dados em ${PERIOD_LABELS[period]}`}
          description="Nenhum bucket com medição nesta janela. Nenhum ponto é simulado para preencher a lacuna."
          action={
            period !== 'all' ? (
              <Button size="small" variant="outlined" onClick={() => onPeriodChange('all')}>
                Ver período disponível
              </Button>
            ) : undefined
          }
        />
      ) : null}

      {status === 'succeeded' && measured.length > 0 && selected && stats ? (
        <>
          {/* Estatísticas da janela — as do servidor, da mesma consulta que desenha a curva. */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
              gap: 1,
              mb: 1,
            }}
          >
            {[
              ['Amostras', formatNumber(stats.sampleCount, 0), undefined],
              ['Aquisições', formatNumber(stats.acquisitionCount, 0), undefined],
              ['Mínimo', formatNumber(stats.min, 4), undefined],
              ['Máximo', formatNumber(stats.max, 4), undefined],
              ['Média', formatNumber(stats.avg, 4), undefined],
              ['Último', formatNumber(detail?.points.at(-1)?.avg ?? null, 4), stats.lastAt ? formatDateTime(stats.lastAt) : undefined],
            ].map(([label, value, hint]) => (
              <Box key={label} sx={{ border: 1, borderColor: 'divider', borderRadius: 1.5, px: 1.25, py: 0.75, minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" component="div" noWrap>
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={750} noWrap>
                  {value}
                </Typography>
                {hint ? (
                  <Typography variant="caption" color="text.secondary" component="div" noWrap>
                    {hint}
                  </Typography>
                ) : null}
              </Box>
            ))}
          </Box>

          <Stack direction="row" flexWrap="wrap" useFlexGap gap={1.5} alignItems="center" sx={{ mb: 0.75 }}>
            {[
              {
                label: `${seriesMetricLabel(selected.physicalQuantity, selected.axis)} (média do bucket)`,
                color: muiTheme.palette.primary.main,
                dashed: false,
              },
              average !== null
                ? {
                    label: `Média da janela: ${formatMeasurement(average, selected.unit)}`,
                    color: muiTheme.palette.condition.observation,
                    dashed: true,
                  }
                : null,
              average !== null
                ? {
                    label: `Limiar didático ${ATTENTION_RATIO}×: ${formatMeasurement(average * ATTENTION_RATIO, selected.unit)}`,
                    color: muiTheme.palette.condition.attention,
                    dashed: true,
                  }
                : null,
            ]
              .flatMap((entry) => (entry ? [entry] : []))
              .map((entry) => (
                <Stack key={entry.label} direction="row" alignItems="center" spacing={0.6}>
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 16,
                      height: 0,
                      borderTop: entry.dashed ? '2px dashed' : '2px solid',
                      borderColor: entry.color,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {entry.label}
                  </Typography>
                </Stack>
              ))}
            {zoom.zoomed && zoom.domain ? (
              <Chip
                size="small"
                variant="outlined"
                label={`Zoom: ${formatRange(zoom.domain[0], zoom.domain[1])}`}
                onDelete={zoom.reset}
              />
            ) : null}
          </Stack>

          <Box
            ref={zoom.ref}
            role="img"
            aria-label={`Gráfico de ${seriesMetricLabel(selected.physicalQuantity, selected.axis)} em ${selected.unit}. Use a roda do mouse para aproximar; duplo clique volta ao período.`}
            sx={{ width: '100%', flexGrow: 1, minHeight: { xs: 200, md: 240 }, minWidth: 0 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={visible} margin={{ top: 8, right: 10, bottom: 0, left: -4 }} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke(muiTheme)} />
                <XAxis
                  dataKey="t"
                  type="number"
                  scale="time"
                  domain={zoom.zoomed && zoom.domain ? zoom.domain : ['dataMin', 'dataMax']}
                  allowDataOverflow
                  tickFormatter={formatChartTick}
                  tick={axisTickStyle(muiTheme)}
                  tickLine={false}
                  minTickGap={28}
                />
                <YAxis
                  tick={axisTickStyle(muiTheme)}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  domain={yDomain}
                  tickFormatter={formatAxisValue}
                />
                <Tooltip
                  {...tooltip}
                  labelFormatter={(label) => formatDateTime(Number(label))}
                  formatter={(value, name) => [
                    `${formatNumber(Number(value), 4)} ${selected.unit}`,
                    name === 'band' ? 'Mín–máx do bucket' : 'Média do bucket',
                  ]}
                />
                {average !== null ? (
                  <ReferenceLine y={average} stroke={muiTheme.palette.condition.observation} strokeDasharray="5 4" />
                ) : null}
                {average !== null ? (
                  <ReferenceLine
                    y={average * ATTENTION_RATIO}
                    stroke={muiTheme.palette.condition.attention}
                    strokeDasharray="5 4"
                  />
                ) : null}
                <Area
                  dataKey="band"
                  name="band"
                  stroke="none"
                  fill={muiTheme.palette.primary.main}
                  fillOpacity={0.12}
                  connectNulls={false}
                  isAnimationActive={false}
                  activeDot={false}
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="value"
                  stroke={muiTheme.palette.primary.main}
                  strokeWidth={2}
                  dot={measured.length < 40 ? { r: 3 } : false}
                  activeDot={{ r: 4 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.4 }}>
            {stats.firstAt && stats.lastAt ? `Cobertura: ${formatRange(stats.firstAt, stats.lastAt)} · ` : ''}
            {formatNumber(stats.sampleCount, 0)} amostras agregadas em {measured.length} bucket(s) no banco — nenhuma
            transportada ao navegador. Lacunas ficam sem reta. Scroll aproxima; duplo clique volta.
          </Typography>
        </>
      ) : null}
    </DashboardCard>
  );
}
