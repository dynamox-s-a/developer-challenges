import { useEffect } from 'react'
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { loadMachine } from '../../modules/machine/machineSlice'
import { loadMeasurements } from '../../modules/measurements/measurementsSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  MachineMetadataBar,
  type MachineMetadataItem,
} from './components/MachineMetadataBar'
import {
  MetricChartPanel,
  type MetricConfig,
} from './components/MetricChartPanel'
import {
  GPSIcon,
  IntervalIcon,
  MachineIcon,
  RPMIcon,
  RangeIcon,
} from './components/MachineMetadataBar/MetadataIcons'

const metricCharts: MetricConfig[] = [
  {
    seriesKey: 'accelerationRms',
    title: 'Aceleração RMS',
    yAxisTitle: 'Aceleração (g)',
  },
  {
    seriesKey: 'temperature',
    title: 'Temperatura',
    yAxisTitle: 'Temperatura (°C)',
  },
  {
    seriesKey: 'velocityRms',
    title: 'Velocidade RMS',
    yAxisTitle: 'Velocidade (m/s)',
  },
]

export function DataPage() {
  const dispatch = useAppDispatch()
  const machine = useAppSelector((state) => state.machine)
  const measurements = useAppSelector((state) => state.measurements)

  useEffect(() => {
    dispatch(loadMachine())
    dispatch(loadMeasurements())
  }, [dispatch])

  const error = machine.error ?? measurements.error
  const hasMeasurements = measurements.data.length > 0
  const isLoading =
    !error && (machine.isLoading || measurements.isLoading || !machine.data)
  const metadata: MachineMetadataItem[] = machine.data
    ? [
        { icon: MachineIcon, label: `Máquina ${machine.data.id ?? '-'}` },
        { icon: GPSIcon, label: `Ponto ${machine.data.point ?? '-'}` },
        { icon: RPMIcon, label: machine.data.rotation ?? '-' },
        {
          icon: RangeIcon,
          label: machine.data.range ? `${machine.data.range}g` : '-',
        },
        {
          icon: IntervalIcon,
          label: machine.data.interval ? `${machine.data.interval} min` : '-',
        },
      ]
    : []
  return (
    <Box component="main" bgcolor="background.default" minHeight="100vh">
      <Box
        component="header"
        padding="1.3125rem 1.5rem 1.1875rem"
        bgcolor="background.paper"
        borderBottom={1}
        sx={{ borderColor: (theme) => theme.border.default }}
      >
        <Stack
          direction="row"
          alignItems="center"
          height="100%"
          mx="auto"
          sx={{
            maxWidth: (theme) => theme.layout.maxContentWidth,
          }}
        >
          <Typography component="h1" variant="h4" color="text.primary">
            Análise de Dados
          </Typography>
        </Stack>
      </Box>

      <Box padding="1.5rem 1.5rem 3.4375rem">
        <Stack
          mx="auto"
          spacing={2}
          sx={{
            maxWidth: (theme) => theme.layout.maxContentWidth,
          }}
        >
          {isLoading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              minHeight="16rem"
            >
              <CircularProgress size={64} />
            </Stack>
          ) : error ? (
            <Alert severity="error" sx={{ alignItems: 'center' }}>
              Não foi possível carregar os dados. {error}
            </Alert>
          ) : (
            <>
              <MachineMetadataBar items={metadata} />
              <Stack
                direction="column"
                spacing={3}
                bgcolor="background.paper"
                border={1}
                boxSizing="content-box"
                height="100%"
                mx="auto"
                padding="1.5rem 1.5rem 4rem"
                sx={{
                  borderColor: (theme) => theme.border.default,
                  maxWidth: (theme) => theme.layout.maxContentWidth,
                }}
              >
                {hasMeasurements ? (
                  metricCharts.map((metric) => (
                    <MetricChartPanel
                      key={metric.seriesKey}
                      metric={metric}
                      series={measurements.data}
                    />
                  ))
                ) : (
                  <Typography color="text.primary" variant="body1">
                    Nenhum dado de medição encontrado.
                  </Typography>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
