import { useState, useEffect } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  AppBar, Toolbar, Typography, Breadcrumbs, Link, Container, Card, CardContent, Grid,
  Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, useMediaQuery, useTheme, IconButton
} from '@mui/material';
import { 
  Dashboard as DashIcon, PrecisionManufacturing, ExitToApp, Add as AddIcon, Sort as SortIcon, Widgets as WidgetsIcon 
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import MachinesPage from './MachinesPage';
import MonitoringPointsPage from './MonitoringPointsPage';
import { fetchAllMachines, createMachine } from '../features/machines/machineSlice';
import MenuIcon from '@mui/icons-material/Menu';

const ResponsiveDrawer = ({ 
  drawerWidth, 
  children 
}: { 
  drawerWidth: number; 
  children: React.ReactNode 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: '#692746' }}>
          <Toolbar>
            <IconButton onClick={() => setMobileOpen(!mobileOpen)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">HUB CONTROL</Typography>
          </Toolbar>
        </AppBar>
      )}
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{ width: drawerWidth }}
      >
        {children}
      </Drawer>
    </>
  );
};

const drawerWidth = 240;

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<'home' | 'machines'>('home');
  const [openModal, setOpenModal] = useState(false);
  const [openSortModal, setOpenSortModal] = useState(false);
  const [newMachine, setNewMachine] = useState({ name: '', type: 'Pump' });
  const [sortBy, setSortBy] = useState('point_name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const { user } = useAppSelector((state) => state.auth);
  const { total = 0, items: monitoringPoints = [] } = useAppSelector((state) => state.monitoringPoints);
  const { items: machines = [] } = useAppSelector((state) => state.machines);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeSensors = monitoringPoints.filter(point => point.sensor_model !== null).length;

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadData = async () => {
      try {
        const result = await dispatch(fetchAllMachines());
        
        if (isMounted && fetchAllMachines.fulfilled.match(result)) {
        }
      } catch (error) {
        if (isMounted) {
          console.error('Erro ao carregar máquinas:', error);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateMachine = async () => {
    if (newMachine.name.trim()) {
      await dispatch(createMachine({ 
        name: newMachine.name, 
        type: newMachine.type
      }));
      setOpenModal(false);
      setNewMachine({ name: '', type: 'Pump' });
      dispatch(fetchAllMachines());
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ResponsiveDrawer drawerWidth={drawerWidth}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#692746', color: 'white' },
          }}
        >
          <Toolbar><Typography variant="h6" sx={{ fontWeight: 'bold' }}>HUB CONTROL</Typography></Toolbar>
          <List sx={{ flexGrow: 1 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setCurrentView('home')} selected={currentView === 'home'}>
                <ListItemIcon sx={{ color: 'white' }}><DashIcon /></ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setCurrentView('machines')} selected={currentView === 'machines'}>
                <ListItemIcon sx={{ color: 'white' }}><PrecisionManufacturing /></ListItemIcon>
                <ListItemText primary="Máquinas" />
              </ListItemButton>
            </ListItem>
          </List>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ color: '#f4f6f8' }}>
                <ListItemIcon sx={{ color: '#f4f6f8' }}><ExitToApp /></ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </ResponsiveDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
          <Toolbar sx={{ justifyContent: 'space-between', px: '0 !important' }}>
            <Breadcrumbs>
              <Link underline="hover" color="inherit" href="#">Sistema</Link>
              <Typography color="text.primary">{currentView === 'home' ? 'Dashboard' : 'Máquinas'}</Typography>
            </Breadcrumbs>
            <Stack direction="row" spacing={3} alignItems="center">
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ 
                  bgcolor: '#692746', 
                  '&:hover': { bgcolor: '#521e36' },
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 3
                }}
                onClick={() => setOpenModal(true)}
              >
              Nova Máquina
              </Button>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Olá, {user?.name || "Breno Moreira"}
              </Typography>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ px: '0 !important' }}>
          {currentView === 'home' ? (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography color="textSecondary" variant="overline">Total de Máquinas</Typography>
                      <Typography variant="h4">{machines.length}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography color="textSecondary" variant="overline">Pontos Ativos</Typography>
                      <Typography variant="h4">{total}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography color="textSecondary" variant="overline">Sensores</Typography>
                      <Typography variant="h4">{activeSensors}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {total === 0 ? (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 8, 
                    px: 3,
                    bgcolor: '#fafafa',
                    borderRadius: 2,
                    border: '2px dashed #e0e0e0'
                  }}
                >
                  <WidgetsIcon sx={{ fontSize: 64, color: '#692746', mb: 2, opacity: 0.7 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhum ponto de monitoramento encontrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Crie uma máquina e adicione pontos de monitoramento para começar a visualizar dados.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2, mt: 1 }}>
                    <Button 
                      variant="text" 
                      startIcon={<SortIcon />} 
                      sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}
                      onClick={() => setOpenSortModal(true)}
                    >
                      Ordenar
                    </Button>
                  </Stack>
                  <MonitoringPointsPage sortBy={sortBy} order={order} />
                </>
              )}
            </>
          ) : (
            <MachinesPage />
          )}
        </Container>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Máquina</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Máquina"
            fullWidth
            value={newMachine.name}
            onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Tipo"
            fullWidth
            value={newMachine.type}
            onChange={(e) => setNewMachine({ ...newMachine, type: e.target.value })}
            sx={{ mt: 2 }}
          >
            <MenuItem value="Pump">Pump</MenuItem>
            <MenuItem value="Fan">Fan</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button 
            onClick={handleCreateMachine} 
            variant="contained"
            sx={{ bgcolor: '#692746', '&:hover': { bgcolor: '#521e36' } }}
            disabled={!newMachine.name.trim()}
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSortModal} onClose={() => setOpenSortModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Ordenar Pontos</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Campo"
            fullWidth
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="point_id">ID do Ponto</MenuItem>
            <MenuItem value="machine_name">Máquina</MenuItem>
            <MenuItem value="machine_type">Tipo</MenuItem>
            <MenuItem value="point_name">Ponto</MenuItem>
            <MenuItem value="sensor_model">Sensor</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            label="Ordem"
            fullWidth
            value={order}
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
            sx={{ mt: 2 }}
          >
            <MenuItem value="asc">Crescente</MenuItem>
            <MenuItem value="desc">Decrescente</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSortModal(false)}>Cancelar</Button>
          <Button 
            onClick={() => setOpenSortModal(false)} 
            variant="contained"
            sx={{ bgcolor: '#692746', '&:hover': { bgcolor: '#521e36' } }}
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};