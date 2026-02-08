import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paths } from '@/paths';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { CaretLeft as ArrowLeftIcon, Plus as PlusIcon } from '@phosphor-icons/react';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useGetMachineQuery, useDeleteMachineMutation, useUpdateMachineMutation } from '@/store/machines/machines.api';
import { useCreateMonitoringPointMutation, useUpdateMonitoringPointMutation, useDeleteMonitoringPointMutation } from '@/store/monitoring-points/monitoring-points.api';

import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { MachineFormModal } from '@/components/machine/machine-form-modal';
import { MonitoringPointFormModal } from '@/components/monitoring-point/monitoring-point-form-modal';
import { MonitoringPointsList } from '@/components/monitoring-point/monitoring-point-list';
import { SensorListModal } from '@/components/monitoring-point/sensor-list-modal';

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


  const [createMonitoringPoint] = useCreateMonitoringPointMutation();
  const [updateMonitoringPoint] = useUpdateMonitoringPointMutation();
  const [deleteMonitoringPoint] = useDeleteMonitoringPointMutation();





  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);


  const [isMPFormModalOpen, setIsMPFormModalOpen] = React.useState(false);
  const [selectedMonitoringPoint, setSelectedMonitoringPoint] = React.useState<MonitoringPoint | null>(null);


  const [isSensorListModalOpen, setIsSensorListModalOpen] = React.useState(false);


  const [confirmationDialog, setConfirmationDialog] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    severity?: 'error' | 'warning' | 'info';
    confirmText?: string;
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

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error || !machine) return <Typography>Error loading machine</Typography>;

  const handleBack = () => {
    navigate(paths.machine.list);
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
        navigate('/dashboard/machine');
      }
    } catch (err) {

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

      showError('Failed to update machine');
    }
  };


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
    } catch (err: any) {
      showError(err?.data?.message || 'Failed to save Monitoring Point');
    }
  };



  const openCreateMPModal = () => {
    setSelectedMonitoringPoint(null);
    setIsMPFormModalOpen(true);
  };

  const openEditMPModal = (mp: MonitoringPoint) => {
    setSelectedMonitoringPoint(mp);
    setIsMPFormModalOpen(true);
  };

  const openDeleteMPModal = (mp: MonitoringPoint) => {
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
  };

  const openSensorListModal = (mp: MonitoringPoint) => {
    setSelectedMonitoringPoint(mp);
    setIsSensorListModalOpen(true);
  };




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
        onViewSensor={openSensorListModal}
      />

      {/* Modals */}
      <MachineFormModal
        open={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleUpdate}
        machine={machine}
      />

      <ConfirmationDialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          await handleDelete();
          setIsDeleteModalOpen(false);
        }}
        title="Delete Machine"
        message={`Are you sure you want to delete machine "${machine.name}"? This action cannot be undone.`}
        severity="error"
        confirmText="Delete"
      />

      <MonitoringPointFormModal
        open={isMPFormModalOpen}
        onClose={() => setIsMPFormModalOpen(false)}
        onSubmit={handleCreateMP}
        monitoringPoint={selectedMonitoringPoint}
        preSelectedMachineId={machineId}
        machines={[machine]}
      />

      {/* Sensor Modals */}
      {selectedMonitoringPoint && (
        <>
          <SensorListModal
            open={isSensorListModalOpen}
            onClose={() => {
              setIsSensorListModalOpen(false);
              setSelectedMonitoringPoint(null);
            }}
            monitoringPoint={selectedMonitoringPoint}
            machine={machine}
          />

        </>
      )}

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
