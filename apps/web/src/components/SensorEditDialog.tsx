import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField
} from '@mui/material'

type SensorModel = 'TcAg' | 'TcAs' | 'HF_PLUS'

interface SensorEditDialogProps {
  open: boolean
  sensorUniqueId: string
  model: SensorModel
  error: string | null
  loading: boolean
  onClose: () => void
  onSave: () => void
  onSensorUniqueIdChange: (value: string) => void
  onModelChange: (value: SensorModel) => void
}

const SENSOR_MODEL_OPTIONS: Array<{ value: SensorModel; label: string }> = [
  { value: 'TcAg', label: 'TcAg' },
  { value: 'TcAs', label: 'TcAs' },
  { value: 'HF_PLUS', label: 'HF+' }
]

export function SensorEditDialog({
  open,
  sensorUniqueId,
  model,
  error,
  loading,
  onClose,
  onSave,
  onSensorUniqueIdChange,
  onModelChange
}: SensorEditDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      slotProps={{ paper: { sx: { p: 2 } } }}
    >
      <DialogTitle sx={{ p: 0, pb: 1.5 }}>Editar Sensor</DialogTitle>
      <DialogContent sx={{ p: 0, pb: 1.5, paddingTop: '5px !important' }}>
        <Stack spacing={2}>
          {error && <Alert severity='error'>{error}</Alert>}
          <TextField
            label='Sensor Unique ID'
            placeholder='AAAAAA-999'
            value={sensorUniqueId}
            onChange={(event) => onSensorUniqueIdChange(event.target.value)}
          />
          <TextField
            select
            label='Modelo'
            value={model}
            onChange={(event) =>
              onModelChange(event.target.value as SensorModel)
            }
          >
            {SENSOR_MODEL_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          onClick={onSave}
          disabled={loading || !sensorUniqueId.trim()}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
