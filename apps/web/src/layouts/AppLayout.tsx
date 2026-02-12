import { useState, useMemo, useEffect } from 'react'
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/EditOutlined'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { selectAuthUser } from '../features/auth/authSelectors'
import type {
  CreateMachineInput,
  Machine
} from '../features/machines/machinesTypes'
import {
  createMachineThunk,
  deleteMachineThunk,
  fetchMachinesThunk,
  updateMachineThunk
} from '../features/machines/machinesThunks'
import { selectMachines } from '../features/machines/machinesSelectors'
import { MachineCreationDialog } from '../components/MachineCreationDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'

const DRAWER_WIDTH = 280

export function AppLayout() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)
  const navigate = useNavigate()
  const { machineId } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<CreateMachineInput['type']>('Pump')
  const [formError, setFormError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [machineToDelete, setMachineToDelete] = useState<Machine | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const machines = useAppSelector(selectMachines)

  useEffect(() => {
    let active = true

    const loadMachines = async () => {
      setListLoading(true)
      setListError(null)
      try {
        await dispatch(fetchMachinesThunk()).unwrap()
      } catch (error) {
        if (!active) return
        setListError(
          typeof error === 'string' ? error : 'Falha ao carregar máquinas'
        )
      } finally {
        if (active) setListLoading(false)
      }
    }

    void loadMachines()

    return () => {
      active = false
    }
  }, [dispatch])

  const filteredMachines = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return machines
    return machines.filter(
      (machine) =>
        machine.name.toLowerCase().includes(query) ||
        machine.type.toLowerCase().includes(query)
    )
  }, [searchQuery, machines])

  const handleMachineClick = (id: string) => {
    navigate(`/app/machines/${id}/monitoring-points`)
  }

  const openCreateDialog = () => {
    setEditingMachine(null)
    setFormName('')
    setFormType('Pump')
    setFormError(null)
    setDialogOpen(true)
  }

  const openEditDialog = (machine: Machine) => {
    setEditingMachine(machine)
    setFormName(machine.name)
    setFormType(machine.type as CreateMachineInput['type'])
    setFormError(null)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    if (actionLoading) return
    setDialogOpen(false)
  }

  const saveMachine = async () => {
    setFormError(null)
    setActionLoading(true)

    try {
      if (editingMachine) {
        const updated = await dispatch(
          updateMachineThunk({
            uuid: editingMachine.uuid,
            data: { name: formName, type: formType }
          })
        ).unwrap()
        setDialogOpen(false)
        navigate(`/app/machines/${updated.uuid}/monitoring-points`)
      } else {
        const created = await dispatch(
          createMachineThunk({ name: formName, type: formType })
        ).unwrap()
        setDialogOpen(false)
        navigate(`/app/machines/${created.uuid}/monitoring-points`)
      }
    } catch (error) {
      setFormError(typeof error === 'string' ? error : 'Erro ao salvar máquina')
    } finally {
      setActionLoading(false)
    }
  }

  const removeMachine = async (machine: Machine) => {
    setDeleteLoading(true)
    try {
      await dispatch(deleteMachineThunk(machine.uuid)).unwrap()
      if (machine.uuid === machineId) navigate('/app')
    } catch (error) {
      setListError(
        typeof error === 'string' ? error : 'Falha ao deletar máquina'
      )
    } finally {
      setDeleteLoading(false)
      setMachineToDelete(null)
    }
  }

  const requestDeleteMachine = (machine: Machine) => {
    setMachineToDelete(machine)
    setListError(null)
  }

  const closeDeleteDialog = () => {
    if (deleteLoading) return
    setMachineToDelete(null)
  }

  const confirmDeleteMachine = async () => {
    if (!machineToDelete) return
    await removeMachine(machineToDelete)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar
        position='static'
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant='h6' sx={{ flex: 1 }} fontWeight={700}>
            Dynamox
          </Typography>
          <Typography variant='body2' sx={{ mr: 2 }}>
            Olá, {user?.name ?? 'usuário'}
          </Typography>
          <Button color='inherit' onClick={() => dispatch(logout())}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Drawer
          variant='permanent'
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              position: 'relative'
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size='small'
              placeholder='Buscar máquina…'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              fullWidth
              sx={{ mt: 1.5 }}
              variant='contained'
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
            >
              Nova máquina
            </Button>
          </Box>

          {listError && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Alert severity='error'>{listError}</Alert>
            </Box>
          )}
          {listLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List sx={{ pt: 0, overflow: 'auto', minHeight: 0 }}>
              {filteredMachines.map((machine) => (
                <ListItem
                  key={machine.uuid}
                  disablePadding
                  secondaryAction={
                    <Stack direction='row' spacing={0.5}>
                      <IconButton
                        edge='end'
                        aria-label='Editar máquina'
                        size='small'
                        onClick={(event) => {
                          event.stopPropagation()
                          openEditDialog(machine)
                        }}
                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                      <IconButton
                        edge='end'
                        aria-label='Excluir máquina'
                        size='small'
                        onClick={(event) => {
                          event.stopPropagation()
                          requestDeleteMachine(machine)
                        }}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemButton
                    selected={machine.uuid === machineId}
                    onClick={() => handleMachineClick(machine.uuid)}
                  >
                    <ListItemText
                      primary={machine.name}
                      secondary={machine.type}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {!listLoading && filteredMachines.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant='body2' color='text.secondary' align='center'>
                Nenhuma máquina encontrada
              </Typography>
            </Box>
          )}
        </Drawer>
        <Box
          component='main'
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <MachineCreationDialog
        open={dialogOpen}
        editingMachine={editingMachine}
        formName={formName}
        formType={formType}
        formError={formError}
        actionLoading={actionLoading}
        onClose={closeDialog}
        onSave={() => void saveMachine()}
        onNameChange={setFormName}
        onTypeChange={setFormType}
      />
      <ConfirmDialog
        open={!!machineToDelete}
        title='Excluir máquina'
        description={
          machineToDelete
            ? `Deseja excluir a máquina "${machineToDelete.name}"?`
            : ''
        }
        confirmLabel='Excluir'
        cancelLabel='Cancelar'
        loading={deleteLoading}
        onClose={closeDeleteDialog}
        onConfirm={() => void confirmDeleteMachine()}
      />
    </Box>
  )
}
