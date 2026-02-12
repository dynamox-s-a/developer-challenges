import { useCallback, useEffect, useState } from 'react'
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
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'
import type { ApiResponse } from '../types/api.types'
import type { Machine } from '../features/machines/machinesTypes'
import { getApiErrorMessage } from '../utils/apiError'
import { useAppSelector } from '../app/hooks'
import { selectMachines } from '../features/machines/machinesSelectors'

interface Sensor {
  uuid: string
  sensorUniqueId: string
  model: string
}

interface MonitoringPoint {
  uuid: string
  name: string
  machine: {
    uuid: string
    name: string
    type: string
  }
  sensor: Sensor | null
}

interface MonitoringPointsPayload {
  data: MonitoringPoint[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface MonitoringPointResponse {
  uuid: string
  name: string
}

type MachineResponse = ApiResponse<Machine>
type MonitoringPointsResponse = ApiResponse<MonitoringPointsPayload>
type CreateMonitoringPointResponse = ApiResponse<MonitoringPointResponse>
type MonitoringSortBy =
  | 'machineName'
  | 'machineType'
  | 'name'
  | 'sensorModel'
  | 'createdAt'
type SortOrder = 'asc' | 'desc'

const PAGE_SIZE = 5
const DEFAULT_SORT_BY: MonitoringSortBy = 'createdAt'
const DEFAULT_SORT_ORDER: SortOrder = 'desc'

export function MonitoringPointsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { machineId } = useParams<{ machineId: string }>()
  const machines = useAppSelector(selectMachines)
  const machinesVersion = machines
    .map((machine) => `${machine.uuid}:${machine.name}:${machine.type}`)
    .join('|')
  const [machine, setMachine] = useState<Machine | null>(null)
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPointName, setNewPointName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [actionsError, setActionsError] = useState<string | null>(null)
  const [editingMonitoringPoint, setEditingMonitoringPoint] =
    useState<MonitoringPoint | null>(null)
  const [editName, setEditName] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0
  })

  const rawPage = Number(searchParams.get('page') ?? '1')
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage

  const rawSortBy = searchParams.get('sortBy')
  const allowedSortBy: MonitoringSortBy[] = [
    'machineName',
    'machineType',
    'name',
    'sensorModel',
    'createdAt'
  ]
  const sortBy = allowedSortBy.includes(rawSortBy as MonitoringSortBy)
    ? (rawSortBy as MonitoringSortBy)
    : DEFAULT_SORT_BY

  const rawSortOrder = searchParams.get('sortOrder')
  const sortOrder: SortOrder =
    rawSortOrder === 'asc' || rawSortOrder === 'desc'
      ? rawSortOrder
      : DEFAULT_SORT_ORDER

  const setTableParams = useCallback(
    (
      next: Partial<{
        page: number
        sortBy: MonitoringSortBy
        sortOrder: SortOrder
      }>
    ) => {
      const nextPage = next.page ?? page
      const nextSortBy = next.sortBy ?? sortBy
      const nextSortOrder = next.sortOrder ?? sortOrder
      setSearchParams({
        page: String(nextPage),
        sortBy: nextSortBy,
        sortOrder: nextSortOrder
      })
    },
    [page, sortBy, sortOrder, setSearchParams]
  )

  const loadData = useCallback(
    async (activeCheck: () => boolean) => {
      setLoading(true)
      setError(null)

      try {
        const [machineData, monitoringPointsData] = await Promise.all([
          machineId
            ? api.get<MachineResponse>(`/machines/${machineId}`)
            : Promise.resolve(null),
          api.get<MonitoringPointsResponse>('/monitoring-points', {
            params: {
              ...(machineId ? { machineUuid: machineId } : {}),
              page,
              limit: PAGE_SIZE,
              sortBy,
              sortOrder
            }
          })
        ])

        if (!activeCheck()) return

        const responsePagination = monitoringPointsData.data.data.pagination
        if (
          responsePagination.totalPages > 0 &&
          page > responsePagination.totalPages
        ) {
          setTableParams({ page: responsePagination.totalPages })
          return
        }

        setMachine(machineData?.data.data ?? null)
        setMonitoringPoints(monitoringPointsData.data.data.data)
        setPagination(responsePagination)
      } catch (requestError) {
        if (!activeCheck()) return
        setError(getApiErrorMessage(requestError, 'Erro ao carregar dados'))
      } finally {
        if (activeCheck()) setLoading(false)
      }
    },
    [machineId, page, sortBy, sortOrder, setTableParams]
  )

  useEffect(() => {
    let active = true

    void loadData(() => active)

    return () => {
      active = false
    }
  }, [machineId, loadData])

  useEffect(() => {
    if (!machineId) {
      void loadData(() => true)
      return
    }

    const selectedMachine =
      machines.find((currentMachine) => currentMachine.uuid === machineId) ??
      null

    if (selectedMachine) {
      setMachine(selectedMachine)
    }

    setMonitoringPoints((currentPoints) =>
      currentPoints.map((point) =>
        point.machine.uuid === machineId
          ? {
              ...point,
              machine: {
                ...point.machine,
                name: selectedMachine?.name ?? point.machine.name,
                type: selectedMachine?.type ?? point.machine.type
              }
            }
          : point
      )
    )
  }, [machineId, machines, machinesVersion, loadData])

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
      if (page !== 1) {
        setTableParams({ page: 1 })
      } else {
        await loadData(() => true)
      }
    } catch (requestError) {
      setCreateError(
        getApiErrorMessage(requestError, 'Erro ao criar ponto de monitoramento')
      )
    } finally {
      setCreating(false)
    }
  }

  const openEditDialog = (monitoringPoint: MonitoringPoint) => {
    setEditingMonitoringPoint(monitoringPoint)
    setEditName(monitoringPoint.name)
    setEditError(null)
  }

  const closeEditDialog = () => {
    if (editLoading) return
    setEditingMonitoringPoint(null)
  }

  const updateMonitoringPoint = async () => {
    if (!editingMonitoringPoint || !editName.trim()) return

    setEditLoading(true)
    setEditError(null)

    try {
      await api.patch(`/monitoring-points/${editingMonitoringPoint.uuid}`, {
        name: editName.trim()
      })
      setEditingMonitoringPoint(null)
      await loadData(() => true)
    } catch (requestError) {
      setEditError(
        getApiErrorMessage(
          requestError,
          'Erro ao atualizar ponto de monitoramento'
        )
      )
    } finally {
      setEditLoading(false)
    }
  }

  const deleteMonitoringPoint = async (uuid: string) => {
    const confirmed = window.confirm(
      'Deseja excluir este ponto de monitoramento?'
    )
    if (!confirmed) return

    setActionsError(null)

    try {
      await api.delete(`/monitoring-points/${uuid}`)
      await loadData(() => true)
    } catch (requestError) {
      setActionsError(
        getApiErrorMessage(
          requestError,
          'Erro ao deletar ponto de monitoramento'
        )
      )
    }
  }

  const handleSort = (nextSortBy: MonitoringSortBy) => {
    const nextSortOrder: SortOrder =
      sortBy === nextSortBy && sortOrder === 'asc' ? 'desc' : 'asc'
    setTableParams({
      page: 1,
      sortBy: nextSortBy,
      sortOrder: nextSortOrder
    })
  }

  const handlePageChange = (_event: unknown, nextPageZeroBased: number) => {
    setTableParams({ page: nextPageZeroBased + 1 })
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
        {machine
          ? `Pontos de Monitoramento - ${machine.name}`
          : 'Pontos de Monitoramento'}
      </Typography>
      {machineId && (
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
      )}

      <Box mt={3}>
        <Typography variant='h6' gutterBottom>
          Lista de Pontos de Monitoramento ({pagination.total})
        </Typography>
        {actionsError && (
          <Alert severity='error' sx={{ mb: 1.5 }}>
            {actionsError}
          </Alert>
        )}

        {monitoringPoints.length === 0 ? (
          <Typography color='text.secondary'>
            {machineId
              ? 'Nenhum ponto de monitoramento cadastrado para esta máquina.'
              : 'Nenhum ponto de monitoramento cadastrado.'}
          </Typography>
        ) : (
          <TableContainer component={Paper} variant='outlined'>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  {!machineId && (
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'machineName'}
                        direction={sortBy === 'machineName' ? sortOrder : 'asc'}
                        onClick={() => handleSort('machineName')}
                      >
                        Máquina
                      </TableSortLabel>
                    </TableCell>
                  )}
                  {!machineId && (
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'machineType'}
                        direction={sortBy === 'machineType' ? sortOrder : 'asc'}
                        onClick={() => handleSort('machineType')}
                      >
                        Tipo de Máquina
                      </TableSortLabel>
                    </TableCell>
                  )}
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'name'}
                      direction={sortBy === 'name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      Nome do Ponto de Monitoramento
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'sensorModel'}
                      direction={sortBy === 'sensorModel' ? sortOrder : 'asc'}
                      onClick={() => handleSort('sensorModel')}
                    >
                      Modelo do Sensor
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align='right'>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monitoringPoints.map((monitoringPoint) => (
                  <TableRow key={monitoringPoint.uuid} hover>
                    {!machineId && <TableCell>{monitoringPoint.machine.name}</TableCell>}
                    {!machineId && <TableCell>{monitoringPoint.machine.type}</TableCell>}
                    <TableCell>{monitoringPoint.name}</TableCell>
                    <TableCell>
                      {monitoringPoint.sensor
                        ? monitoringPoint.sensor.model
                        : 'Sem sensor'}
                    </TableCell>
                    <TableCell align='right'>
                      <Stack
                        direction='row'
                        spacing={0.5}
                        justifyContent='flex-end'
                      >
                        <IconButton
                          size='small'
                          onClick={() => openEditDialog(monitoringPoint)}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                          size='small'
                          onClick={() =>
                            void deleteMonitoringPoint(monitoringPoint.uuid)
                          }
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component='div'
              rowsPerPageOptions={[PAGE_SIZE]}
              rowsPerPage={PAGE_SIZE}
              count={pagination.total}
              page={page - 1}
              onPageChange={handlePageChange}
            />
          </TableContainer>
        )}
      </Box>

      {machineId && (
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
      )}

      <Dialog
        open={!!editingMonitoringPoint}
        onClose={closeEditDialog}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>Editar Ponto de Monitoramento</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          <Stack spacing={2}>
            {editError && <Alert severity='error'>{editError}</Alert>}
            <TextField
              label='Nome do ponto de monitoramento'
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} disabled={editLoading}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={() => void updateMonitoringPoint()}
            disabled={editLoading || !editName.trim()}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
