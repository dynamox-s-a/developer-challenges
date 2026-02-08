import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { ModalLayout } from '@/components/core/modal-layout';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { MonitoringPoint } from '@/types/monitoring-point';
import { Machine } from '@/types/machine';
import { SensorModel } from '@/types/sensor';

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  machineId: z.number().min(1, { message: 'Machine is required' }),
  sensorModel: z.nativeEnum(SensorModel).optional(),
});

type FormData = z.infer<typeof schema>;

interface MonitoringPointFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  monitoringPoint?: MonitoringPoint | null;
  machines?: Machine[];
  preSelectedMachineId?: number;
}

export function MonitoringPointFormModal({
  open,
  onClose,
  onSubmit,
  monitoringPoint,
  machines = [],
  preSelectedMachineId
}: MonitoringPointFormModalProps): React.JSX.Element {
  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      machineId: 0,
      sensorModel: undefined,
    },
  });

  const selectedMachineId = watch('machineId');
  const selectedMachine = machines.find(m => m.id === selectedMachineId);
  const isPumpMachine = selectedMachine?.type === 'Bomba';

  React.useEffect(() => {
    if (open) {
      reset({
        name: monitoringPoint?.name || '',
        machineId: monitoringPoint?.machineId || preSelectedMachineId || 0,
        sensorModel: undefined,
      });
    }
  }, [open, monitoringPoint, preSelectedMachineId, reset]);

  return (
    <ModalLayout
      title={monitoringPoint ? 'Edit Monitoring Point' : 'Add Monitoring Point'}
      open={open}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                autoFocus
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="machineId"
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value || ''}
                select
                label="Machine"
                error={Boolean(errors.machineId)}
                helperText={errors.machineId?.message}
                fullWidth
                disabled={!!monitoringPoint || !!preSelectedMachineId}
              >
                {machines.map((machine) => (
                  <MenuItem key={machine.id} value={machine.id}>
                    {machine.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          {!monitoringPoint && (
            <Controller
              control={control}
              name="sensorModel"
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value || ''}
                  select
                  label="Sensor Model"
                  error={Boolean(errors.sensorModel)}
                  helperText={isPumpMachine ? "TcAg and TcAs are not allowed for Bomba machines" : errors.sensorModel?.message}
                  fullWidth
                >
                  <MenuItem value="">None</MenuItem>
                  {!isPumpMachine && <MenuItem value={SensorModel.TcAg}>TcAg</MenuItem>}
                  {!isPumpMachine && <MenuItem value={SensorModel.TcAs}>TcAs</MenuItem>}
                  <MenuItem value={SensorModel.HF_PLUS}>HF+</MenuItem>
                </TextField>
              )}
            />
          )}
        </Stack>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </ModalLayout>
  );
}
