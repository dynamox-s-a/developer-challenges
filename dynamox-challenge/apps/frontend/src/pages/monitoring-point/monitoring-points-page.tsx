import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useGetMonitoringPointsQuery, useCreateMonitoringPointMutation, useUpdateMonitoringPointMutation, useDeleteMonitoringPointMutation } from '@/store/monitoring-points/monitoring-points.api';
import { useGetMachinesQuery } from '@/store/machines/machines.api';
import { MonitoringPointFormModal } from '@/components/dashboard/monitoring-point/monitoring-point-form-modal';
import { MonitoringPointsList } from '@/components/dashboard/monitoring-point/monitoring-point-list';
import { MonitoringPointDeleteModal } from '@/components/dashboard/monitoring-point/monitoring-point-delete-modal';
import { MonitoringPoint } from '@/types/monitoring-point';

export default function MonitoringPointsPage(): React.JSX.Element {
  const { data: monitoringPoints = [], isLoading, error } = useGetMonitoringPointsQuery();
  const { data: machines } = useGetMachinesQuery();
  const [createMonitoringPoint] = useCreateMonitoringPointMutation();
  const [updateMonitoringPoint] = useUpdateMonitoringPointMutation();
  const [deleteMonitoringPoint] = useDeleteMonitoringPointMutation();

  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedMonitoringPoint, setSelectedMonitoringPoint] = React.useState<MonitoringPoint | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  const showSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const showError = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };

  const handleCreate = async (data: any) => {
    try {
      if (selectedMonitoringPoint) {
        await updateMonitoringPoint({ id: selectedMonitoringPoint.id, ...data }).unwrap();
        showSuccess('Monitoring Point updated successfully');
      } else {
        await createMonitoringPoint(data).unwrap();
        showSuccess('Monitoring Point created successfully');
      }
      setIsFormModalOpen(false);
      setSelectedMonitoringPoint(null);
    } catch (err) {
      console.error(err);
      showError('Failed to save Monitoring Point');
    }
  };

  const handleDelete = async () => {
    if (!selectedMonitoringPoint) return;
    try {
      await deleteMonitoringPoint(selectedMonitoringPoint.id).unwrap();
      showSuccess('Monitoring Point deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedMonitoringPoint(null);
    } catch (err) {
      console.error(err);
      showError('Failed to delete Monitoring Point');
    }
  };

  const openCreateModal = () => {
    setSelectedMonitoringPoint(null);
    setIsFormModalOpen(true);
  }

  const openEditModal = (mp: MonitoringPoint) => {
    setSelectedMonitoringPoint(mp);
    setIsFormModalOpen(true);
  }

  const openDeleteModal = (mp: MonitoringPoint) => {
    setSelectedMonitoringPoint(mp);
    setIsDeleteModalOpen(true);
  }

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading monitoring points</Typography>;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Monitoring Points</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={openCreateModal}>
            Add
          </Button>
        </div>
      </Stack>

      <MonitoringPointsList
        monitoringPoints={monitoringPoints}
        showMachineColumn={true}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <MonitoringPointFormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleCreate}
        monitoringPoint={selectedMonitoringPoint}
        machines={machines}
      />

      <MonitoringPointDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        monitoringPoint={selectedMonitoringPoint}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
