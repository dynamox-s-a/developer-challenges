import * as React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

import { MachineCard } from '@/components/machine/machine-card';
import { MachineToolbar } from '@/components/machine/machine-toolbar';
import { useGetMachinesQuery } from '@/store/machines/machines.api';



import { MachineFormModal } from '@/components/machine/machine-form-modal';
import { Machine } from '@/types/machine';
import { useCreateMachineMutation, useUpdateMachineMutation } from '@/store/machines/machines.api';

export default function MachinePage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');


  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [selectedMachine, setSelectedMachine] = React.useState<Machine | undefined>(undefined);


  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>('error');

  const { data: machines } = useGetMachinesQuery();
  const [createMachine] = useCreateMachineMutation();
  const [updateMachine] = useUpdateMachineMutation();

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

      showError('Failed to save machine. Please try again.');
    }
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
          />
        ))}

      </Grid>

      {/* Modals */}
      <MachineFormModal
        open={isFormModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        machine={undefined}
        machines={machines}
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