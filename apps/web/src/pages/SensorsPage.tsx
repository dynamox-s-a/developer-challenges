import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'

import { selectMachines } from '../features/machines/machinesSelectors'
import { fetchMonitoringPointsThunk } from '../features/monitoring-points/monitoringPointsThunks'
import {
  selectMonitoringPoints,
  selectMonitoringPointsListError,
  selectMonitoringPointsListLoading
} from '../features/monitoring-points/monitoringPointsSelectors'
import { clearSensorsMutationErrors } from '../features/sensors/sensorsSlice'
import {
  createSensorThunk,
  deleteSensorThunk,
  updateSensorThunk
} from '../features/sensors/sensorsThunks'
import {
  selectSensorCreateError,
  selectSensorCreating,
  selectSensorDeleteError,
  selectSensorDeleting,
  selectSensorUpdateError,
  selectSensorUpdating
} from '../features/sensors/sensorsSelectors'
import type { Sensor, SensorModel } from '../features/sensors/sensorsTypes'
import { ConfirmDialog } from '../dialogs/ConfirmDialog'
import { SensorEditDialog } from '../dialogs/SensorEditDialog'

const SENSOR_MODEL_OPTIONS: Array<{ value: SensorModel; label: string }> = [
  { value: 'TcAg', label: 'TcAg' },
  { value: 'TcAs', label: 'TcAs' },
  { value: 'HF_PLUS', label: 'HF+' }
]

export function SensorsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { machineId } = useParams<{ machineId: string }>()

  const machines = useAppSelector(selectMachines)
  const monitoringPoints = useAppSelector(selectMonitoringPoints)
  const loading = useAppSelector(selectMonitoringPointsListLoading)
  const error = useAppSelector(selectMonitoringPointsListError)

  const submitting = useAppSelector(selectSensorCreating)
  const submitError = useAppSelector(selectSensorCreateError)
  const editLoading = useAppSelector(selectSensorUpdating)
  const editError = useAppSelector(selectSensorUpdateError)
  const deleteLoading = useAppSelector(selectSensorDeleting)
  const deleteError = useAppSelector(selectSensorDeleteError)

  const machine = useMemo(
    () =>
      machines.find((currentMachine) => currentMachine.uuid === machineId) ??
      monitoringPoints[0]?.machine ??
      null,
    [machineId, machines, monitoringPoints]
  )

  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [monitoringPointUuid, setMonitoringPointUuid] = useState('')
  const [sensorUniqueId, setSensorUniqueId] = useState('')
  const [model, setModel] = useState<SensorModel>('HF_PLUS')

  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null)
  const [editUniqueId, setEditUniqueId] = useState('')
  const [editModel, setEditModel] = useState<SensorModel>('HF_PLUS')

  const [sensorToDelete, setSensorToDelete] = useState<Sensor | null>(null)

  const loadData = useCallback(
    async (activeCheck: () => boolean) => {
      if (!machineId) {
        return
      }

      try {
        await dispatch(
          fetchMonitoringPointsThunk({
            machineUuid: machineId,
            page: 1,
            limit: 100,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          })
        ).unwrap()

        if (!activeCheck()) return
        setHasLoadedOnce(true)
      } catch {
        /* empty */
      }
    },
    [dispatch, machineId]
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
          (item): item is typeof item & { sensor: Sensor } => !!item.sensor
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availablePoints])

  const formatSensorUniqueId = (value: string): string => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '')

    const letters = cleaned
      .slice(0, 6)
      .replace(/[^A-Za-z]/g, '')
      .toUpperCase()
    const numbers = cleaned.slice(6, 9).replace(/[^0-9]/g, '')

    if (letters.length === 6) {
      return `${letters}-${numbers}`
    }

    return letters
  }

  const handleSensorUniqueIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatSensorUniqueId(event.target.value)
    setSensorUniqueId(formatted)
  }

  const createSensor = async () => {
    if (!monitoringPointUuid || !sensorUniqueId.trim()) return

    try {
      await dispatch(
        createSensorThunk({
          monitoringPointUuid,
          sensorUniqueId: sensorUniqueId.trim(),
          model
        })
      ).unwrap()

      setSensorUniqueId('')
      await loadData(() => true)
    } catch {
      // slice stores the API error.
    }
  }

  const openEditDialog = (sensor: Sensor) => {
    dispatch(clearSensorsMutationErrors())
    setEditingSensor(sensor)
    setEditUniqueId(sensor.sensorUniqueId)
    setEditModel(sensor.model)
  }

  const closeEditDialog = () => {
    if (editLoading) return
    setEditingSensor(null)
  }

  const updateSensor = async () => {
    if (!editingSensor) return

    try {
      await dispatch(
        updateSensorThunk({
          uuid: editingSensor.uuid,
          sensorUniqueId: editUniqueId.trim().toUpperCase(),
          model: editModel
        })
      ).unwrap()
      setEditingSensor(null)
      await loadData(() => true)
    } catch {
      // slice stores the API error.
    }
  }

  const requestDeleteSensor = (sensor: Sensor) => {
    dispatch(clearSensorsMutationErrors())
    setSensorToDelete(sensor)
  }

  const closeDeleteDialog = () => {
    if (deleteLoading) return
    setSensorToDelete(null)
  }

  const confirmDeleteSensor = async () => {
    if (!sensorToDelete) return

    try {
      await dispatch(deleteSensorThunk(sensorToDelete.uuid)).unwrap()
      setSensorToDelete(null)
      await loadData(() => true)
    } catch {
      // slice stores the API error.
    }
  }

  if (loading && !hasLoadedOnce) {
    return (
      <Box display='flex' justifyContent='center' p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error && !hasLoadedOnce) {
    return <Alert severity='error'>{error}</Alert>
  }

  if (!machineId) {
    return <Alert severity='error'>Machine ID inválido</Alert>
  }

  return (
    <Box>
      <Stack direction='row' alignItems='center' spacing={1} mb={1}>
        <IconButton
          onClick={() =>
            navigate(`/app/machines/${machineId}/monitoring-points`)
          }
          size='small'
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h5'>Sensores - {machine?.name}</Typography>
      </Stack>
      <Typography color='text.secondary' gutterBottom>
        Tipo: {machine?.type}
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box mt={3}>
        <Typography variant='h6' gutterBottom>
          Associar Sensor
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <TextField
            select
            label='Ponto de Monitoramento'
            placeholder='Selecione um ponto'
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
            onChange={handleSensorUniqueIdChange}
            slotProps={{ htmlInput: { maxLength: 10 } }}
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
              submitting || sensorUniqueId.length !== 10 || !monitoringPointUuid
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
                      onClick={() => requestDeleteSensor(item.sensor)}
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

      <SensorEditDialog
        open={!!editingSensor}
        sensorUniqueId={editUniqueId}
        model={editModel}
        error={editError}
        loading={editLoading}
        onClose={closeEditDialog}
        onSave={() => void updateSensor()}
        onSensorUniqueIdChange={setEditUniqueId}
        onModelChange={setEditModel}
      />

      <ConfirmDialog
        open={!!sensorToDelete}
        title='Excluir sensor'
        description={
          sensorToDelete
            ? `Deseja excluir o sensor "${sensorToDelete.sensorUniqueId}"?`
            : ''
        }
        confirmLabel='Excluir'
        cancelLabel='Cancelar'
        loading={deleteLoading}
        errorMessage={deleteError}
        onClose={closeDeleteDialog}
        onConfirm={() => void confirmDeleteSensor()}
      />
    </Box>
  )
}
