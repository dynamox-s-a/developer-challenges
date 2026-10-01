import {
  allowedSensorModels,
  installSensorSchema,
  type InstallSensorRequest,
  type MachineType,
  type MonitoringPoint,
} from '@condition-monitor/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import type { RequestFailure } from '../../api/failure';
import { FailureAlert } from '../../components/failure-alert';

type SensorForm = z.input<typeof installSensorSchema>;

export interface SensorDialogProps {
  open: boolean;
  point: MonitoringPoint | null;
  machineType: MachineType;
  onSubmit: (values: InstallSensorRequest) => Promise<RequestFailure | null>;
  onClose: () => void;
}

/**
 * Installs or replaces the sensor of a point (B14). Only the models allowed on the
 * machine type are offered: a pump gets HF+ alone, the challenge rule (B15), which the API
 * and the database enforce as well. The serial field takes typing or a barcode reader.
 */
export function SensorDialog({ open, point, machineType, onSubmit, onClose }: SensorDialogProps) {
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [failure, setFailure] = useState<RequestFailure | null>(null);
  const models = allowedSensorModels(machineType);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SensorForm, unknown, InstallSensorRequest>({
    resolver: zodResolver(installSensorSchema),
  });

  useEffect(() => {
    if (!open) return;
    setFailure(null);
    reset({
      serialNumber: point?.sensor?.serialNumber ?? '',
      // With a single allowed model, as on a pump, there is nothing to choose.
      model: point?.sensor?.model ?? (models.length === 1 ? models[0] : undefined),
    });
  }, [open, point, models, reset]);

  const submit = async (values: InstallSensorRequest) => {
    setFailure(null);
    const result = await onSubmit(values);
    if (!result) {
      onClose();
      return;
    }
    const known = result.fieldErrors.filter((error) =>
      ['serialNumber', 'model'].includes(error.field),
    );
    for (const fieldError of known) {
      setError(fieldError.field as 'serialNumber' | 'model', { message: fieldError.message });
    }
    if (known.length === 0) setFailure(result);
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
    >
      <form noValidate onSubmit={handleSubmit(submit)}>
        <DialogTitle>
          {point?.sensor ? 'Replace sensor' : 'Install sensor'} at {point?.name}
        </DialogTitle>
        <DialogContent>
          {failure && <FailureAlert message={failure.message} reasons={failure.reasons} />}
          <TextField
            {...register('serialNumber')}
            label="Serial number"
            fullWidth
            margin="normal"
            autoFocus
            error={Boolean(errors.serialNumber)}
            helperText={errors.serialNumber?.message ?? 'As printed on the sensor label.'}
            inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 40 }}
          />
          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                select
                label="Model"
                fullWidth
                margin="normal"
                error={Boolean(errors.model)}
                helperText={
                  errors.model?.message ??
                  (machineType === 'Pump' ? 'A pump accepts HF+ only.' : undefined)
                }
              >
                {models.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {point?.sensor ? 'Replace' : 'Install'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
