import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { DEFAULT_CONDITION_POLICY } from '@dynamox/domain';
import { EmptyState, ErrorState } from '@dynamox/ui';

import { api } from '../../api/client';
import { AlertsSection } from '../../components/alerts/AlertsSection';
import { DashboardCard } from '../../components/dashboard/DashboardCard';
import { ConditionTag, conditionColor } from '../../components/condition/ConditionTag';
import {
  axisTickStyle,
  chartGridStroke,
  chartTooltipStyles,
  paddedDomain,
} from '../../components/dashboard/chartTheme';
import { DeviationBar } from '../../components/investigation/DeviationBar';
import { PageHeader } from '../../components/PageHeader';
import { PageSkeleton } from '../../components/PageSkeleton';
import { KpiStrip } from '../../components/investigation/KpiStrip';
import { RangePresets, type RangePreset } from '../../components/investigation/RangePresets';
import { trendDirection } from '../../components/investigation/TrendSparkline';
import {
  formatAxisValue,
  formatMeasurement,
  formatNumber,
  seriesMetricLabel,
} from '../../features/dashboard/dashboardFormatters';
import { links } from '../../features/investigation/links';
import { useAnalyticsQuery, useTimeRange } from '../../features/investigation/useAnalyticsQuery';
import { selectCanMutate } from '../../features/auth/authSlice';
import { useAppSelector } from '../../store';
import { AssignSensorDialog } from './AssignSensorDialog';
import {
  TIME_ZONE_LABEL,
  formatChartTick,
  formatDateTime,
  formatRange,
  formatRelativeTime,
} from '../../features/time/instant';

/**
 * PÁGINA CANÔNICA DO PONTO — o contexto entre a máquina e o sensor.
 *
 * Deliberadamente mais raso que a página do sensor. Responde "este ponto está bem, está
 * reportando, e o que ele mede?" — e entrega o próximo passo. Quem quer trinta dias de
 * história, aquisições paginadas e dados brutos desce um nível: o botão está aqui.
 */
export function MonitoringPointPage(): JSX.Element {
  const { machineKey = '', pointKey = '' } = useParams();
  const [, setSearch] = useSearchParams();
  const range = useTimeRange();
  const muiTheme = useTheme();
  const tooltip = chartTooltipStyles(muiTheme);
  const canMutate = useAppSelector(selectCanMutate);
  const [assigning, setAssigning] = useState(false);

  const query = useAnalyticsQuery(
    () => api.pointSummary(machineKey, pointKey, { from: range.from, to: range.to }),
    [machineKey, pointKey, range.from, range.to],
  );
  const point = query.data;

  const applyPreset = (preset: RangePreset) => {
    const to = new Date();
    const from = new Date(to.getTime() - preset.days * 86_400_000);
    setSearch(new URLSearchParams({ from: from.toISOString(), to: to.toISOString() }));
  };

  const chartData = (point?.trend ?? []).map((entry) => ({
    t: Date.parse(entry.timestamp),
    value: entry.value,
  }));
  const yDomain = paddedDomain(chartData.map((entry) => entry.value));

  const notFound =
    query.status === 'failed' && query.httpStatus === 404;

  return (
    <Box sx={{ pb: 3 }}>
      <PageHeader
        steps={[
          { label: 'Visão geral', to: '/' },
          {
            label: point?.machineName ?? machineKey,
            to: links.machine(point?.machineName ?? machineKey, range),
          },
          { label: point?.monitoringPointName ?? pointKey },
        ]}
        title={point?.monitoringPointName ?? pointKey}
        subtitle={
          point
            ? `${point.machineName} · ${point.sensorSerialNumber ?? 'sem sensor instalado'}${point.sensorModel ? ` · ${point.sensorModel}` : ''} · ${
                point.window.lastAt ? `última leitura ${formatRelativeTime(point.window.lastAt)}` : 'ainda sem leituras'
              }`
            : 'Ponto de monitoramento.'
        }
        chips={
          <>
            {point ? <ConditionTag kind={point.condition} /> : null}
            <Chip size="small" variant="outlined" label={formatRange(range.from, range.to)} />
            <Chip size="small" variant="outlined" label={TIME_ZONE_LABEL} />
          </>
        }
        actions={
          <Stack direction="row" gap={1} alignItems="flex-start">
            <RangePresets from={range.from} to={range.to} onSelect={applyPreset} />
            {point?.sensorSerialNumber ? (
              <Button
                component={RouterLink}
                to={links.sensor(point.sensorSerialNumber, range)}
                variant="contained"
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Abrir sensor
              </Button>
            ) : null}
            {point && !point.sensorSerialNumber && canMutate ? (
              <Button
                variant="contained"
                size="small"
                onClick={() => setAssigning(true)}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Associar sensor
              </Button>
            ) : null}
          </Stack>
        }
      />

      {query.status === 'loading' || query.status === 'idle' ? (
        <PageSkeleton kpis={4} rows={5} />
      ) : null}

      {notFound ? (
        <EmptyState
          title="Ponto não encontrado"
          description={`"${pointKey}" não corresponde a nenhum ponto de "${machineKey}".`}
          action={
            <Button component={RouterLink} to={links.machine(machineKey, range)} variant="outlined" size="small">
              Voltar ao ativo
            </Button>
          }
        />
      ) : null}

      {query.status === 'failed' && !notFound ? (
        <ErrorState
          message={query.error ?? 'Não foi possível carregar o ponto.'}
          onRetry={query.reload}
        />
      ) : null}

      {query.status === 'succeeded' && point ? (
        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: `${theme.dashboard.gridGap}px`,
            alignItems: 'stretch',
          })}
        >
          <Box sx={{ gridColumn: 'span 12' }}>
            <KpiStrip
              items={[
                {
                  label: 'Desvio radial (Y/Z)',
                  value:
                    point.deviationRatio === null ? '—' : `${formatNumber(point.deviationRatio, 2)}×`,
                  hint:
                    point.baselineValue === null
                      ? 'sem referência na janela'
                      : `ref ${formatMeasurement(point.baselineValue, point.unit)}`,
                  tone:
                    (point.deviationRatio ?? 0) >= DEFAULT_CONDITION_POLICY.attentionRatio
                      ? 'warning'
                      : 'default',
                },
                {
                  label: 'RMS radial atual',
                  value:
                    point.currentValue === null
                      ? '—'
                      : formatMeasurement(point.currentValue, point.unit),
                  hint: point.currentAt ? formatRelativeTime(point.currentAt) : 'sem aquisição',
                },
                {
                  label: 'Aquisições na janela',
                  value: formatNumber(point.window.acquisitionCount, 0),
                  hint: `${formatNumber(point.window.sampleCount, 0)} amostras agregadas`,
                },
                {
                  label: 'Faixa da janela',
                  value:
                    point.window.min === null || point.window.max === null
                      ? '—'
                      : `${formatNumber(point.window.min, 4)} – ${formatNumber(point.window.max, 4)}`,
                  hint: point.window.avg === null ? undefined : `média ${formatNumber(point.window.avg, 4)} ${point.unit}`,
                },
              ]}
            />
          </Box>

          <Box sx={{ gridColumn: { xs: 'span 12', lg: 'span 8' }, display: 'flex', minWidth: 0 }}>
            <DashboardCard
              title="Tendência — aceleração eixo Y (RMS)"
              titleId="point-trend-title"
              size="chart"
              subtitle="Um ponto por bucket, nas últimas 24 h da janela."
              info="A CURVA é o RMS do eixo Y; a CONDIÇÃO ao lado usa o RMS radial (Y e Z pareados por instante). A história completa do período está na página do sensor, com bucket ajustável."
            >
              {chartData.length < 2 ? (
                <EmptyState
                  title="Sem tendência no período"
                  description="O ponto não reportou o suficiente para desenhar uma curva."
                />
              ) : (
                <Box sx={{ width: '100%', flexGrow: 1, minHeight: 160 }} role="img" aria-label="Tendência do ponto">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridStroke(muiTheme)} />
                      <XAxis
                        dataKey="t"
                        type="number"
                        scale="time"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={formatChartTick}
                        tick={axisTickStyle(muiTheme)}
                        tickLine={false}
                        minTickGap={32}
                      />
                      <YAxis
                        tick={axisTickStyle(muiTheme)}
                        tickLine={false}
                        axisLine={false}
                        width={58}
                        domain={yDomain ?? ['dataMin', 'dataMax']}
                        tickFormatter={formatAxisValue}
                      />
                      <Tooltip
                        {...tooltip}
                        labelFormatter={(label) => formatDateTime(Number(label))}
                        formatter={(value) => [`${formatNumber(Number(value), 4)} g`, 'RMS do bucket']}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="RMS do bucket"
                        stroke={conditionColor(point.condition, muiTheme.palette)}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </DashboardCard>
          </Box>

          <Box sx={{ gridColumn: { xs: 'span 12', lg: 'span 4' }, display: 'flex', minWidth: 0 }}>
            <DashboardCard
              title="Condição — RMS radial (Y/Z)"
              titleId="point-condition-title"
              subtitle="Quais aquisições produziram o desvio."
            >
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <DeviationBar ratio={point.deviationRatio} condition={point.condition} />
                <Divider flexItem />
                <Stack direction="row" justifyContent="space-between" gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    Aquisição atual
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {formatDateTime(point.currentAt)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" gap={1}>
                  <Typography variant="caption" color="text.secondary">
                    Aquisição de referência
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {formatDateTime(point.baselineAt)}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  A referência é uma aquisição concreta da janela — nunca a média do período,
                  que já conteria a própria variação.
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                  <Typography variant="caption" color="text.secondary" component="div">
                    Tendência: {trendDirection(point.trend) ?? 'sem dados suficientes'}
                  </Typography>
                  {point.currentCycleId ? (
                    <Typography variant="caption" component="div" sx={{ mt: 0.5 }}>
                      <RouterLink
                        to={links.acquisition(point.currentCycleId, range)}
                        style={{ color: 'inherit' }}
                      >
                        Abrir a aquisição atual
                      </RouterLink>
                    </Typography>
                  ) : null}
                </Box>
              </Stack>
            </DashboardCard>
          </Box>

          {/*
            IDENTIDADE — o ponto é contexto físico: máquina, posição e sensor instalado.
            Fica antes das séries porque é o que a pessoa precisa confirmar quando chega
            aqui vinda de um alerta futuro ou de um link compartilhado.
          */}
          <Box sx={{ gridColumn: 'span 12' }}>
            <Card variant="outlined">
              <Stack
                direction="row"
                gap={{ xs: 2, md: 4 }}
                flexWrap="wrap"
                useFlexGap
                alignItems="center"
                sx={(theme) => ({ p: `${theme.dashboard.cardPadding}px`, minWidth: 0 })}
              >
                <Field label="Máquina" value={point.machineName} />
                <Field label="Ponto" value={point.monitoringPointName} />
                <Field
                  label="Sensor instalado"
                  value={point.sensorSerialNumber ?? 'nenhum'}
                  to={
                    point.sensorSerialNumber
                      ? links.sensor(point.sensorSerialNumber, range)
                      : undefined
                  }
                />
                <Field label="Modelo" value={point.sensorModel ?? '—'} />
                <Field
                  label="Última leitura"
                  value={formatDateTime(point.window.lastAt, 'ainda sem leituras')}
                />
              </Stack>
            </Card>
          </Box>

          {/* ALERTAS — depois da identidade: quem chega por um alerta confirma o ponto e vê o episódio. */}
          {point?.sensorSerialNumber ? (
            <Box sx={{ gridColumn: 'span 12' }}>
              <AlertsSection
                scope={{ sensor: point.sensorSerialNumber }}
                subtitle="Episódios do sensor instalado neste ponto, com a baseline aprendida aqui — diferente da condição acima."
              />
            </Box>
          ) : null}

          <Box sx={{ gridColumn: 'span 12' }}>
            <Card variant="outlined">
              <Box sx={(theme) => ({ px: `${theme.dashboard.cardPadding}px`, pt: 1.5, pb: 0.5 })}>
                <Typography variant="h2" component="h2">
                  Séries disponíveis
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  Grandezas medidas pelo sensor deste ponto, com a última leitura na janela.
                </Typography>
              </Box>
              {point.series.length === 0 ? (
                <Box sx={{ p: 2 }}>
                  <EmptyState
                    title="Nenhuma série neste ponto"
                    description="Associe um sensor ao ponto para que ele passe a medir."
                  />
                </Box>
              ) : (
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table
                    size="small"
                    aria-label="Séries do ponto"
                    sx={{ '& .MuiTableCell-root': { px: 1, py: 0.6, borderColor: 'divider' } }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '32%' }}>Grandeza</TableCell>
                        <TableCell sx={{ width: '12%' }}>Unidade</TableCell>
                        <TableCell align="right" sx={{ width: '22%' }}>
                          Última leitura
                        </TableCell>
                        <TableCell sx={{ width: '34%' }}>Instante</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {point.series.map((series) => (
                        <TableRow key={series.seriesId} hover>
                          <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {seriesMetricLabel(series.physicalQuantity, series.axis)}
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>{series.unit}</TableCell>
                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            {series.lastValue === null
                              ? '—'
                              : formatMeasurement(series.lastValue, series.unit)}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                            {formatDateTime(series.lastAt, 'sem leitura na janela')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          </Box>
        </Box>
      ) : null}

      {point ? (
        <AssignSensorDialog
          open={assigning}
          pointId={point.monitoringPointId}
          pointName={point.monitoringPointName}
          machineName={point.machineName}
          machineType={point.machineType}
          onClose={() => setAssigning(false)}
          onAssigned={() => {
            setAssigning(false);
            query.reload();
          }}
        />
      ) : null}
    </Box>
  );
}

/** Par rótulo/valor da faixa de identidade; vira link quando há para onde ir. */
function Field({ label, value, to }: { label: string; value: string; to?: string }): JSX.Element {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="overline" color="text.secondary" component="div" noWrap>
        {label}
      </Typography>
      {to ? (
        <Link
          component={RouterLink}
          to={to}
          underline="hover"
          sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
        >
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
