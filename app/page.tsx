'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { Grid } from '@mui/material';
import { MachineList } from '@/components/MachineList';
import { MonitoringPointsTable } from '@/components/MonitoringPointsTable';
import type { Machine, MonitoringPoint } from '@/types';
import { api } from '@/services/api';

export default function HomePage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'warning' | 'info',
  });

  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'warning' | 'info' = 'info',
  ) => {
    setNotification({ open: true, message, severity });
  };

  const hideNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const loadMachines = async () => {
    try {
      const data = await api.getMachines();
      setMachines(data);
    } catch (error) {
      showNotification('Erro ao carregar máquinas', 'error');
    }
  };

  const loadMonitoringPoints = async () => {
    try {
      const data = await api.getMonitoringPoints();
      setMonitoringPoints(data);
    } catch (error) {
      showNotification('Erro ao carregar pontos de monitoramento', 'error');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadMachines(), loadMonitoringPoints()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMachineChange = () => {
    loadMachines();
    loadMonitoringPoints(); // Reload points in case machine was deleted
  };

  const handleMonitoringPointChange = () => {
    loadMonitoringPoints();
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Painel Administrativo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Sistema de Gerenciamento de Máquinas e Monitoramento Industrial
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Paper sx={{ p: 3, height: 'fit-content' }}>
          <Typography variant="h5" gutterBottom>
            Gerenciamento de Máquinas
          </Typography>
          <MachineList
            machines={machines}
            onMachineChange={handleMachineChange}
            onMonitoringPointChange={handleMonitoringPointChange}
            showNotification={showNotification}
          />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Pontos de Monitoramento
          </Typography>
          <MonitoringPointsTable
            monitoringPoints={monitoringPoints}
            machines={machines}
            onMonitoringPointChange={handleMonitoringPointChange}
            showNotification={showNotification}
          />
        </Paper>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={hideNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
