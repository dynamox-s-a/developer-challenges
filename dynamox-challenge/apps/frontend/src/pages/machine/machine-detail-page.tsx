import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { CaretLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/CaretLeft';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useGetMachineQuery, useDeleteMachineMutation, useUpdateMachineMutation } from '@/store/machines/machines.api';
import { useCreateMonitoringPointMutation, useUpdateMonitoringPointMutation, useDeleteMonitoringPointMutation } from '@/store/monitoring-points/monitoring-points.api';
import { MachineDeleteModal } from '@/components/dashboard/machine/machine-delete-modal';
import { MachineFormModal } from '@/components/dashboard/machine/machine-form-modal';
import { MonitoringPointFormModal } from '@/components/dashboard/monitoring-point/monitoring-point-form-modal';
import { MonitoringPointsList } from '@/components/dashboard/monitoring-point/monitoring-point-list';
import { MonitoringPointDeleteModal } from '@/components/dashboard/monitoring-point/monitoring-point-delete-modal';
import { Machine } from '@/types/machine';
import { MonitoringPoint } from '@/types/monitoring-point';
import { Box } from '@mui/system';

export default function MachineDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const machineId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();

  const { data: machine, isLoading, error } = useGetMachineQuery(machineId || 0, { skip: !machineId });
  const [deleteMachine] = useDeleteMachineMutation();
  const [updateMachine] = useUpdateMachineMutation();

  // Monitoring Point Mutations
  const [createMonitoringPoint] = useCreateMonitoringPointMutation();
  const [updateMonitoringPoint] = useUpdateMonitoringPointMutation();
  const [deleteMonitoringPoint] = useDeleteMonitoringPointMutation();

  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Monitoring Point Modals State
  const [isMPFormModalOpen, setIsMPFormModalOpen] = React.useState(false);
  const [isMPDeleteModalOpen, setIsMPDeleteModalOpen] = React.useState(false);
  const [selectedMonitoringPoint, setSelectedMonitoringPoint] = React.useState<MonitoringPoint | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error || !machine) return <Typography>Error loading machine</Typography>;

  const handleBack = () => {
    navigate('/dashboard/machine');
  };

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

  const handleDelete = async () => {
    try {
      if (machineId) {
        await deleteMachine(machineId).unwrap();
        navigate('/dashboard/machine'); // Redirect after delete
      }
    } catch (err) {
      console.error(err);
      showError('Failed to delete machine');
    }
  };

  const handleUpdate = async (data: Partial<Machine>) => {
    try {
      if (machineId) {
        await updateMachine({ id: machineId, ...data }).unwrap();
        setIsFormModalOpen(false);
        showSuccess('Machine updated successfully');
      }
    } catch (err) {
      console.error(err);
      showError('Failed to update machine');
    }
  };

  // Monitoring Point Handlers
  const handleCreateMP = async (data: any) => {
    try {
      if (selectedMonitoringPoint) {
        await updateMonitoringPoint({ id: selectedMonitoringPoint.id, ...data }).unwrap();
        showSuccess('Monitoring Point updated successfully');
      } else {
        await createMonitoringPoint(data).unwrap();
        showSuccess('Monitoring Point created successfully');
      }
      setIsMPFormModalOpen(false);
      setSelectedMonitoringPoint(null);
    } catch (err) {
      console.error(err);
      showError('Failed to save Monitoring Point');
    }
  };

  const handleDeleteMP = async () => {
    if (!selectedMonitoringPoint) return;
    try {
      await deleteMonitoringPoint(selectedMonitoringPoint.id).unwrap();
      showSuccess('Monitoring Point deleted successfully');
      setIsMPDeleteModalOpen(false);
      setSelectedMonitoringPoint(null);
    } catch (err) {
      console.error(err);
      showError('Failed to delete Monitoring Point');
    }
  };

  const openCreateMPModal = () => {
    setSelectedMonitoringPoint(null);
    setIsMPFormModalOpen(true);
  }

  const openEditMPModal = (mp: MonitoringPoint) => {
    setSelectedMonitoringPoint(mp);
    setIsMPFormModalOpen(true);
  }

  const openDeleteMPModal = (mp: MonitoringPoint) => {
    setSelectedMonitoringPoint(mp);
    setIsMPDeleteModalOpen(true);
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <IconButton onClick={handleBack}>
            <ArrowLeftIcon size={32} />
          </IconButton>
          <Typography variant="h4">{machine.name}</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="primary" onClick={() => setIsFormModalOpen(true)}>
            Edit Machine
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={(machine.monitoringPoints?.length || 0) > 0}
            title={(machine.monitoringPoints?.length || 0) > 0 ? "Cannot delete machine with associated monitoring points" : ""}
          >
            Delete Machine
          </Button>
        </Stack>
      </Stack>

      {/* Details Card */}
      <Card>
        <CardHeader title="Machine Information" />
        <Divider />
        <CardContent>
          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">Type:</Typography>
              <Typography variant="body1">{machine.type}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">Status:</Typography>
              <Typography variant="body1">{machine.status}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">ID:</Typography>
              <Typography variant="body1">{machine.id}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Divider />

      {/* Monitoring Points Section */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Monitoring Points</Typography>
        <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={openCreateMPModal}>
          Add Monitoring Point
        </Button>
      </Stack>

      <MonitoringPointsList
        monitoringPoints={machine.monitoringPoints || []}
        showMachineColumn={false}
        onEdit={openEditMPModal}
        onDelete={openDeleteMPModal}
      />

      {/* Modals */}
      <MachineFormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleUpdate}
        machine={machine}
      />

      <MachineDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        machineName={machine.name}
      />

      <MonitoringPointFormModal
        open={isMPFormModalOpen}
        onClose={() => setIsMPFormModalOpen(false)}
        onSubmit={handleCreateMP}
        monitoringPoint={selectedMonitoringPoint}
        preSelectedMachineId={machineId}
        machines={[machine]} // Pass current machine only, to populate display (though locked)
      />

      <MonitoringPointDeleteModal
        open={isMPDeleteModalOpen}
        onClose={() => setIsMPDeleteModalOpen(false)}
        onConfirm={handleDeleteMP}
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
