import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import type { ApiResponse } from '../types/api.types'
import type { Machine } from '../features/machines/machinesTypes'

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

type MachineResponse = ApiResponse<Machine>
type MonitoringPointsResponse = ApiResponse<MonitoringPointsPayload>

export function MonitoringPointsPage() {
  const { machineId } = useParams<{ machineId: string }>()
  const [machine, setMachine] = useState<Machine | null>(null)
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!machineId) {
      setError('Machine ID inválido')
      setLoading(false)
      return
    }

    let active = true

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const [machineData, monitoringPointsData] = await Promise.all([
          api.get<MachineResponse>(`/machines/${machineId}`),
          api.get<MonitoringPointsResponse>('/monitoring-points', {
            params: { machineUuid: machineId }
          })
        ])

        if (!active) return

        setMachine(machineData.data.data)
        setMonitoringPoints(monitoringPointsData.data.data.data)
      } catch {
        if (!active) return
        setError('Erro ao carregar dados da máquina e monitoring points')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [machineId])

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
        Monitoring Points - {machine.name}
      </Typography>
      <Typography color='text.secondary' gutterBottom>
        Tipo: {machine.type}
      </Typography>

      <Box mt={3}>
        <Typography variant='h6' gutterBottom>
          Lista de Monitoring Points ({monitoringPoints.length})
        </Typography>

        {monitoringPoints.length === 0 ? (
          <Typography color='text.secondary'>
            Nenhum monitoring point cadastrado para esta máquina.
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
    </Box>
  )
}
