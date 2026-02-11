import { CreateMonitoringPointDto, CreateMonitoringPointSchema } from "@/types/zod/monitoring-point"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import CloseIcon from '@mui/icons-material/Close'
import { ErrorDialog } from "@/components/ui/error-dialog"
import { useCreateMonitoringPoint } from "@/hooks/api/monitoring-point/useCreateMonitoringPoint"
import { CreateSensorDto, CreateSensorSchema } from "@/types/zod/sensor"
import { useCreateSensor } from "@/hooks/api/sensor/useCreateSensor"

interface SensorFormProps {
  open: boolean
  onClose: () => void
}

export default function SensorForm({ open, onClose }: SensorFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateSensorDto>({
    resolver: zodResolver(CreateSensorSchema),
    defaultValues: {
      model: 'HF+',
      machine: '',
    }
  })

  const { createSensor, error: hookError, loading } = useCreateSensor()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalError, setModalError] = useState('')

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = async (data: CreateSensorDto) => {
    const response = await createSensor(data) 

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
          <Typography variant="h5">Registrar Sensor</Typography>
          <IconButton onClick={onClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} id="machine-form">
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Controller
              name="model"
              control={control}
              render={({field, fieldState: {error}}) => (
                <FormControl fullWidth error={!!error} disabled={loading}>
                  <InputLabel>Model</InputLabel>
                  <Select 
                    label="Model" 
                    {...field}
                    required
                  >
                    <MenuItem value="HF+">HF+</MenuItem>
                    <MenuItem value="TcAg">TcAg</MenuItem>
                    <MenuItem value="TcAs">TcAs</MenuItem>
                  </Select>
                </FormControl>
              )}
            >

            </Controller>
            </Box>
              {/* <FormControl fullWidth error={!!errors.type} disabled={loading}>
                <InputLabel>Tipo</InputLabel>
                <Select label="Tipo" {...register('type')} required={true}>
                  <MenuItem value="Pump">Pump</MenuItem>
                  <MenuItem value="Fan">Fan</MenuItem>
                </Select>
              </FormControl>
            </Box> 
                NEED HAVE SENSOR FORM CONTROL AND MACHINE FORM CONTROL!!!
            */}

            {/* {hookError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {hookError}
              </Typography>
            )} */}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="machine-form"
              variant="contained"
              disabled={loading || !isDirty}
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