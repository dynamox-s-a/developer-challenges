/** biome-ignore-all lint/correctness/useUniqueElementIds: non sense*/
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CloseIcon from '@mui/icons-material/Close'
import { ErrorDialog } from '@/components/ui/error-dialog'
import { type CreateSensorDto, CreateSensorSchema } from '@/types/zod/sensor'
import { useCreateSensor } from '@/hooks/api/sensor/useCreateSensor'
import { useGetMachines } from '@/hooks/api/machine/useGetMachines'
import type { MachinePresenter } from '@/types/zod/machine'

interface SensorFormProps {
  open: boolean
  onClose: () => void
}

export default function SensorForm({ open, onClose }: SensorFormProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateSensorDto>({
    resolver: zodResolver(CreateSensorSchema),
    defaultValues: {
      Code: '',
      Model: 'HF+',
      Machine: '',
    },
  })

  const { getMachines } = useGetMachines()
  const { createSensor, loading } = useCreateSensor()

  const [modalOpen, setModalOpen] = useState(false)
  const [machineOptions, setMachineOptions] = useState<
    Array<{ _id: string; name: string }>
  >([])
  const [modalError, setModalError] = useState('')

  useEffect(() => {
    if (open) {
      const loadMachines = async () => {
        const response = await getMachines()
        if (response.success && Array.isArray(response.data)) {
          const options = response.data.map((machine: MachinePresenter) => ({
            _id: machine._id.toString(),
            name: machine.Name,
          }))
          setMachineOptions(options)
        }
      }
      loadMachines()
    }
  }, [open, getMachines])

  const onSubmit = async (data: CreateSensorDto) => {
    console.log(data)
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
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          component="div"
        >
          <Typography variant="h5">Registrar Sensor</Typography>
          <IconButton
            onClick={onClose}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form
          onSubmit={handleSubmit(onSubmit)}
          id="machine-form"
        >
          <DialogContent dividers>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
            >
              <TextField
                label="Code"
                {...register('Code')}
                error={!!errors.Code}
                helperText={errors.Code?.message}
                disabled={loading}
                fullWidth
                required
              />

              <Controller
                name="Model"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={!!error}
                    disabled={loading}
                  >
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
              ></Controller>

              <Controller
                name="Machine"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={!!error}
                    disabled={loading}
                  >
                    <InputLabel>Machines</InputLabel>
                    <Select
                      label="machine"
                      {...field}
                      required
                    >
                      {machineOptions.length === 0 ? (
                        <MenuItem disabled>Carregando...</MenuItem>
                      ) : (
                        machineOptions.map(machine => (
                          <MenuItem
                            key={machine.name}
                            value={machine._id}
                          >
                            {machine.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                )}
              ></Controller>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outlined"
              color="secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="machine-form"
              variant="contained"
              disabled={loading || !isDirty}
              color="secondary"
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
