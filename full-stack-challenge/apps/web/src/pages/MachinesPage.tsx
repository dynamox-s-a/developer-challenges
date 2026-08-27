import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MachineType, type MachineDto } from '@dynamox/shared';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DataTable, type DataTableColumn } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import {
  clearMachinesError,
  createMachine,
  deleteMachine,
  fetchMachines,
  updateMachine,
} from '../features/machines/machinesSlice';

const emptyForm = {
  name: '',
  type: MachineType.Pump as MachineType,
};

export function MachinesPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, mutationStatus } = useAppSelector((state) => state.machines);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MachineDto | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [pendingDelete, setPendingDelete] = useState<MachineDto | null>(null);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    dispatch(clearMachinesError());
    setDialogOpen(true);
  };

  const openEdit = (machine: MachineDto) => {
    setEditing(machine);
    setForm({ name: machine.name, type: machine.type });
    dispatch(clearMachinesError());
    setDialogOpen(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (editing) {
      const result = await dispatch(
        updateMachine({ id: editing.id, payload: { name: form.name, type: form.type } })
      );
      if (updateMachine.fulfilled.match(result)) {
        setDialogOpen(false);
      }
      return;
    }

    const result = await dispatch(createMachine(form));
    if (createMachine.fulfilled.match(result)) {
      setDialogOpen(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await dispatch(deleteMachine(pendingDelete.id));
    setPendingDelete(null);
  };

  const columns: Array<DataTableColumn<MachineDto>> = useMemo(
    () => [
      { id: 'name', label: 'Name', render: (row) => row.name },
      { id: 'type', label: 'Type', render: (row) => row.type },
      {
        id: 'monitoringPointsCount',
        label: 'Monitoring points',
        render: (row) => row.monitoringPointsCount,
      },
      {
        id: 'updatedAt',
        label: 'Updated',
        render: (row) => new Date(row.updatedAt).toLocaleString(),
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        render: (row) => (
          <>
            <IconButton aria-label="edit" onClick={() => openEdit(row)}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => setPendingDelete(row)}>
              <DeleteIcon />
            </IconButton>
          </>
        ),
      },
    ],
    []
  );

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Machines"
        actions={
          <Button variant="contained" onClick={openCreate}>
            New machine
          </Button>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      <DataTable
        columns={columns}
        rows={items}
        getRowId={(row) => row.id}
        loading={status === 'loading'}
        emptyMessage="No machines yet. Create the first one."
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit machine' : 'Create machine'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="machine-type-label">Type</InputLabel>
                <Select
                  labelId="machine-type-label"
                  label="Type"
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, type: e.target.value as MachineType }))
                  }
                >
                  <MenuItem value={MachineType.Pump}>Pump</MenuItem>
                  <MenuItem value={MachineType.Fan}>Fan</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={mutationStatus === 'loading'}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete machine"
        description={`Delete machine "${pendingDelete?.name}"? This also removes its monitoring points and sensors.`}
        confirmLabel="Delete"
        loading={mutationStatus === 'loading'}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </Stack>
  );
}
