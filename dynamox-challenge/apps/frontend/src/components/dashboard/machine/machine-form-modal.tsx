import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ModalLayout } from '@/components/core/modal-layout';
import { MACHINE_TYPE_VALUES } from '@/shared/machine-types';
import { Machine } from '@/types/machine';


const createSchema = (machines: Machine[], currentMachineId?: string) => z.object({
  name: z.string().min(1, 'Name is required').refine((name) => {
    return !machines.some((m) => m.name.toLowerCase() === name.toLowerCase() && m.id !== currentMachineId);
  }, { message: 'Machine with this name already exists' }),
  type: z.string().min(1, 'Type is required'),
});

type FormData = z.infer<ReturnType<typeof createSchema>>;

export interface MachineFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  machine?: Machine;
  machines?: Machine[];
}

export function MachineFormModal({ open, onClose, onSubmit, machine, machines = [] }: MachineFormModalProps): React.JSX.Element {
  const isEdit = !!machine;

  const schema = React.useMemo(() => createSchema(machines, machine?.id), [machines, machine]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: machine?.name || '',
        type: machine?.type || '',
      });
    }
  }, [open, machine, reset]);

  return (
    <ModalLayout title={isEdit ? "Edit Machine" : "New Machine"} open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ p: 2 }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Type"
                error={!!errors.type}
                helperText={errors.type?.message}
                fullWidth
              >
                {MACHINE_TYPE_VALUES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />


        </Stack>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {isEdit ? "Save Changes" : "Create Machine"}
          </Button>
        </DialogActions>
      </form>
    </ModalLayout>
  );
}
