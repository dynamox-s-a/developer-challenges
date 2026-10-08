import {
  disallowedSensorModels,
  type MachineDto,
  type MachineInput,
  MachineType,
} from '@dynapredict/shared-types';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useAppDispatch } from '../../app/hooks';
import { FormDialog } from '../../components/FormDialog';
import { FormSelect, FormTextField } from '../../components/FormFields';
import type { ApiError } from '../../services/apiClient';
import { createMachine, updateMachine } from './machinesSlice';

export const MACHINE_NAME_MAX_LENGTH = 100;

const TYPE_OPTIONS = Object.values(MachineType).map((type) => ({
  value: type,
  label: type,
}));

interface MachineFormDialogProps {
  open: boolean;
  /** The machine to edit; absent to create one. */
  machine?: MachineDto | null;
  onClose: () => void;
  onSaved: (machine: MachineDto, action: 'created' | 'updated') => void;
}

function sensorRuleHint(type: MachineType): string | undefined {
  const disallowed = disallowedSensorModels(type);
  return disallowed.length > 0
    ? `${type} machines can't have ${disallowed.join(' or ')} sensors.`
    : undefined;
}

export function MachineFormDialog({
  open,
  machine,
  onClose,
  onSaved,
}: MachineFormDialogProps) {
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState } = useForm<MachineInput>({
    defaultValues: { name: '', type: MachineType.Pump },
  });
  const type = useWatch({ control, name: 'type' });

  // Every opening starts from the machine being edited (or a blank form).
  useEffect(() => {
    if (!open) return;
    reset({
      name: machine?.name ?? '',
      type: machine?.type ?? MachineType.Pump,
    });
    setServerError(null);
  }, [open, machine, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const input = { name: values.name.trim(), type: values.type };
    setServerError(null);
    try {
      const saved = machine
        ? await dispatch(updateMachine({ id: machine.id, input })).unwrap()
        : await dispatch(createMachine(input)).unwrap();
      onSaved(saved, machine ? 'updated' : 'created');
    } catch (error) {
      // e.g. 422: the new type forbids sensors this machine already has.
      setServerError((error as ApiError).message);
    }
  });

  return (
    <FormDialog
      open={open}
      title={machine ? 'Edit machine' : 'New machine'}
      submitLabel={machine ? 'Save' : 'Create'}
      onClose={onClose}
      onSubmit={onSubmit}
      submitting={formState.isSubmitting}
      error={serverError}
    >
      <FormTextField
        control={control}
        name="name"
        label="Name"
        required
        rules={{
          validate: (value) => value.trim().length > 0 || 'Name is required',
          maxLength: {
            value: MACHINE_NAME_MAX_LENGTH,
            message: `Use at most ${MACHINE_NAME_MAX_LENGTH} characters`,
          },
        }}
      />
      <FormSelect
        control={control}
        name="type"
        label="Type"
        required
        options={TYPE_OPTIONS}
        helperText={sensorRuleHint(type)}
      />
    </FormDialog>
  );
}
