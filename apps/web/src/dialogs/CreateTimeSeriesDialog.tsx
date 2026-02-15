import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material'
import {
  generateFakeHfSeries,
  generateFakeTcAgSeries,
  generateFakeTcAsSeries
} from '../utils/fakeSensors'

interface TelemetryPointInput {
  timestamp: string
  x: number
  y: number
  z: number
  temperature: number
}

interface CreateTimeSeriesDialogProps {
  open: boolean
  loading: boolean
  error: string | null
  sensorModel?: 'TcAg' | 'TcAs' | 'HF_PLUS'
  onClose: () => void
  onSubmit: (payload: {
    intervalMinutes: number
    points: TelemetryPointInput[]
  }) => Promise<void>
}

const MAX_FAKE_POINTS = 500

export function CreateTimeSeriesDialog({
  open,
  loading,
  error,
  sensorModel = 'TcAg',
  onClose,
  onSubmit
}: CreateTimeSeriesDialogProps) {
  const [intervalMinutes, setIntervalMinutes] = useState(5)
  const [pointsCount, setPointsCount] = useState(120)
  const [localError, setLocalError] = useState<string | null>(null)

  const submit = async () => {
    setLocalError(null)

    if (pointsCount < 1 || pointsCount > MAX_FAKE_POINTS) {
      setLocalError(
        `Quantidade de pontos deve estar entre 1 e ${MAX_FAKE_POINTS}`
      )
      return
    }

    const points =
      sensorModel === 'TcAs'
        ? generateFakeTcAsSeries({ intervalMinutes, pointsCount })
        : sensorModel === 'HF_PLUS'
          ? generateFakeHfSeries({
              intervalMinutes,
              pointsCount,
              variant: 'HF+'
            })
          : generateFakeTcAgSeries({ intervalMinutes, pointsCount })

    await onSubmit({ intervalMinutes, points })
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth='md'
      fullWidth
      slotProps={{ paper: { sx: { p: 2 } } }}
    >
      <DialogTitle sx={{ p: 0, pb: 1.5 }}>
        Enviar Série Temporal ({sensorModel === 'HF_PLUS' ? 'HF+' : sensorModel})
      </DialogTitle>
      <DialogContent sx={{ p: 0, pb: 1.5, paddingTop: '5px !important' }}>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label='Intervalo (minutos)'
              type='number'
              value={intervalMinutes}
              onChange={(event) =>
                setIntervalMinutes(Number(event.target.value) || 5)
              }
              slotProps={{ htmlInput: { min: 1, max: 60 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label='Quantidade de pontos'
              type='number'
              value={pointsCount}
              onChange={(event) =>
                setPointsCount(Number(event.target.value) || 120)
              }
              slotProps={{ htmlInput: { min: 1, max: MAX_FAKE_POINTS } }}
            />
          </Grid>
        </Grid>

        {(localError || error) && (
          <Alert severity='error' sx={{ mt: 2 }}>
            {localError ?? error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          onClick={() => void submit()}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
