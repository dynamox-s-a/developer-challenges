/** biome-ignore-all lint/correctness/useUniqueElementIds: idk */
/** biome-ignore-all lint/style/useTemplate: idk */
import {
  type CreateMonitoringPointDto,
  CreateMonitoringPointSchema,
} from '@/types/zod/monitoring-point'
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
import { useCreateMonitoringPoint } from '@/hooks/api/monitoring-point/useCreateMonitoringPoint'
import { useGetMachines } from '@/hooks/api/machine/useGetMachines'
import type { MachinePresenter } from '@/types/zod/machine'
import { useGetSensors } from '@/hooks/api/machine/useGetSensors'
import type { SensorPresenter } from '@/types/zod/sensor'

interface MonitoringPointProps {
  open: boolean
  onClose: () => void
}

export default function MonitoringPointForm({
  open,
  onClose,
}: MonitoringPointProps) {
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateMonitoringPointDto>({
    resolver: zodResolver(CreateMonitoringPointSchema),
    defaultValues: {
      Name: '',
      Machine: '',
      Sensor: '',
    },
  })

  const { getMachines } = useGetMachines()
  const { getSensors } = useGetSensors()
  const { createMonitoringPoint, loading } = useCreateMonitoringPoint()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalError, setModalError] = useState('')

  const [machineOptions, setMachineOptions] = useState<
    Array<{ _id: string; name: string }>
  >([])
  const [sensorOptions, setSensorOptions] = useState<
    Array<{ _id: string; name: string; model: string }>
  >([])

  const selectedMachineId = watch('Machine')

  useEffect(() => {
    if (open) {
      const loadMachines = async () => {
        const response = await getMachines()
        if (response.success && Array.isArray(response.data)) {
          const options = response.data.map((machine: MachinePresenter) => ({
            _id: machine._id,
            name: machine.Name,
          }))
          setMachineOptions(options)
        }
      }
      loadMachines()
    }
  }, [open, getMachines])

  useEffect(() => {
    if (selectedMachineId) {
      const loadSensors = async () => {
        const sensors = await getSensors(selectedMachineId)
        if (sensors.success && Array.isArray(sensors.data)) {
          const options = sensors.data.map((sensor: SensorPresenter) => ({
            _id: sensor._id,
            name: sensor.Code,
            model: sensor.Model,
          }))
          setSensorOptions(options)
        }
      }
      loadSensors()
    }
  }, [selectedMachineId, getSensors])

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
          <Typography variant="h5">Registrar Ponto de Monitoramento</Typography>
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
                label="Nome"
                {...register('Name')}
                error={!!errors.Name}
                helperText={errors.Name?.message}
                disabled={loading}
                fullWidth
              />

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
                      label="Machine"
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

              <Controller
                name="Sensor"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={!!error}
                    disabled={loading}
                  >
                    <InputLabel>Sensors</InputLabel>
                    <Select
                      label="Sensor"
                      {...field}
                    >
                      {sensorOptions.length === 0 ? (
                        <MenuItem disabled>Carregando...</MenuItem>
                      ) : (
                        sensorOptions.map(sensor => (
                          <MenuItem
                            key={sensor.name}
                            value={sensor._id}
                          >
                            {sensor.name + ' | ' + sensor.model}
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
