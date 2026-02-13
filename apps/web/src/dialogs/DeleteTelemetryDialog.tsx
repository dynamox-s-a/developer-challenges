import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material'

interface DeleteTelemetryDialogProps {
  open: boolean
  from: string
  to: string
  loading: boolean
  error: string | null
  onClose: () => void
  onConfirm: (params: {
    all: boolean
    from?: string
    to?: string
  }) => Promise<void>
}

export function DeleteTelemetryDialog({
  open,
  from,
  to,
  loading,
  error,
  onClose,
  onConfirm
}: DeleteTelemetryDialogProps) {
  const [all, setAll] = useState(!from && !to)
  const [localFrom, setLocalFrom] = useState(from)
  const [localTo, setLocalTo] = useState(to)
  const missingRange = !all && !localFrom && !localTo

  const handleClose = () => {
    setAll(!from && !to)
    setLocalFrom(from)
    setLocalTo(to)
    onClose()
  }

  const handleConfirm = async () => {
    if (all) {
      await onConfirm({ all: true })
    } else {
      await onConfirm({ all: false, from: localFrom, to: localTo })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      fullWidth
      maxWidth='sm'
      slotProps={{ paper: { sx: { p: 2 } } }}
    >
      <DialogTitle sx={{ p: 0, pb: 1.5 }}>
        Deletar dados de telemetria
      </DialogTitle>
      <DialogContent sx={{ p: 0, py: 1.5 }}>
        <Stack spacing={1.5}>
          <Typography variant='body2'>
            Você pode deletar todos os pontos ou apenas do intervalo de filtros.
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={all}
                onChange={(event) => setAll(event.target.checked)}
              />
            }
            label='Deletar tudo'
          />

          {!all && (
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label='De'
                  type='datetime-local'
                  value={localFrom}
                  onChange={(event) => setLocalFrom(event.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label='Até'
                  type='datetime-local'
                  value={localTo}
                  onChange={(event) => setLocalTo(event.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>
          )}

          <Typography variant='body2' color='text.secondary'>
            {all
              ? 'Todos os dados serão deletados'
              : `Intervalo: ${localFrom || '-'} até ${localTo || '-'}`}
          </Typography>
          {error && <Alert severity='error'>{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 0 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={() => void handleConfirm()}
          disabled={loading || missingRange}
        >
          {loading ? 'Deletando...' : 'Confirmar exclusão'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
