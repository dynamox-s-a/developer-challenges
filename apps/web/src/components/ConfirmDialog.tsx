import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  errorMessage?: string | null
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  errorMessage = null,
  onConfirm,
  onClose
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xs'
      slotProps={{ paper: { sx: { p: 2 } } }}
    >
      <DialogTitle sx={{ p: 0, pb: 1.5 }}>{title}</DialogTitle>
      <DialogContent sx={{ p: 0, py: 1.5 }}>
        {errorMessage && (
          <Alert severity='error' sx={{ mb: 1.5 }}>
            {errorMessage}
          </Alert>
        )}
        <Typography variant='body2' color='text.secondary'>
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 0 }}>
        <Button onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          color='error'
          variant='contained'
          onClick={onConfirm}
          disabled={loading}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
