import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { CreateTimeSeriesDialog } from '../dialogs/CreateTimeSeriesDialog'
import { DeleteTelemetryDialog } from '../dialogs/DeleteTelemetryDialog'
import {
  fetchTelemetryCountThunk,
  fetchTelemetryMetricsThunk,
  fetchTelemetrySeriesThunk,
  createTelemetrySeriesThunk,
  deleteTelemetrySeriesThunk
} from '../features/telemetry/telemetryThunks'
import { clearTelemetryErrors } from '../features/telemetry/telemetrySlice'
import {
  selectTelemetryCount,
  selectTelemetryCountError,
  selectTelemetryCountLoading,
  selectTelemetryCreateError,
  selectTelemetryCreateLoading,
  selectTelemetryDeleteError,
  selectTelemetryDeleteLoading,
  selectTelemetryMetrics,
  selectTelemetryMetricsError,
  selectTelemetryMetricsLoading,
  selectTelemetryPoints,
  selectTelemetryPointsError,
  selectTelemetryPointsLoading,
  selectTelemetrySeries
} from '../features/telemetry/telemetrySelectors'
import type {
  TelemetryOrder,
  TelemetryPoint,
  TelemetryPointInput,
  TelemetrySeriesQuery
} from '../features/telemetry/telemetryTypes'

const DEFAULT_LIMIT = 1000

type ChartMetric = 'accelerationRms' | 'temperature' | 'x' | 'y' | 'z'

const METRIC_LABELS = {
  x: 'Aceleração X (g)',
  y: 'Aceleração Y (g)',
  z: 'Aceleração Z (g)',
  temperature: 'Temperatura (°C)',
  accelerationRms: 'Aceleração RMS (g)'
} as const

const ACCELERATION_RMS_RESULTANT_LABEL = 'Aceleração resultante RMS (g)'

function formatDateTime(value?: string | null) {
  if (!value) return '-'
  return new Date(value).toLocaleString('pt-BR')
}

function toApiIso(value: string) {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

function formatNumber(value: number | null | undefined, decimals: number) {
  if (value == null || Number.isNaN(value)) return '-'
  return value.toFixed(decimals)
}

function getMetricLabel(metric: string | undefined) {
  if (!metric) return '-'
  if (metric === 'accelerationRms') return ACCELERATION_RMS_RESULTANT_LABEL
  return METRIC_LABELS[metric as ChartMetric] ?? metric
}

function TelemetryFiltersCard(props: {
  machineName?: string
  sensorUuid: string
  sensorLabel: string
  countData: { timeSeriesCount: number; pointsCount: number } | null
  from: string
  to: string
  limit: number
  order: TelemetryOrder
  loadingAny: boolean
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onLimitChange: (value: number) => void
  onOrderChange: (value: TelemetryOrder) => void
  onSearch: () => void
  onResetFilters: () => void
  onOpenCreate: () => void
  onOpenDelete: () => void
}) {
  return (
    <Card variant='outlined'>
      <Toolbar disableGutters sx={{ px: 2, py: 2, display: 'block' }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            alignItems='center'
          >
            <Typography variant='h6'>Série Temporal</Typography>
            <Chip label={`Máquina: ${props.machineName ?? '-'}`} size='small' />
            <Chip
              label={`Sensor: ${props.sensorLabel}`}
              size='small'
              color='primary'
            />
            <Chip
              label={`Séries temporais: ${props.countData?.timeSeriesCount ?? 0}`}
              size='small'
              color='secondary'
            />
            <Chip
              label={`Pontos: ${props.countData?.pointsCount ?? 0}`}
              size='small'
            />
          </Stack>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label='De'
                type='datetime-local'
                value={props.from}
                onChange={(event) => props.onFromChange(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label='Até'
                type='datetime-local'
                value={props.to}
                onChange={(event) => props.onToChange(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label='Limite'
                type='number'
                value={props.limit}
                onChange={(event) =>
                  props.onLimitChange(
                    Number(event.target.value) || DEFAULT_LIMIT
                  )
                }
                slotProps={{ htmlInput: { min: 1, max: 10000 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel id='order-select'>Ordernar</InputLabel>
                <Select
                  labelId='order-select'
                  label='Ordernar'
                  value={props.order}
                  onChange={(event) =>
                    props.onOrderChange(event.target.value as TelemetryOrder)
                  }
                >
                  <MenuItem value='asc'>Ascendente</MenuItem>
                  <MenuItem value='desc'>Descendente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              size={{ xs: 12, md: 2 }}
              sx={{ display: 'flex', alignItems: 'flex-end' }}
            >
              <Stack direction='row' spacing={1}>
                <Button
                  variant='contained'
                  onClick={props.onSearch}
                  disabled={props.loadingAny}
                >
                  Buscar
                </Button>
                <Button
                  variant='outlined'
                  onClick={props.onResetFilters}
                  disabled={props.loadingAny}
                >
                  Limpar
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant='contained'
              color='success'
              onClick={props.onOpenCreate}
            >
              Enviar série
            </Button>
            <Button
              variant='outlined'
              color='error'
              onClick={props.onOpenDelete}
            >
              Deletar dados
            </Button>
          </Stack>
        </Stack>
      </Toolbar>
    </Card>
  )
}

function TelemetryMetricsCards(props: {
  metrics: ReturnType<typeof selectTelemetryMetrics>
}) {
  const { metrics } = props
  if (!metrics) return null

  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card variant='outlined'>
          <CardContent>
            <Typography variant='subtitle2'>Resumo</Typography>
            <Typography variant='body2'>
              Pontos: {metrics.pointsCount}
            </Typography>
            <Typography variant='body2'>
              Primeiro: {formatDateTime(metrics.firstTimestamp)}
            </Typography>
            <Typography variant='body2'>
              Último: {formatDateTime(metrics.lastTimestamp)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card variant='outlined'>
          <CardContent>
            <Typography variant='subtitle2'>
              {ACCELERATION_RMS_RESULTANT_LABEL}
            </Typography>
            <Typography variant='body2'>
              Mín: {formatNumber(metrics.accelerationRms.min, 4)}
            </Typography>
            <Typography variant='body2'>
              Máx: {formatNumber(metrics.accelerationRms.max, 4)}
            </Typography>
            <Typography variant='body2'>
              Média: {formatNumber(metrics.accelerationRms.avg, 4)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card variant='outlined'>
          <CardContent>
            <Typography variant='subtitle2'>
              {METRIC_LABELS.temperature}
            </Typography>
            <Typography variant='body2'>
              Mín: {formatNumber(metrics.temperature.min, 2)}
            </Typography>
            <Typography variant='body2'>
              Máx: {formatNumber(metrics.temperature.max, 2)}
            </Typography>
            <Typography variant='body2'>
              Média: {formatNumber(metrics.temperature.avg, 2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card variant='outlined'>
          <CardContent>
            <Typography variant='subtitle2'>
              Acelerações por eixo (g)
            </Typography>
            <Typography variant='body2'>
              {METRIC_LABELS.x} Média: {formatNumber(metrics.x.avg, 4)}
            </Typography>
            <Typography variant='body2'>
              {METRIC_LABELS.y} Média: {formatNumber(metrics.y.avg, 4)}
            </Typography>
            <Typography variant='body2'>
              {METRIC_LABELS.z} Média: {formatNumber(metrics.z.avg, 4)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

function TelemetryChartCard(props: {
  points: TelemetryPoint[]
  metric: ChartMetric
  plotXYZTogether: boolean
  onMetricChange: (metric: ChartMetric) => void
  onToggleXYZ: (value: boolean) => void
}) {
  const sortedPoints = useMemo(() => {
    return [...props.points]
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .map((point) => ({
        ...point,
        ts: new Date(point.timestamp).getTime()
      }))
  }, [props.points])

  return (
    <Card variant='outlined'>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent='space-between'
          alignItems={{ xs: 'stretch', sm: 'center' }}
          mb={2}
        >
          <Typography variant='h6'>Gráfico</Typography>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <FormControl size='small' sx={{ minWidth: 200 }}>
              <InputLabel id='metric-select'>Métrica</InputLabel>
              <Select
                labelId='metric-select'
                label='Métrica'
                value={props.metric}
                onChange={(event) =>
                  props.onMetricChange(event.target.value as ChartMetric)
                }
              >
                <MenuItem value='accelerationRms'>
                  {METRIC_LABELS.accelerationRms}
                </MenuItem>
                <MenuItem value='temperature'>
                  {METRIC_LABELS.temperature}
                </MenuItem>
                <MenuItem value='x'>{METRIC_LABELS.x}</MenuItem>
                <MenuItem value='y'>{METRIC_LABELS.y}</MenuItem>
                <MenuItem value='z'>{METRIC_LABELS.z}</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={props.plotXYZTogether}
                  onChange={(event) => props.onToggleXYZ(event.target.checked)}
                />
              }
              label='Plotar x/y/z juntos'
            />
          </Stack>
        </Stack>

        {sortedPoints.length === 0 ? (
          <Alert severity='info'>Sem pontos para plotar.</Alert>
        ) : (
          <Box sx={{ width: '100%', height: 360 }}>
            <ResponsiveContainer>
              <LineChart
                data={sortedPoints}
                margin={{ top: 12, right: 24, left: 0, bottom: 12 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='ts'
                  type='number'
                  domain={['auto', 'auto']}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString('pt-BR')
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(Number(value)).toLocaleString('pt-BR')
                  }
                  formatter={(
                    value: string | number | undefined,
                    name: string | undefined
                  ) => [Number(value ?? 0).toFixed(2), getMetricLabel(name)]}
                />
                <Legend formatter={(value: string) => getMetricLabel(value)} />
                {props.plotXYZTogether ? (
                  <>
                    <Line
                      type='monotone'
                      dataKey='x'
                      name={METRIC_LABELS.x}
                      stroke='#0288d1'
                      dot={false}
                    />
                    <Line
                      type='monotone'
                      dataKey='y'
                      name={METRIC_LABELS.y}
                      stroke='#f57c00'
                      dot={false}
                    />
                    <Line
                      type='monotone'
                      dataKey='z'
                      name={METRIC_LABELS.z}
                      stroke='#2e7d32'
                      dot={false}
                    />
                  </>
                ) : (
                  <Line
                    type='monotone'
                    dataKey={props.metric}
                    name={
                      props.metric === 'accelerationRms'
                        ? ACCELERATION_RMS_RESULTANT_LABEL
                        : METRIC_LABELS[props.metric]
                    }
                    stroke='#1976d2'
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function TelemetryPointsTable(props: {
  points: TelemetryPoint[]
  order: TelemetryOrder
}) {
  const [page, setPage] = useState(0)
  const rowsPerPage = 25

  const totalPages = Math.ceil(props.points.length / rowsPerPage)
  const currentPage = page >= totalPages ? Math.max(0, totalPages - 1) : page

  const visibleRows = props.points.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  )

  return (
    <Card variant='outlined'>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Pontos da Série Temporal
        </Typography>
        <Typography variant='body2' color='text.secondary' mb={1.5}>
          Ordenação atual: {props.order}
        </Typography>

        {props.points.length === 0 ? (
          <Alert severity='info'>
            Nenhum ponto encontrado com os filtros atuais.
          </Alert>
        ) : (
          <>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>{METRIC_LABELS.x}</TableCell>
                    <TableCell>{METRIC_LABELS.y}</TableCell>
                    <TableCell>{METRIC_LABELS.z}</TableCell>
                    <TableCell>{METRIC_LABELS.temperature}</TableCell>
                    <TableCell>{METRIC_LABELS.accelerationRms}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((point) => (
                    <TableRow
                      key={`${point.timestamp}-${point.x}-${point.y}-${point.z}`}
                    >
                      <TableCell>{formatDateTime(point.timestamp)}</TableCell>
                      <TableCell>{point.x.toFixed(4)}</TableCell>
                      <TableCell>{point.y.toFixed(4)}</TableCell>
                      <TableCell>{point.z.toFixed(4)}</TableCell>
                      <TableCell>{point.temperature.toFixed(2)}</TableCell>
                      <TableCell>{point.accelerationRms.toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component='div'
              rowsPerPageOptions={[rowsPerPage]}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              count={props.points.length}
              onPageChange={(_event, nextPage) => setPage(nextPage)}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function TimeSeriesPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { machineId } = useParams<{ machineId: string }>()
  const [searchParams] = useSearchParams()

  const sensorUuid = searchParams.get('sensorUuid') ?? ''

  const pointsData = useAppSelector(selectTelemetryPoints)
  const seriesData = useAppSelector(selectTelemetrySeries)
  const metricsData = useAppSelector(selectTelemetryMetrics)
  const countData = useAppSelector(selectTelemetryCount)

  const pointsLoading = useAppSelector(selectTelemetryPointsLoading)
  const metricsLoading = useAppSelector(selectTelemetryMetricsLoading)
  const countLoading = useAppSelector(selectTelemetryCountLoading)

  const pointsError = useAppSelector(selectTelemetryPointsError)
  const metricsError = useAppSelector(selectTelemetryMetricsError)
  const countError = useAppSelector(selectTelemetryCountError)

  const createLoading = useAppSelector(selectTelemetryCreateLoading)
  const createError = useAppSelector(selectTelemetryCreateError)
  const deleteLoading = useAppSelector(selectTelemetryDeleteLoading)
  const deleteError = useAppSelector(selectTelemetryDeleteError)

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [order, setOrder] = useState<TelemetryOrder>('desc')

  const [chartMetric, setChartMetric] = useState<ChartMetric>('accelerationRms')
  const [plotXYZTogether, setPlotXYZTogether] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const loadingAny = pointsLoading || metricsLoading || countLoading

  const loadAll = useCallback(async () => {
    if (!sensorUuid) return

    const query: TelemetrySeriesQuery = {
      from: toApiIso(from),
      to: toApiIso(to),
      limit,
      order
    }

    await Promise.all([
      dispatch(fetchTelemetryCountThunk({ sensorUuid })).unwrap(),
      dispatch(
        fetchTelemetryMetricsThunk({
          sensorUuid,
          from: query.from,
          to: query.to
        })
      ).unwrap(),
      dispatch(fetchTelemetrySeriesThunk({ sensorUuid, query })).unwrap()
    ])
  }, [dispatch, sensorUuid, from, to, limit, order])

  useEffect(() => {
    if (!sensorUuid) return

    void loadAll()
  }, [sensorUuid, loadAll])

  useEffect(() => {
    return () => {
      dispatch(clearTelemetryErrors())
    }
  }, [dispatch])

  const handleSearch = async () => {
    try {
      await loadAll()
    } catch {
      /* empty */
    }
  }

  const handleResetFilters = () => {
    setFrom('')
    setTo('')
    setLimit(DEFAULT_LIMIT)
    setOrder('desc')
  }

  const handleCreate = async (payload: {
    intervalMinutes: number
    points: TelemetryPointInput[]
  }) => {
    if (!sensorUuid) return

    try {
      await dispatch(
        createTelemetrySeriesThunk({
          sensorUuid,
          intervalMinutes: payload.intervalMinutes,
          points: payload.points
        })
      ).unwrap()
      setCreateOpen(false)
      await loadAll()
    } catch {
      /* empty */
    }
  }

  const handleDelete = async (params: {
    all: boolean
    from?: string
    to?: string
  }) => {
    if (!sensorUuid) return

    try {
      await dispatch(
        deleteTelemetrySeriesThunk({
          sensorUuid,
          all: params.all,
          from: params.all ? undefined : toApiIso(params.from ?? from),
          to: params.all ? undefined : toApiIso(params.to ?? to)
        })
      ).unwrap()
      setDeleteOpen(false)
      await loadAll()
    } catch {
      /* empty */
    }
  }

  const chartPoints = useMemo(() => {
    if (pointsData.length <= limit) return pointsData
    return pointsData.slice(0, limit)
  }, [pointsData, limit])

  const sensorLabel = seriesData
    ? `${seriesData.sensor.sensorUniqueId} (${seriesData.sensor.model})`
    : sensorUuid

  const topError = pointsError || metricsError || countError

  if (!sensorUuid) {
    return (
      <Box>
        <Typography variant='h5' gutterBottom>
          Telemetria
        </Typography>
        <Alert severity='info' sx={{ mb: 2 }}>
          Nenhum sensor selecionado. Volte para a tela de sensores e abra a
          telemetria com `sensorUuid` na URL.
        </Alert>
        <Button
          variant='outlined'
          onClick={() =>
            navigate(
              machineId
                ? `/app/machines/${machineId}/sensors`
                : '/app/monitoring-points'
            )
          }
        >
          Voltar
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Stack spacing={2}>
        <TelemetryFiltersCard
          machineName={seriesData?.machine?.name}
          sensorUuid={sensorUuid}
          sensorLabel={sensorLabel}
          countData={countData}
          from={from}
          to={to}
          limit={limit}
          order={order}
          loadingAny={loadingAny}
          onFromChange={setFrom}
          onToChange={setTo}
          onLimitChange={setLimit}
          onOrderChange={setOrder}
          onSearch={() => void handleSearch()}
          onResetFilters={handleResetFilters}
          onOpenCreate={() => setCreateOpen(true)}
          onOpenDelete={() => setDeleteOpen(true)}
        />

        {topError && <Alert severity='error'>{topError}</Alert>}

        {loadingAny && !seriesData ? (
          <Box display='flex' justifyContent='center' py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TelemetryMetricsCards metrics={metricsData} />
            <TelemetryChartCard
              points={chartPoints}
              metric={chartMetric}
              plotXYZTogether={plotXYZTogether}
              onMetricChange={setChartMetric}
              onToggleXYZ={setPlotXYZTogether}
            />
            <TelemetryPointsTable points={pointsData} order={order} />
          </>
        )}
      </Stack>

      <CreateTimeSeriesDialog
        open={createOpen}
        loading={createLoading}
        error={createError}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <DeleteTelemetryDialog
        key={`${deleteOpen}-${from}-${to}`}
        open={deleteOpen}
        from={from}
        to={to}
        loading={deleteLoading}
        error={deleteError}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  )
}

export function TelemetryPage() {
  return <TimeSeriesPage />
}
