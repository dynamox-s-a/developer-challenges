import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import type { ApiResponse } from '../types/api.types'
import type { Machine } from '../features/machines/machinesTypes'
import { getApiErrorMessage } from '../utils/apiError'

type SensorModel = 'TcAg' | 'TcAs' | 'HF_PLUS'

interface Sensor {
  uuid: string
  sensorUniqueId: string
  model: SensorModel
}

interface MonitoringPoint {
  uuid: string
  name: string
  sensor: Sensor | null
}

interface MonitoringPointsPayload {
  data: MonitoringPoint[]
}

type MachineResponse = ApiResponse<Machine>
type MonitoringPointsResponse = ApiResponse<MonitoringPointsPayload>

const SENSOR_MODEL_OPTIONS: Array<{ value: SensorModel; label: string }> = [
  { value: 'TcAg', label: 'TcAg' },
  { value: 'TcAs', label: 'TcAs' },
  { value: 'HF_PLUS', label: 'HF+' }
]

export function SensorsPage() {
  const { machineId } = useParams<{ machineId: string }>()
  const [machine, setMachine] = useState<Machine | null>(null)
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [monitoringPointUuid, setMonitoringPointUuid] = useState('')
  const [sensorUniqueId, setSensorUniqueId] = useState('')
  const [model, setModel] = useState<SensorModel>('HF_PLUS')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null)
  const [editUniqueId, setEditUniqueId] = useState('')
  const [editModel, setEditModel] = useState<SensorModel>('HF_PLUS')
  const [editError, setEditError] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  const loadData = useCallback(
    async (activeCheck: () => boolean) => {
      if (!machineId) {
        setError('Machine ID inválido')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [machineRes, monitoringPointsRes] = await Promise.all([
          api.get<MachineResponse>(`/machines/${machineId}`),
          api.get<MonitoringPointsResponse>('/monitoring-points', {
            params: { machineUuid: machineId, limit: 100 }
          })
        ])

        if (!activeCheck()) return

        setMachine(machineRes.data.data)
        setMonitoringPoints(monitoringPointsRes.data.data.data)
      } catch (requestError) {
        if (!activeCheck()) return
        setError(getApiErrorMessage(requestError, 'Erro ao carregar sensores'))
      } finally {
        if (activeCheck()) setLoading(false)
      }
    },
    [machineId]
  )

  useEffect(() => {
    let active = true
    void loadData(() => active)
    return () => {
      active = false
    }
  }, [loadData])

  const availablePoints = useMemo(
    () => monitoringPoints.filter((item) => !item.sensor),
    [monitoringPoints]
  )

  const existingSensors = useMemo(
    () =>
      monitoringPoints
        .filter(
          (item): item is MonitoringPoint & { sensor: Sensor } => !!item.sensor
        )
        .map((item) => ({
          monitoringPointUuid: item.uuid,
          monitoringPointName: item.name,
          sensor: item.sensor
        })),
    [monitoringPoints]
  )

  useEffect(() => {
    if (!monitoringPointUuid && availablePoints.length > 0) {
      setMonitoringPointUuid(availablePoints[0].uuid)
    }
  }, [availablePoints, monitoringPointUuid])

  const createSensor = async () => {
    if (!monitoringPointUuid || !sensorUniqueId.trim()) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      await api.post('/sensors', {
        monitoringPointUuid,
        sensorUniqueId: sensorUniqueId.trim().toUpperCase(),
        model
      })

      setSensorUniqueId('')
      await loadData(() => true)
    } catch (requestError) {
      setSubmitError(getApiErrorMessage(requestError, 'Erro ao criar sensor'))
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (sensor: Sensor) => {
    setEditingSensor(sensor)
    setEditUniqueId(sensor.sensorUniqueId)
    setEditModel(sensor.model)
    setEditError(null)
  }

  const closeEditDialog = () => {
    if (editLoading) return
    setEditingSensor(null)
  }

  const updateSensor = async () => {
    if (!editingSensor) return

    setEditLoading(true)
    setEditError(null)

    try {
      await api.patch(`/sensors/${editingSensor.uuid}`, {
        sensorUniqueId: editUniqueId.trim().toUpperCase(),
        model: editModel
      })
      setEditingSensor(null)
      await loadData(() => true)
    } catch (requestError) {
      setEditError(getApiErrorMessage(requestError, 'Erro ao atualizar sensor'))
    } finally {
      setEditLoading(false)
    }
  }

  const deleteSensor = async (uuid: string) => {
    const confirmed = window.confirm('Deseja excluir este sensor?')
    if (!confirmed) return

    setSubmitError(null)

    try {
      await api.delete(`/sensors/${uuid}`)
      await loadData(() => true)
    } catch (requestError) {
      setSubmitError(getApiErrorMessage(requestError, 'Erro ao deletar sensor'))
    }
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity='error'>{error}</Alert>
  }

  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Sensores - {machine?.name}
      </Typography>
      <Typography color='text.secondary' gutterBottom>
        Tipo: {machine?.type}
      </Typography>

      <Box mt={3}>
        <Typography variant='h6' gutterBottom>
          Associar Sensor
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField
            select
            label='Monitoring Point'
            value={monitoringPointUuid}
            onChange={(event) => setMonitoringPointUuid(event.target.value)}
            sx={{ minWidth: 260 }}
            disabled={availablePoints.length === 0}
          >
            {availablePoints.map((point) => (
              <MenuItem key={point.uuid} value={point.uuid}>
                {point.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Sensor Unique ID'
            placeholder='AAAAAA-999'
            value={sensorUniqueId}
            onChange={(event) => setSensorUniqueId(event.target.value)}
          />
          <TextField
            select
            label='Modelo'
            value={model}
            onChange={(event) => setModel(event.target.value as SensorModel)}
            sx={{ minWidth: 140 }}
          >
            {SENSOR_MODEL_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant='contained'
            onClick={() => void createSensor()}
            disabled={
              submitting || !sensorUniqueId.trim() || !monitoringPointUuid
            }
          >
            Salvar
          </Button>
        </Stack>
        {availablePoints.length === 0 && (
          <Alert severity='info' sx={{ mt: 1.5 }}>
            Todos os Pontos de Monitoramento já possuem sensor associado.
          </Alert>
        )}
        {submitError && (
          <Alert severity='error' sx={{ mt: 1.5 }}>
            {submitError}
          </Alert>
        )}
      </Box>

      <Box mt={3}>
        <Typography variant='h6' gutterBottom>
          Sensores associados ({existingSensors.length})
        </Typography>
        {existingSensors.length === 0 ? (
          <Typography color='text.secondary'>
            Nenhum sensor cadastrado para esta máquina.
          </Typography>
        ) : (
          <List disablePadding>
            {existingSensors.map((item) => (
              <ListItem
                key={item.sensor.uuid}
                divider
                secondaryAction={
                  <Stack direction='row' spacing={0.5}>
                    <IconButton
                      size='small'
                      onClick={() => openEditDialog(item.sensor)}
                    >
                      <EditIcon fontSize='small' />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => void deleteSensor(item.sensor.uuid)}
                    >
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemText
                  primary={`${item.sensor.sensorUniqueId} (${item.sensor.model === 'HF_PLUS' ? 'HF+' : item.sensor.model})`}
                  secondary={`Monitoring Point: ${item.monitoringPointName}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Dialog
        open={!!editingSensor}
        onClose={closeEditDialog}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>Editar Sensor</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Stack spacing={2}>
            {editError && <Alert severity='error'>{editError}</Alert>}
            <TextField
              label='Sensor Unique ID'
              placeholder='AAAAAA-999'
              value={editUniqueId}
              onChange={(event) => setEditUniqueId(event.target.value)}
            />
            <TextField
              select
              label='Modelo'
              value={editModel}
              onChange={(event) =>
                setEditModel(event.target.value as SensorModel)
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
        <DialogActions>
          <Button onClick={closeEditDialog} disabled={editLoading}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={() => void updateSensor()}
            disabled={editLoading || !editUniqueId.trim()}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
