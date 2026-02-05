import * as React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

import { MachineCard } from '@/components/dashboard/machine/machine-card';
import { MachineToolbar } from '@/components/dashboard/machine/machine-toolbar';
import { useGetMachinesQuery } from '@/store/machines/machines.api';



import { MachineDeleteModal } from '@/components/dashboard/machine/machine-delete-modal';
import { MachineFormModal } from '@/components/dashboard/machine/machine-form-modal';
import { Machine } from '@/types/machine';
import { useCreateMachineMutation, useDeleteMachineMutation, useUpdateMachineMutation } from '@/store/machines/machines.api';

export default function MachinePage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedMachine, setSelectedMachine] = React.useState<Machine | undefined>(undefined);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>('error');

  const { data: machines } = useGetMachinesQuery();
  const [createMachine] = useCreateMachineMutation();
  const [updateMachine] = useUpdateMachineMutation();
  const [deleteMachine] = useDeleteMachineMutation();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenAdd = () => {
    setSelectedMachine(undefined);
    setIsFormModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormModalOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showError = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };

  const showSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleSubmitForm = async (data: any) => {
    try {
      if (selectedMachine) {
        await updateMachine({ id: selectedMachine.id, ...data }).unwrap();
        showSuccess('Machine updated successfully');
      } else {
        await createMachine(data).unwrap();
        showSuccess('Machine created successfully');
      }
      handleCloseForm();
    } catch (error) {
      console.error('Failed to save machine', error);
      showError('Failed to save machine. Please try again.');
    }
  };

  const handleOpenDelete = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedMachine) {
      try {
        await deleteMachine(selectedMachine.id).unwrap();
        showSuccess('Machine deleted successfully');
        handleCloseDelete();
      } catch (error) {
        console.error('Failed to delete machine', error);
        showError('Failed to delete machine. Please try again.');
      }
    }
  };

  const handleOpenEdit = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsFormModalOpen(true);
  };

  const filteredMachines = machines?.filter((machine) =>
    machine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Stack spacing={3}>
      <MachineToolbar searchQuery={searchQuery} onSearchChange={handleSearchChange} onAddClick={handleOpenAdd} />
      <Grid container spacing={3}>
        {filteredMachines?.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            onEdit={() => handleOpenEdit(machine)}
            onDelete={() => handleOpenDelete(machine)}
          />
        ))}
      </Grid>

      {/* Modals */}
      <MachineFormModal
        open={isFormModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        machine={selectedMachine}
        machines={machines}
      />

      <MachineDeleteModal
        open={isDeleteModalOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        machineName={selectedMachine?.name || ''}
      />

      {/* Action Alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}