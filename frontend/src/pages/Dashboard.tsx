import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { fetchAllMachines, createMachine } from '../features/machines/machineSlice';
import { fetchMonitoringPoints } from '../features/monitoringPoints/monitoringPointSlice';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { DrawerMenu } from '../components/Layout/DrawerMenu';
import { DashboardTopBar } from '../components/Layout/DashboardTopBar';
import { DashboardHome } from '../components/Dashboard/DashboardHome';
import { CreateMachineDialog } from '../components/Dashboard/CreateMachineDialog';
import { SortDialog } from '../components/Dashboard/SortDialog';
import MachinesPage from './MachinesPage';

const drawerWidth = 240;

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState<'home' | 'machines'>('home');
  const [openModal, setOpenModal] = useState(false);
  const [openSortModal, setOpenSortModal] = useState(false);
  const [newMachine, setNewMachine] = useState({ name: '', type: 'Pump' });
  const [sortBy, setSortBy] = useState('point_name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [allPoints, setAllPoints] = useState<any[]>([]);
  
  const { user } = useAppSelector((state) => state.auth);
  const { total = 0 } = useAppSelector((state) => state.monitoringPoints);
  const { items: machines = [] } = useAppSelector((state) => state.machines);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeSensors = allPoints.filter(point => point.sensor_model !== null).length;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await dispatch(fetchAllMachines());
        const result = await dispatch(fetchMonitoringPoints({ page: 1, size: 10000 })).unwrap();
        if (result?.items) {
          setAllPoints(result.items);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
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

  const drawerContent = (
    <DrawerMenu 
      currentView={currentView}
      onNavigate={setCurrentView}
      onLogout={handleLogout}
    />
  );

  return (
    <DashboardLayout drawerWidth={drawerWidth} drawerContent={drawerContent}>
      <DashboardTopBar 
        currentView={currentView}
        userName={user?.name}
        onNewMachine={() => setOpenModal(true)}
      />

      <Container maxWidth="lg" sx={{ px: '0 !important' }}>
        {currentView === 'home' ? (
          <DashboardHome 
            totalMachines={machines.length}
            totalPoints={total}
            activeSensors={activeSensors}
            sortBy={sortBy}
            order={order}
            onOpenSort={() => setOpenSortModal(true)}
          />
        ) : (
          <MachinesPage />
        )}
      </Container>

      <CreateMachineDialog 
        open={openModal}
        name={newMachine.name}
        type={newMachine.type}
        onClose={() => setOpenModal(false)}
        onNameChange={(name) => setNewMachine({ ...newMachine, name })}
        onTypeChange={(type) => setNewMachine({ ...newMachine, type })}
        onCreate={handleCreateMachine}
      />

      <SortDialog 
        open={openSortModal}
        sortBy={sortBy}
        order={order}
        onClose={() => setOpenSortModal(false)}
        onSortByChange={setSortBy}
        onOrderChange={setOrder}
      />
    </DashboardLayout>
  );
};