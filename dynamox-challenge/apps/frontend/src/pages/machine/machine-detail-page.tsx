import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
import { useCreateSensorMutation, useDeleteSensorMutation } from '@/store/sensors/sensors.api';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { MachineFormModal } from '@/components/dashboard/machine/machine-form-modal';
import { MonitoringPointFormModal } from '@/components/dashboard/monitoring-point/monitoring-point-form-modal';
import { MonitoringPointsList } from '@/components/dashboard/monitoring-point/monitoring-point-list';
import { SensorListModal } from '@/components/dashboard/sensor/sensor-list-modal';
import { SensorFormModal } from '@/components/dashboard/sensor/sensor-form-modal';
import { Machine } from '@/types/machine';
import { MonitoringPoint } from '@/types/monitoring-point';
import { Sensor, SensorModel } from '@/types/sensor';
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

  // Sensor Mutations
  const [createSensor] = useCreateSensorMutation();
  const [deleteSensor] = useDeleteSensorMutation();

  // Machine Modals State
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  // Monitoring Point Modals State
  const [isMPFormModalOpen, setIsMPFormModalOpen] = React.useState(false);
  const [selectedMonitoringPoint, setSelectedMonitoringPoint] = React.useState<MonitoringPoint | null>(null);

  // Sensor Modal State
  const [isSensorListModalOpen, setIsSensorListModalOpen] = React.useState(false);
  const [isSensorFormModalOpen, setIsSensorFormModalOpen] = React.useState(false);
  const [selectedSensor, setSelectedSensor] = React.useState<Sensor | null>(null);

  // Confirmation Dialog State
  const [confirmationDialog, setConfirmationDialog] = React.useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    severity?: 'error' | 'warning' | 'info';
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error || !machine) return <Typography>Error loading machine</Typography>;

  // Debug: Log the machine data to see what we're getting
  console.log('Machine data:', machine);
  console.log('MonitoringPoints:', machine.monitoringPoints);
  console.log('Is array?', Array.isArray(machine.monitoringPoints));

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



  const openCreateMPModal = () => {
    setSelectedMonitoringPoint(null);
    setIsMPFormModalOpen(true);
  };

  const openEditMPModal = (mp: MonitoringPoint) => {
    setSelectedMonitoringPoint(mp);
    setIsMPFormModalOpen(true);
  };

  const openDeleteMPModal = (mp: MonitoringPoint) => {
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
          console.error(err);
          showError('Failed to delete Monitoring Point');
        }
      }
    });
  };

  const openSensorListModal = (mp: MonitoringPoint) => {
    setSelectedMonitoringPoint(mp);
    setIsSensorListModalOpen(true);
  };

  // Sensor Handlers
  const handleAddSensor = () => {
    setIsSensorFormModalOpen(true);
  };

  const handleDeleteSensor = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setConfirmationDialog({
      open: true,
      title: 'Delete Sensor',
      message: `Are you sure you want to delete sensor "${sensor.model}"? This action cannot be undone.`,
      severity: 'error',
      onConfirm: async () => {
        try {
          await deleteSensor(sensor.id).unwrap();
          showSuccess('Sensor deleted successfully');
          setConfirmationDialog({ ...confirmationDialog, open: false });
          setSelectedSensor(null);
        } catch (err) {
          console.error(err);
          showError('Failed to delete sensor');
        }
      }
    });
  };

  const handleCreateSensor = async (data: { model: SensorModel }) => {
    if (!selectedMonitoringPoint) return;
    try {
      await createSensor({
        model: data.model,
        monitoringPointId: selectedMonitoringPoint.id
      }).unwrap();
      showSuccess('Sensor created successfully');
      setIsSensorFormModalOpen(false);
    } catch (err) {
      console.error(err);
      showError('Failed to create sensor');
    }
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
        machines={[machine]} // Pass current machine only, to populate display (though locked)
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
            onAddSensor={handleAddSensor}
            onDeleteSensor={handleDeleteSensor}
          />

          <SensorFormModal
            open={isSensorFormModalOpen}
            onClose={() => setIsSensorFormModalOpen(false)}
            onSubmit={handleCreateSensor}
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
