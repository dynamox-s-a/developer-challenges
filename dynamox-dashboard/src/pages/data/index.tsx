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
  GPSIcon,
  IntervalIcon,
  MachineIcon,
  RPMIcon,
  RangeIcon,
} from './components/MachineMetadataBar/MetadataIcons'

export function DataPage() {
  const dispatch = useAppDispatch()
  const machine = useAppSelector((state) => state.machine)
  const measurements = useAppSelector((state) => state.measurements)

  useEffect(() => {
    dispatch(loadMachine())
    dispatch(loadMeasurements())
  }, [dispatch])

  const error = machine.error ?? measurements.error
  const isLoading =
    !error && (machine.isLoading || measurements.isLoading || !machine.data)
  const metadata: MachineMetadataItem[] = machine.data
    ? [
        { icon: MachineIcon, label: `Maquina ${machine.data.id ?? '-'}` },
        { icon: GPSIcon, label: `Ponto ${machine.data.point ?? '-'}` },
        { icon: RPMIcon, label: machine.data.rotation ?? '-' },
        { icon: RangeIcon, label: machine.data.range ? `${machine.data.range}g` : '-' },
        { icon: IntervalIcon, label: machine.data.interval ? `${machine.data.interval} min` : '-' },
      ]
    : []

  return (
    <Box
      component="main"
      sx={{ bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <Box
        component="header"
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'primary.light',
          padding: '1.3125rem 1.5rem 1.1875rem',
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          sx={{
            height: '100%',
            maxWidth: (theme) => theme.layout.maxContentWidth,
            mx: 'auto',
          }}
        >
          <Typography color="text.primary" component="h1" variant="h4">
            Análise de Dados
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ padding: '1.5rem' }}>
        <Stack
          spacing={2}
          sx={{
            maxWidth: (theme) => theme.layout.maxContentWidth,
            mx: 'auto',
          }}
        >
          {isLoading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: '16rem' }}
            >
              <CircularProgress size={64} />
            </Stack>
          ) : error ? (
            <Alert severity="error" sx={{ alignItems: 'center' }}>
              Não foi possível carregar os dados. {error}
            </Alert>
          ) : (
            <MachineMetadataBar items={metadata} />
          )}
        </Stack>
      </Box>
    </Box>
  )
}
