import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from '@mui/material'

interface MonitoringPointEditDialogProps {
  open: boolean
  name: string
  error: string | null
  loading: boolean
  onClose: () => void
  onSave: () => void
  onNameChange: (value: string) => void
}

export function MonitoringPointEditDialog({
  open,
  name,
  error,
  loading,
  onClose,
  onSave,
  onNameChange
}: MonitoringPointEditDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xs'
      slotProps={{ paper: { sx: { p: 2 } } }}
    >
      <DialogTitle sx={{ p: 0, pb: 1.5 }}>
        Editar Ponto de Monitoramento
      </DialogTitle>
      <DialogContent sx={{ p: 0, pb: 1.5, paddingTop: '5px !important' }}>
        <Stack spacing={2}>
          {error && <Alert severity='error'>{error}</Alert>}
          <TextField
            label='Nome do ponto de monitoramento'
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          onClick={onSave}
          disabled={loading || !name.trim()}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
