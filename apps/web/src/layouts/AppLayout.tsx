import { useState, useMemo, useEffect } from 'react'
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { selectAuthUser } from '../features/auth/authSelectors'
import { fetchMachinesThunk } from '../features/machines/machinesThunks'
import {
  selectMachines,
  selectMachinesLoading
} from '../features/machines/machinesSelectors'

const DRAWER_WIDTH = 280

export function AppLayout() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectAuthUser)
  const navigate = useNavigate()
  const { machineId } = useParams()
  const [searchQuery, setSearchQuery] = useState('')

  const machines = useAppSelector(selectMachines)
  const loading = useAppSelector(selectMachinesLoading)

  useEffect(() => {
    dispatch(fetchMachinesThunk())
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
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List sx={{ pt: 0, overflow: 'auto', minHeight: 0 }}>
              {filteredMachines.map((machine) => (
                <ListItemButton
                  key={machine.uuid}
                  selected={machine.uuid === machineId}
                  onClick={() => handleMachineClick(machine.uuid)}
                >
                  <ListItemText
                    primary={machine.name}
                    secondary={machine.type}
                  />
                </ListItemButton>
              ))}
            </List>
          )}

          {!loading && filteredMachines.length === 0 && (
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
    </Box>
  )
}
