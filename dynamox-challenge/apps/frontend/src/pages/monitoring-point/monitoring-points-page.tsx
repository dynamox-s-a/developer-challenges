import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useGetMonitoringPointsQuery, useCreateMonitoringPointMutation, useUpdateMonitoringPointMutation, useDeleteMonitoringPointMutation } from '@/store/monitoring-points/monitoring-points.api';
import { useGetMachinesQuery } from '@/store/machines/machines.api';
import { MonitoringPointFormModal } from '@/components/dashboard/monitoring-point/monitoring-point-form-modal';
import { MonitoringPointsList } from '@/components/dashboard/monitoring-point/monitoring-point-list';
import { SensorListModal } from '@/components/dashboard/monitoring-point/sensor-list-modal';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { MonitoringPoint } from '@/types/monitoring-point';

export default function MonitoringPointsPage(): React.JSX.Element {

  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [sortBy, setSortBy] = React.useState('id');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const { data: monitoringPointsData, isLoading, error } = useGetMonitoringPointsQuery({ page, limit, sortBy, sortOrder });
  const { data: machines } = useGetMachinesQuery();
  const [createMonitoringPoint] = useCreateMonitoringPointMutation();
  const [updateMonitoringPoint] = useUpdateMonitoringPointMutation();
  const [deleteMonitoringPoint] = useDeleteMonitoringPointMutation();

  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isSensorModalOpen, setIsSensorModalOpen] = React.useState(false);
  const [selectedMonitoringPoint, setSelectedMonitoringPoint] = React.useState<MonitoringPoint | null>(null);


  const [confirmationDialog, setConfirmationDialog] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    severity?: 'error' | 'warning' | 'info';
    hideCancel?: boolean;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });


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

      showError('Failed to save Monitoring Point');
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
    if (mp.sensors && mp.sensors.length > 0) {
      setConfirmationDialog({
        open: true,
        title: 'Cannot Delete Monitoring Point',
        message: `The monitoring point "${mp.name}" cannot be deleted because it has ${mp.sensors.length} associated sensor(s). Please remove the sensors first.`,
        severity: 'warning',
        confirmText: 'OK',
        hideCancel: true,
        onConfirm: () => setConfirmationDialog((prev) => ({ ...prev, open: false })),
      });
      return;
    }

    setConfirmationDialog({
      open: true,
      title: 'Delete Monitoring Point',
      message: `Are you sure you want to delete monitoring point "${mp.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      severity: 'error',
      onConfirm: async () => {
        try {
          await deleteMonitoringPoint(mp.id).unwrap();
          showSuccess('Monitoring Point deleted successfully');
          setConfirmationDialog({ ...confirmationDialog, open: false });
        } catch (err) {

          showError('Failed to delete Monitoring Point');
        }
      }
    });
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

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
        monitoringPoints={monitoringPointsData?.data || []}
        total={monitoringPointsData?.total || 0}
        page={page}
        limit={limit}
        sortBy={sortBy}
        sortOrder={sortOrder}
        showMachineColumn={true}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onViewSensor={(mp) => {
          setSelectedMonitoringPoint(mp);
          setIsSensorModalOpen(true);
        }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortChange={handleSortChange}
      />

      <MonitoringPointFormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleCreate}
        monitoringPoint={selectedMonitoringPoint}
        machines={machines}
      />

      <SensorListModal
        open={isSensorModalOpen}
        onClose={() => {
          setIsSensorModalOpen(false);
          setSelectedMonitoringPoint(null);
        }}
        monitoringPoint={selectedMonitoringPoint}
        machine={selectedMonitoringPoint?.machine}
      />

      <ConfirmationDialog
        {...confirmationDialog}
        onClose={() => setConfirmationDialog({ ...confirmationDialog, open: false })}
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
