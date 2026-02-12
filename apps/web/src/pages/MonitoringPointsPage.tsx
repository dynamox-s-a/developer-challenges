import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import type { ApiResponse } from '../types/api.types'
import type { Machine } from '../features/machines/machinesTypes'
import { getApiErrorMessage } from '../utils/apiError'

interface Sensor {
  uuid: string
  sensorUniqueId: string
  model: string
}

interface MonitoringPoint {
  uuid: string
  name: string
  sensor: Sensor | null
}

interface MonitoringPointsPayload {
  data: MonitoringPoint[]
}

interface MonitoringPointResponse {
  uuid: string
  name: string
}

type MachineResponse = ApiResponse<Machine>
type MonitoringPointsResponse = ApiResponse<MonitoringPointsPayload>
type CreateMonitoringPointResponse = ApiResponse<MonitoringPointResponse>

export function MonitoringPointsPage() {
  const navigate = useNavigate()
  const { machineId } = useParams<{ machineId: string }>()
  const [machine, setMachine] = useState<Machine | null>(null)
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPointName, setNewPointName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

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
        const [machineData, monitoringPointsData] = await Promise.all([
          api.get<MachineResponse>(`/machines/${machineId}`),
          api.get<MonitoringPointsResponse>('/monitoring-points', {
            params: { machineUuid: machineId }
          })
        ])

        if (!activeCheck()) return

        setMachine(machineData.data.data)
        setMonitoringPoints(monitoringPointsData.data.data.data)
      } catch (requestError) {
        if (!activeCheck()) return
        setError(getApiErrorMessage(requestError, 'Erro ao carregar dados'))
      } finally {
        if (activeCheck()) setLoading(false)
      }
    },
    [machineId]
  )

  useEffect(() => {
    if (!machineId) {
      setError('Machine ID inválido')
      setLoading(false)
      return
    }

    let active = true

    void loadData(() => active)

    return () => {
      active = false
    }
  }, [machineId, loadData])

  const createMonitoringPoint = async () => {
    if (!machineId || !newPointName.trim()) return

    setCreating(true)
    setCreateError(null)

    try {
      await api.post<CreateMonitoringPointResponse>('/monitoring-points', {
        name: newPointName.trim(),
        machineUuid: machineId
      })
      setNewPointName('')
      await loadData(() => true)
    } catch (requestError) {
      setCreateError(
        getApiErrorMessage(requestError, 'Erro ao criar ponto de monitoramento')
      )
    } finally {
      setCreating(false)
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

  if (!machine) {
    return <Alert severity='warning'>Máquina não encontrada</Alert>
  }

  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Pontos de Monitoramento - {machine.name}
      </Typography>
      <Typography color='text.secondary' gutterBottom>
        Tipo: {machine.type}
      </Typography>

      <Box mt={3}>
        <Typography variant='h6' gutterBottom>
          Criar Ponto de Monitoramento
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            fullWidth
            label='Nome do ponto de monitoramento'
            value={newPointName}
            onChange={(event) => setNewPointName(event.target.value)}
          />
          <Button
            variant='contained'
            disabled={creating || !newPointName.trim()}
            onClick={() => void createMonitoringPoint()}
          >
            Criar
          </Button>
        </Stack>
        {createError && (
          <Alert severity='error' sx={{ mt: 1.5 }}>
            {createError}
          </Alert>
        )}
      </Box>

      <Box mt={3}>
        <Typography variant='h6' gutterBottom>
          Lista de Pontos de Monitoramento ({monitoringPoints.length})
        </Typography>

        {monitoringPoints.length === 0 ? (
          <Typography color='text.secondary'>
            Nenhum ponto de monitoramento cadastrado para esta máquina.
          </Typography>
        ) : (
          <List disablePadding>
            {monitoringPoints.map((monitoringPoint) => (
              <ListItem key={monitoringPoint.uuid} divider>
                <ListItemText
                  primary={monitoringPoint.name}
                  secondary={
                    monitoringPoint.sensor
                      ? `Sensor: ${monitoringPoint.sensor.model} (${monitoringPoint.sensor.sensorUniqueId})`
                      : 'Sem sensor vinculado'
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Stack direction='row' spacing={1} mt={3} justifyContent='flex-end'>
        <Button
          variant='outlined'
          onClick={() => navigate(`/app/machines/${machineId}/sensors`)}
        >
          Gerenciar sensores
        </Button>
        <Button
          variant='outlined'
          onClick={() => navigate(`/app/machines/${machineId}/telemetry`)}
        >
          Ir para telemetria
        </Button>
      </Stack>
    </Box>
  )
}
