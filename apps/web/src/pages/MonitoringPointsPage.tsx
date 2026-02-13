import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Skeleton,
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
  Tooltip,
  Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectMachines } from '../features/machines/machinesSelectors'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { MonitoringPointEditDialog } from '../components/MonitoringPointEditDialog'
import {
  deleteMonitoringPointThunk,
  fetchMonitoringPointsThunk,
  updateMonitoringPointThunk,
  createMonitoringPointThunk
} from '../features/monitoring-points/monitoringPointsThunks'
import { clearMonitoringPointsMutationErrors } from '../features/monitoring-points/monitoringPointsSlice'
import {
  selectMonitoringPointCreateError,
  selectMonitoringPointCreating,
  selectMonitoringPointDeleteError,
  selectMonitoringPointDeleting,
  selectMonitoringPointUpdateError,
  selectMonitoringPointUpdating,
  selectMonitoringPoints,
  selectMonitoringPointsListError,
  selectMonitoringPointsPagination
} from '../features/monitoring-points/monitoringPointsSelectors'
import type {
  MonitoringPoint,
  MonitoringSortBy,
  SortOrder
} from '../features/monitoring-points/monitoringPointsTypes'

const PAGE_SIZE = 5
const DEFAULT_SORT_BY: MonitoringSortBy = 'createdAt'
const DEFAULT_SORT_ORDER: SortOrder = 'desc'

export function MonitoringPointsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { machineId } = useParams<{ machineId: string }>()

  const machines = useAppSelector(selectMachines)
  const monitoringPoints = useAppSelector(selectMonitoringPoints)
  const pagination = useAppSelector(selectMonitoringPointsPagination)
  const error = useAppSelector(selectMonitoringPointsListError)
  const creating = useAppSelector(selectMonitoringPointCreating)
  const createError = useAppSelector(selectMonitoringPointCreateError)
  const editLoading = useAppSelector(selectMonitoringPointUpdating)
  const editError = useAppSelector(selectMonitoringPointUpdateError)
  const deleteLoading = useAppSelector(selectMonitoringPointDeleting)
  const deleteError = useAppSelector(selectMonitoringPointDeleteError)

  const machine = useMemo(
    () =>
      machineId
        ? (machines.find(
            (currentMachine) => currentMachine.uuid === machineId
          ) ?? null)
        : null,
    [machineId, machines]
  )

  const [loadingMode, setLoadingMode] = useState<'initial' | 'table' | null>(
    'initial'
  )
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [newPointName, setNewPointName] = useState('')
  const [monitoringPointToDelete, setMonitoringPointToDelete] =
    useState<MonitoringPoint | null>(null)
  const [editingMonitoringPoint, setEditingMonitoringPoint] =
    useState<MonitoringPoint | null>(null)
  const [editName, setEditName] = useState('')

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
      const isInitialLoad = !hasLoadedOnce
      setLoadingMode(isInitialLoad ? 'initial' : 'table')

      try {
        const response = await dispatch(
          fetchMonitoringPointsThunk({
            ...(machineId ? { machineUuid: machineId } : {}),
            page,
            limit: PAGE_SIZE,
            sortBy,
            sortOrder
          })
        ).unwrap()

        if (!activeCheck()) return

        if (
          response.pagination.totalPages > 0 &&
          page > response.pagination.totalPages
        ) {
          setTableParams({ page: response.pagination.totalPages })
          return
        }

        setHasLoadedOnce(true)
      } finally {
        if (activeCheck()) setLoadingMode(null)
      }
    },
    [
      dispatch,
      hasLoadedOnce,
      machineId,
      page,
      setTableParams,
      sortBy,
      sortOrder
    ]
  )

  useEffect(() => {
    let active = true

    void loadData(() => active)

    return () => {
      active = false
    }
  }, [loadData])

  const createMonitoringPoint = async () => {
    if (!machineId || !newPointName.trim()) return

    try {
      await dispatch(
        createMonitoringPointThunk({
          name: newPointName.trim(),
          machineUuid: machineId
        })
      ).unwrap()

      setNewPointName('')
      if (page !== 1) {
        setTableParams({ page: 1 })
      } else {
        await loadData(() => true)
      }
    } catch {
      /* empty */
    }
  }

  const openEditDialog = (monitoringPoint: MonitoringPoint) => {
    dispatch(clearMonitoringPointsMutationErrors())
    setEditingMonitoringPoint(monitoringPoint)
    setEditName(monitoringPoint.name)
  }

  const closeEditDialog = () => {
    if (editLoading) return
    setEditingMonitoringPoint(null)
  }

  const updateMonitoringPoint = async () => {
    if (!editingMonitoringPoint || !editName.trim()) return

    try {
      await dispatch(
        updateMonitoringPointThunk({
          uuid: editingMonitoringPoint.uuid,
          name: editName.trim()
        })
      ).unwrap()

      setEditingMonitoringPoint(null)
      await loadData(() => true)
    } catch {
      /* empty */
    }
  }

  const requestDeleteMonitoringPoint = (monitoringPoint: MonitoringPoint) => {
    dispatch(clearMonitoringPointsMutationErrors())
    setMonitoringPointToDelete(monitoringPoint)
  }

  const closeDeleteDialog = () => {
    if (deleteLoading) return
    setMonitoringPointToDelete(null)
  }

  const confirmDeleteMonitoringPoint = async () => {
    if (!monitoringPointToDelete) return

    try {
      await dispatch(
        deleteMonitoringPointThunk(monitoringPointToDelete.uuid)
      ).unwrap()
      setMonitoringPointToDelete(null)
      await loadData(() => true)
    } catch {
      /* empty */
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

  if (loadingMode === 'initial') {
    return (
      <Box display='flex' justifyContent='center' p={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (error && !hasLoadedOnce) {
    return <Alert severity='error'>{error}</Alert>
  }

  const isTableLoading = loadingMode === 'table'
  const skeletonRows = 3

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
        {error && (
          <Alert severity='error' sx={{ mb: 1.5 }}>
            {error}
          </Alert>
        )}
        {!isTableLoading && monitoringPoints.length === 0 ? (
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
                {isTableLoading
                  ? Array.from({ length: skeletonRows }).map((_, index) => (
                      <TableRow key={`monitoring-skeleton-${index}`}>
                        {!machineId && (
                          <TableCell>
                            <Skeleton variant='text' width='85%' />
                          </TableCell>
                        )}
                        {!machineId && (
                          <TableCell>
                            <Skeleton variant='text' width='65%' />
                          </TableCell>
                        )}
                        <TableCell>
                          <Skeleton variant='text' width='80%' />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='text' width='70%' />
                        </TableCell>
                        <TableCell align='right'>
                          <Skeleton
                            variant='rounded'
                            width={64}
                            height={24}
                            sx={{ ml: 'auto' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  : monitoringPoints.map((monitoringPoint) => (
                      <TableRow key={monitoringPoint.uuid} hover>
                        {!machineId && (
                          <TableCell>{monitoringPoint.machine.name}</TableCell>
                        )}
                        {!machineId && (
                          <TableCell>{monitoringPoint.machine.type}</TableCell>
                        )}
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
                            {monitoringPoint.sensor?.hasTelemetry ? (
                              <Tooltip title='Visualizar telemetria'>
                                <IconButton
                                  size='small'
                                  onClick={() =>
                                    navigate(
                                      `/app/machines/${machineId}/telemetry?sensorUuid=${monitoringPoint.sensor?.uuid}`
                                    )
                                  }
                                >
                                  <ShowChartIcon fontSize='small' />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <IconButton size='small' disabled>
                                <ShowChartIcon fontSize='small' />
                              </IconButton>
                            )}
                            <IconButton
                              size='small'
                              onClick={() => openEditDialog(monitoringPoint)}
                            >
                              <EditIcon fontSize='small' />
                            </IconButton>
                            <IconButton
                              size='small'
                              onClick={() =>
                                requestDeleteMonitoringPoint(monitoringPoint)
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
            disabled={pagination.total === 0}
          >
            Gerenciar sensores
          </Button>
        </Stack>
      )}

      <MonitoringPointEditDialog
        open={!!editingMonitoringPoint}
        name={editName}
        error={editError}
        loading={editLoading}
        onClose={closeEditDialog}
        onSave={() => void updateMonitoringPoint()}
        onNameChange={setEditName}
      />

      <ConfirmDialog
        open={!!monitoringPointToDelete}
        title='Excluir ponto de monitoramento'
        description={
          monitoringPointToDelete
            ? `Deseja excluir o ponto "${monitoringPointToDelete.name}"?`
            : ''
        }
        confirmLabel='Excluir'
        cancelLabel='Cancelar'
        loading={deleteLoading}
        errorMessage={deleteError}
        onClose={closeDeleteDialog}
        onConfirm={() => void confirmDeleteMonitoringPoint()}
      />
    </Box>
  )
}
