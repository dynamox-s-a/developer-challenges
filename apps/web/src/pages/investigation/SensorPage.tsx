import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useCallback } from 'react';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { DEFAULT_CONDITION_POLICY, machineTag } from '@dynamox/domain';
import { EmptyState, ErrorState } from '@dynamox/ui';

import { api } from '../../api/client';
import { PageHeader } from '../../components/PageHeader';
import { KpiStrip } from '../../components/investigation/KpiStrip';
import { AlertsSection } from '../../components/alerts/AlertsSection';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { ConditionTag } from '../../components/condition/ConditionTag';
import {
  axisTickStyle,
  chartGridStroke,
  chartTooltipStyles,
  paddedDomain,
} from '../../components/dashboard/chartTheme';
import {
  formatAxisValue,
  formatMeasurement,
  formatNumber,
  seriesMetricLabel,
} from '../../features/dashboard/dashboardFormatters';
import {
  TIME_ZONE_LABEL,
  formatChartTick,
  formatDateTime,
  formatRange,
} from '../../features/time/instant';
import { bucketToMs, useTimeZoom } from '../../features/dashboard/useTimeZoom';
import { links } from '../../features/investigation/links';
import { useAnalyticsQuery, useTimeRange } from '../../features/investigation/useAnalyticsQuery';

const RANGE_PRESETS = [
  { id: '24h', label: '24 h', days: 1, bucket: '15m' },
  { id: '7d', label: '7 dias', days: 7, bucket: '1h' },
  { id: '30d', label: '30 dias', days: 30, bucket: '4h' },
] as const;

/**
 * NÍVEL "SENSOR": trinta dias de história sem baixar um único dado bruto.
 *
 * O gráfico consome buckets agregados no banco (≈175 pontos para 30 dias, contra ~170 mil
 * amostras) e a lista de aquisições é paginada no servidor. Amostra crua só no nível
 * seguinte, e sob pedido explícito.
 */
export function SensorPage(): JSX.Element {
  const { serialNumber = '' } = useParams();
  const [search, setSearch] = useSearchParams();
  const range = useTimeRange();
  const muiTheme = useTheme();
  const tooltip = chartTooltipStyles(muiTheme);

  const bucket = search.get('bucket') ?? '1h';
  const page = Number(search.get('page') ?? '1');
  const pageSize = Number(search.get('pageSize') ?? '25');

  const setParams = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(search);
      for (const [key, value] of Object.entries(patch)) next.set(key, value);
      setSearch(next);
    },
    [search, setSearch],
  );

  // A condição da frota traz identidade, baseline e razão do sensor sem consulta extra.
  const condition = useAnalyticsQuery(
    () => api.fleetCondition({ from: range.from, to: range.to }),
    [range.from, range.to],
  );
  const point = condition.data?.points.find((item) => item.sensorSerialNumber === serialNumber) ?? null;

  // A série âncora do sensor vem da listagem de séries (uma requisição pequena).
  const series = useAnalyticsQuery(() => api.timeSeries(), []);
  const sensorSeries = (series.data ?? []).filter(
    (item) => item.sensorSerialNumber === serialNumber,
  );
  const anchor =
    sensorSeries.find(
      (item) => item.physicalQuantity === 'acceleration' && item.axis === 'y',
    ) ?? null;

  const points = useAnalyticsQuery(
    () =>
      anchor
        ? api.seriesPoints(anchor.id, { from: range.from, to: range.to }, bucket)
        : Promise.resolve(null),
    [anchor?.id, range.from, range.to, bucket],
  );

  const acquisitions = useAnalyticsQuery(
    () =>
      api.sensorAcquisitions(serialNumber, { from: range.from, to: range.to }, {
        page,
        pageSize,
        includeTotal: true,
      }),
    [serialNumber, range.from, range.to, page, pageSize],
  );

  const chartData = (points.data?.points ?? []).map((item) => ({
    t: Date.parse(item.bucketStart),
    avg: item.avg,
    band: item.min !== null && item.max !== null ? [item.min, item.max] : undefined,
  }));

  // Zoom com a roda do mouse sobre os buckets carregados; duplo clique volta ao período.
  const zoomExtent: [number, number] | null =
    chartData.length > 1 ? [chartData[0].t, chartData[chartData.length - 1].t] : null;
  const zoom = useTimeZoom(zoomExtent, bucketToMs(bucket) * 3);
  const visibleData =
    zoom.zoomed && zoom.domain
      ? chartData.filter((item) => item.t >= zoom.domain![0] && item.t <= zoom.domain![1])
      : chartData;

  // Domínio com faixa mínima proporcional: nem zero achatando a curva, nem ruído de meio
  // por cento ocupando o card inteiro. Ver `paddedDomain`.
  const yDomain = paddedDomain(
    visibleData
      .flatMap((item) => [item.avg, ...(item.band ?? [])])
      .filter((value): value is number => value !== null && value !== undefined),
  );

  const applyPreset = (preset: (typeof RANGE_PRESETS)[number]) => {
    const to = new Date().toISOString();
    const from = new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000).toISOString();
    setSearch(new URLSearchParams({ from, to, bucket: preset.bucket, page: '1', pageSize: String(pageSize) }));
  };

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader
        steps={[
          { label: 'Visão geral', to: '/' },
          // Máquina e ponto só entram quando a condição já os identificou: um degrau da
          // trilha nunca pode apontar para uma rota que ainda não sabemos montar.
          ...(point?.machineName
            ? [{ label: machineTag(point.machineName), to: links.machine(point.machineName, range) }]
            : []),
          ...(point?.machineName && point.monitoringPointName
            ? [
                {
                  label: point.monitoringPointName,
                  to: links.point(point.machineName, point.monitoringPointName, range),
                },
              ]
            : []),
          { label: serialNumber },
        ]}
        title={serialNumber}
        subtitle={
          point
            ? `${point.machineName} · ${point.monitoringPointName} · ${point.sensorModel ?? '—'}`
            : 'Sensor da planta sintética.'
        }
        chips={
          <>
            {point ? <ConditionTag kind={point.condition} /> : null}
            <Chip size="small" variant="outlined" label={formatRange(range.from, range.to)} />
            <Chip size="small" variant="outlined" label={TIME_ZONE_LABEL} />
            <Chip size="small" variant="outlined" label={`Bucket: ${bucket}`} />
          </>
        }
        actions={
          <ToggleButtonGroup exclusive size="small" value={bucket} aria-label="Período consultado">
            {RANGE_PRESETS.map((preset) => (
              <ToggleButton
                key={preset.id}
                value={preset.bucket}
                aria-label={preset.label}
                onClick={() => applyPreset(preset)}
                sx={{ px: 1.75 }}
              >
                {preset.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
      />

      <KpiStrip
        items={[
          {
            label: 'Desvio radial (Y/Z)',
            value: point?.deviationRatio == null ? '—' : `${formatNumber(point.deviationRatio, 2)}×`,
            hint:
              point?.baselineValue == null
                ? 'sem referência na janela'
                : `referência ${formatMeasurement(point.baselineValue, 'g')}`,
            tone:
              (point?.deviationRatio ?? 0) >= DEFAULT_CONDITION_POLICY.attentionRatio
                ? 'warning'
                : 'default',
          },
          {
            label: 'Aquisições',
            value: formatNumber(points.data?.stats.acquisitionCount ?? 0, 0),
            hint: 'ciclos de 60 s na janela',
          },
          {
            label: 'Amostras agregadas',
            value: formatNumber(points.data?.stats.sampleCount ?? 0, 0),
            hint: 'nenhuma transportada ao navegador',
          },
          {
            label: 'Faixa do eixo Y',
            value:
              points.data?.stats.min == null || points.data?.stats.max == null
                ? '—'
                : `${formatNumber(points.data.stats.min, 3)} – ${formatNumber(points.data.stats.max, 3)}`,
            hint: 'g',
          },
          {
            label: 'Média do eixo Y',
            value: points.data?.stats.avg == null ? '—' : formatMeasurement(points.data.stats.avg, 'g'),
            hint: 'na janela consultada',
          },
        ]}
      />

      <Box sx={{ mt: 2 }}>
        <DashboardCard
          title="Tendência — aceleração eixo Y (RMS por bucket)"
          titleId="sensor-trend-title"
          size="primaryChart"
          subtitle={`Um ponto por bucket de ${bucket}; a faixa sombreada é o mínimo e o máximo do bucket. Nenhuma amostra bruta é transportada. Scroll aproxima; duplo clique volta ao período.`}
          action={
            zoom.zoomed ? (
              <Button size="small" variant="text" onClick={zoom.reset}>
                Ver período todo
              </Button>
            ) : undefined
          }
          info="Esta curva é do EIXO Y. O desvio publicado no indicador usa o RMS radial (Y e Z pareados por instante) — grandezas diferentes, nomes diferentes."

        >
          {points.status === 'loading' || points.status === 'idle' ? (
            <Skeleton
              variant="rounded"
              height={280}
              role="status"
              aria-label="Agregando a série"
            />
          ) : null}
          {points.status === 'failed' ? (
            <ErrorState message={points.error ?? 'Falha ao agregar a série.'} onRetry={points.reload} />
          ) : null}
          {points.status === 'succeeded' && chartData.length === 0 ? (
            <EmptyState
              title="Sem leituras nesta janela"
              description={`Nenhuma amostra do eixo Y entre ${formatRange(range.from, range.to)} ${TIME_ZONE_LABEL}.`}
            />
          ) : null}
          {/* Altura explícita: fora do grid do painel não há linha para o card esticar, e o
              ResponsiveContainer precisa de uma altura resolvível. */}
          {points.status === 'succeeded' && chartData.length > 0 ? (
            <Box
              ref={zoom.ref}
              sx={{ width: '100%', height: { xs: 260, md: 320 } }}
              role="img"
              aria-label="Série agregada do sensor. Use a roda do mouse para aproximar; duplo clique volta ao período."
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={visibleData} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke(muiTheme)} />
                  <XAxis
                    dataKey="t"
                    type="number"
                    domain={zoom.zoomed && zoom.domain ? zoom.domain : ['dataMin', 'dataMax']}
                    allowDataOverflow
                    scale="time"
                    tickFormatter={formatChartTick}
                    tick={axisTickStyle(muiTheme)}
                    tickLine={false}
                    minTickGap={28}
                  />
                  {/* Domínio automático: com variações pequenas, forçar zero achataria a curva. */}
                  <YAxis
                    tick={axisTickStyle(muiTheme)}
                    tickLine={false}
                    axisLine={false}
                    width={58}
                    domain={yDomain ?? ['auto', 'auto']}
                    allowDataOverflow={false}
                    tickFormatter={formatAxisValue}
                  />
                  <Tooltip
                    {...tooltip}
                    labelFormatter={(label) => formatDateTime(Number(label))}
                    formatter={(value, name) => {
                      if (Array.isArray(value)) {
                        const [low, high] = value as [number, number];
                        return [`${formatNumber(low, 4)} – ${formatNumber(high, 4)} g`, 'Faixa do bucket'];
                      }
                      return [`${formatNumber(Number(value), 4)} g`, name === 'avg' ? 'Média do bucket' : String(name)];
                    }}
                  />
                  <Area
                    dataKey="band"
                    name="Faixa do bucket"
                    // baseValue segue o domínio: sem isso a área desceria até zero e
                    // arrastaria a escala junto.
                    baseValue="dataMin"
                    stroke="none"
                    fill={muiTheme.palette.primary.main}
                    fillOpacity={0.14}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    name="Média do bucket"
                    stroke={muiTheme.palette.primary.main}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          ) : null}
        </DashboardCard>
      </Box>

      {/* ALERTAS do sensor — antes das aquisições: o episódio aponta para a aquisição que o abriu. */}
      <Box sx={{ mt: 2 }}>
        <AlertsSection scope={{ sensor: serialNumber }} subtitle="Episódios abertos pelo motor para este sensor; cada um leva à aquisição que o disparou." />
      </Box>

      <Card variant="outlined" sx={{ mt: 2 }}>
        <Box sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, pt: 1.5, pb: 0.5 })}>
          <Typography variant="h2" component="h2">
            Aquisições
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            Cada linha é um ciclo de 60 s. Clique para abrir a aquisição e, dentro dela, os dados brutos.
          </Typography>
        </Box>

        {acquisitions.status === 'loading' || acquisitions.status === 'idle' ? (
          <Stack spacing={1} sx={{ p: 2 }} role="status" aria-label="Carregando aquisições">
            {[0, 1, 2, 3, 4].map((key) => (
              <Skeleton key={key} variant="text" height={28} />
            ))}
          </Stack>
        ) : null}
        {acquisitions.status === 'failed' ? (
          <Box sx={{ p: 2 }}>
            <ErrorState message={acquisitions.error ?? 'Falha ao listar aquisições.'} onRetry={acquisitions.reload} />
          </Box>
        ) : null}
        {acquisitions.status === 'succeeded' && acquisitions.data?.items.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <EmptyState
              title="Nenhuma aquisição neste período"
              description={`Este sensor não registrou ciclos entre ${formatRange(range.from, range.to)} ${TIME_ZONE_LABEL}. Amplie a janela no seletor acima.`}
            />
          </Box>
        ) : null}
        {acquisitions.status === 'succeeded' && acquisitions.data && acquisitions.data.items.length > 0 ? (
          <>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" aria-label="Aquisições do sensor">
                <TableHead>
                  <TableRow>
                    <TableCell>Início</TableCell>
                    <TableCell align="right">Duração</TableCell>
                    <TableCell align="right">RPM</TableCell>
                    <TableCell align="right">Carga</TableCell>
                    <TableCell align="right">Amostras</TableCell>
                    <TableCell align="right">Mín</TableCell>
                    <TableCell align="right">Máx</TableCell>
                    <TableCell align="right">Média</TableCell>
                    <TableCell>Evento</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {acquisitions.data.items.map((item) => (
                    <TableRow key={item.cycleId} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {/* O instante é o link para a aquisição: alvo semântico, alcançável
                            pelo teclado — a linha inteira com onClick não era. */}
                        <Link
                          component={RouterLink}
                          to={links.acquisition(item.cycleId, range)}
                          underline="hover"
                          sx={{ fontWeight: 600 }}
                        >
                          {item.startedAt ? formatDateTime(item.startedAt) : 'aquisição'}
                        </Link>
                      </TableCell>
                      <TableCell align="right">{item.durationSeconds ? `${item.durationSeconds} s` : '—'}</TableCell>
                      <TableCell align="right">{item.rpm ?? '—'}</TableCell>
                      <TableCell align="right">{item.loadPercent === null ? '—' : `${formatNumber(item.loadPercent, 1)}%`}</TableCell>
                      <TableCell align="right">{item.sampleCount}</TableCell>
                      <TableCell align="right">{item.min === null ? '—' : formatMeasurement(item.min, item.unit)}</TableCell>
                      <TableCell align="right">{item.max === null ? '—' : formatMeasurement(item.max, item.unit)}</TableCell>
                      <TableCell align="right">{item.avg === null ? '—' : formatMeasurement(item.avg, item.unit)}</TableCell>
                      <TableCell>
                        {item.event && item.event !== 'none' ? (
                          <Chip size="small" variant="outlined" label={item.event} />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={acquisitions.data.total ?? -1}
              page={acquisitions.data.page - 1}
              onPageChange={(_, next) => setParams({ page: String(next + 1) })}
              rowsPerPage={acquisitions.data.pageSize}
              rowsPerPageOptions={[25, 50, 100]}
              onRowsPerPageChange={(event) => setParams({ pageSize: event.target.value, page: '1' })}
              labelRowsPerPage="Itens por página"
              labelDisplayedRows={({ from, to, count }) =>
                count === -1 ? `${from}–${to}` : `${from}–${to} de ${count}`
              }
              getItemAriaLabel={(type) =>
                type === 'previous' ? 'Ir para a página anterior' : 'Ir para a próxima página'
              }
            />
          </>
        ) : null}
      </Card>

      {/*
        FICHA TÉCNICA — fecha a página do sensor com o que ele é, e não com o que ele mediu.
        É também a costura prevista para a próxima frente: uma seção de alertas do sensor
        entra ENTRE as aquisições e esta ficha sem reescrever a composição.
      */}
      <Card variant="outlined" sx={{ mt: 2 }}>
        <Stack
          direction="row"
          gap={{ xs: 2, md: 4 }}
          flexWrap="wrap"
          useFlexGap
          alignItems="center"
          sx={(theme) => ({ p: `${theme.dashboard.cardPadding}px`, minWidth: 0 })}
        >
          <TechnicalField label="Número de série" value={serialNumber} />
          <TechnicalField label="Modelo" value={point?.sensorModel ?? '—'} />
          <TechnicalField
            label="Máquina"
            value={point?.machineName ?? '—'}
            to={point?.machineName ? links.machine(point.machineName, range) : undefined}
          />
          <TechnicalField
            label="Ponto"
            value={point?.monitoringPointName ?? '—'}
            to={
              point?.machineName && point.monitoringPointName
                ? links.point(point.machineName, point.monitoringPointName, range)
                : undefined
            }
          />
          <TechnicalField
            label="Séries medidas"
            value={
              sensorSeries.length === 0
                ? '—'
                : sensorSeries
                    .map((item) => seriesMetricLabel(item.physicalQuantity, item.axis))
                    .join(' · ')
            }
          />
        </Stack>
      </Card>
    </Box>
  );
}

/** Par rótulo/valor da ficha técnica; vira link quando há um nível para onde subir. */
function TechnicalField({
  label,
  value,
  to,
}: {
  label: string;
  value: string;
  to?: string;
}): JSX.Element {
  return (
    <Box sx={{ minWidth: 0, maxWidth: '100%' }}>
      <Typography variant="overline" color="text.secondary" component="div" noWrap>
        {label}
      </Typography>
      {to ? (
        <Link component={RouterLink} to={to} underline="hover" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
          {value}
        </Link>
      ) : (
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap title={value}>
          {value}
        </Typography>
      )}
    </Box>
  );
}
