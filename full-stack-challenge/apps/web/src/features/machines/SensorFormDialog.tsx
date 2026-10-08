import {
  isSensorCompatibleWithMachine,
  type MachineType,
  type MonitoringPointSummaryDto,
  SENSOR_SERIAL_MAX_LENGTH,
  SENSOR_SERIAL_PATTERN,
  SensorModel,
  type SensorInput,
} from '@dynapredict/shared-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../app/hooks';
import { FormDialog } from '../../components/FormDialog';
import { FormSelect, FormTextField } from '../../components/FormFields';
import type { ApiError } from '../../services/apiClient';
import { attachSensor } from './machineDetailSlice';

const MODELS = Object.values(SensorModel);

/**
 * Models the machine type forbids stay in the list, disabled and labelled,
 * so the user sees why they can't pick them. The API enforces the same rule
 * (422); this only saves a round trip.
 */
export function sensorModelOptions(machineType: MachineType) {
  return MODELS.map((model) => {
    const allowed = isSensorCompatibleWithMachine(machineType, model);
    return {
      value: model,
      label: allowed ? model : `${model} (not allowed on ${machineType})`,
      disabled: !allowed,
    };
  });
}

function firstAllowedModel(machineType: MachineType): SensorModel {
  return (
    MODELS.find((model) => isSensorCompatibleWithMachine(machineType, model)) ??
    SensorModel.HFPlus
  );
}

interface SensorFormDialogProps {
  open: boolean;
  machineType: MachineType;
  point: MonitoringPointSummaryDto | null;
  onClose: () => void;
  onSaved: (input: SensorInput) => void;
}

export function SensorFormDialog({
  open,
  machineType,
  point,
  onClose,
  onSaved,
}: SensorFormDialogProps) {
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState } = useForm<SensorInput>({
    defaultValues: { serialNumber: '', model: firstAllowedModel(machineType) },
  });

  useEffect(() => {
    if (!open) return;
    reset({ serialNumber: '', model: firstAllowedModel(machineType) });
    setServerError(null);
  }, [open, machineType, reset]);

  const onSubmit = handleSubmit(async ({ serialNumber, model }) => {
    if (!point) return;
    const input = { serialNumber: serialNumber.trim(), model };
    setServerError(null);
    try {
      await dispatch(attachSensor({ pointId: point.id, input })).unwrap();
      onSaved(input);
    } catch (error) {
      // 409: serial number in use; 422: model not allowed on this machine.
      setServerError((error as ApiError).message);
    }
  });

  return (
    <FormDialog
      open={open}
      title={point ? `Add sensor to ${point.name}` : 'Add sensor'}
      submitLabel="Add sensor"
      onClose={onClose}
      onSubmit={onSubmit}
      submitting={formState.isSubmitting}
      error={serverError}
    >
      <FormTextField
        control={control}
        name="serialNumber"
        label="Serial number"
        required
        autoComplete="off"
        helperText="As printed on the sensor's label."
        rules={{
          // Checked on the trimmed value, which is what gets sent.
          validate: {
            required: (value) =>
              value.trim().length > 0 || 'Serial number is required',
            maxLength: (value) =>
              value.trim().length <= SENSOR_SERIAL_MAX_LENGTH ||
              `Use at most ${SENSOR_SERIAL_MAX_LENGTH} characters`,
            format: (value) =>
              SENSOR_SERIAL_PATTERN.test(value.trim()) ||
              'Use only letters, digits, dot, dash and underscore',
          },
        }}
      />
      <FormSelect
        control={control}
        name="model"
        label="Model"
        required
        options={sensorModelOptions(machineType)}
        rules={{
          // The rules type covers every field, so the value arrives as string.
          validate: (model) =>
            isSensorCompatibleWithMachine(machineType, model as SensorModel) ||
            `${model} sensors are not allowed on ${machineType} machines`,
        }}
      />
    </FormDialog>
  );
}
