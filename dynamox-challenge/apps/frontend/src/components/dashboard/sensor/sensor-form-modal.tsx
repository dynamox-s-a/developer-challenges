import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { SensorModel } from '@/types/sensor';
import type { MonitoringPoint } from '@/types/monitoring-point';
import type { Machine } from '@/types/machine';

const schema = z.object({
  model: z.nativeEnum(SensorModel, { message: 'Sensor model is required' }),
});

type FormData = z.infer<typeof schema>;

export interface SensorFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  monitoringPoint: MonitoringPoint;
  machine: Machine;
}

export function SensorFormModal({
  open,
  onClose,
  onSubmit,
  monitoringPoint,
  machine,
}: SensorFormModalProps): React.JSX.Element {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      model: undefined,
    },
  });

  // Calculate available sensor types
  const availableTypes = React.useMemo(() => {
    const assignedTypes = (monitoringPoint.sensors || []).map(s => s.model);
    const allTypes = Object.values(SensorModel);

    let available = allTypes.filter(type => !assignedTypes.includes(type));

    // Filter by machine type restrictions
    if (machine.type === 'Bomba') {
      available = available.filter(
        type => type !== SensorModel.TcAg && type !== SensorModel.TcAs
      );
    }

    return available;
  }, [monitoringPoint.sensors, machine.type]);

  React.useEffect(() => {
    if (open) {
      reset({ model: undefined });
    }
  }, [open, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Sensor to {monitoringPoint.name}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="model"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Sensor Model"
                  error={Boolean(errors.model)}
                  helperText={errors.model?.message || (availableTypes.length === 0 ? 'No sensor types available for this monitoring point' : '')}
                  fullWidth
                  disabled={availableTypes.length === 0}
                >
                  {availableTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={availableTypes.length === 0}>
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
