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
  onClose: () => void
  onSubmit: (payload: {
    intervalMinutes: number
    points: TelemetryPointInput[]
  }) => Promise<void>
}

const MAX_FAKE_POINTS = 500

function generateFakeTcAgSeries(params: {
  intervalMinutes: number
  pointsCount: number
}): TelemetryPointInput[] {
  const now = Date.now()
  const intervalMs = params.intervalMinutes * 60 * 1000
  const amplitude = 0.6

  return Array.from({ length: params.pointsCount }).map((_, index) => {
    const time = now - (params.pointsCount - index) * intervalMs
    const noise = () => (Math.random() - 0.5) * 0.08
    const x = amplitude * Math.sin(index / 12) + noise()
    const y = amplitude * Math.cos(index / 15) + noise()
    const z = amplitude * Math.sin(index / 18) + noise()
    const temperature = 30 + Math.sin(index / 45) * 4 + Math.random() * 0.4

    return {
      timestamp: new Date(time).toISOString(),
      x: Number(x.toFixed(4)),
      y: Number(y.toFixed(4)),
      z: Number(z.toFixed(4)),
      temperature: Number(temperature.toFixed(2))
    }
  })
}

export function CreateTimeSeriesDialog({
  open,
  loading,
  error,
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

    const points = generateFakeTcAgSeries({ intervalMinutes, pointsCount })
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
      <DialogTitle sx={{ p: 0, pb: 1.5 }}>Enviar Série Temporal</DialogTitle>
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
