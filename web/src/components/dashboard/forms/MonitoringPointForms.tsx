import { CreateMonitoringPointDto, CreateMonitoringPointSchema } from "@/types/zod/monitoring-point"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import CloseIcon from '@mui/icons-material/Close'
import { ErrorDialog } from "@/components/ui/error-dialog"
import { useCreateMonitoringPoint } from "@/hooks/api/monitoring-point/useCreateMonitoringPoint"



interface MonitoringPointProps {
  open: boolean
  onClose: () => void
}

export default function MonitoringPointForm({ open, onClose }: MonitoringPointProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateMonitoringPointDto>({
    resolver: zodResolver(CreateMonitoringPointSchema),
    defaultValues: {
      name: '',
      machine: '',
      sensor: ''
    }
  })

  const { createMonitoringPoint, error: hookError, loading } = useCreateMonitoringPoint()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalError, setModalError] = useState('')

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = async (data: CreateMonitoringPointDto) => {
    const response = await createMonitoringPoint(data)

    if (response.success) {
      reset()
      onClose()
      return
    }

    setModalError(response.message || 'Erro desconhecido')
    setModalOpen(true)
  }

  return (
    <>
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { minHeight: '500px' } }}
      >
        <DialogTitle sx={{ 
          m: 0, p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
          component="div"
        >
          <Typography variant="h5">Registrar Ponto de Monitoramento</Typography>
          <IconButton onClick={onClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} id="machine-form">
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nome"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
                fullWidth
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outlined"
              color='secondary'
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="machine-form"
              variant="contained"
              disabled={loading || !isDirty}
              color='secondary'
            >
              {loading ? 'Enviando...' : 'Registrar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ErrorDialog
        open={modalOpen}
        message={modalError}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}