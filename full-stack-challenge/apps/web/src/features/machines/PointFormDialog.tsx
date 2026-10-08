import type { MonitoringPointSummaryDto } from '@dynapredict/shared-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../app/hooks';
import { FormDialog } from '../../components/FormDialog';
import { FormTextField } from '../../components/FormFields';
import type { ApiError } from '../../services/apiClient';
import { createPoint, renamePoint } from './machineDetailSlice';

export const POINT_NAME_MAX_LENGTH = 100;

interface PointFormDialogProps {
  open: boolean;
  machineId: string;
  /** The point to rename; absent to create one. */
  point?: MonitoringPointSummaryDto | null;
  onClose: () => void;
  onSaved: (name: string, action: 'created' | 'renamed') => void;
}

export function PointFormDialog({
  open,
  machineId,
  point,
  onClose,
  onSaved,
}: PointFormDialogProps) {
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, reset, formState } = useForm<{
    name: string;
  }>({ defaultValues: { name: '' } });

  useEffect(() => {
    if (!open) return;
    reset({ name: point?.name ?? '' });
    setServerError(null);
  }, [open, point, reset]);

  const onSubmit = handleSubmit(async ({ name }) => {
    const trimmed = name.trim();
    setServerError(null);
    try {
      if (point) {
        await dispatch(
          renamePoint({ pointId: point.id, name: trimmed }),
        ).unwrap();
      } else {
        await dispatch(createPoint({ machineId, name: trimmed })).unwrap();
      }
      onSaved(trimmed, point ? 'renamed' : 'created');
    } catch (error) {
      setServerError((error as ApiError).message);
    }
  });

  return (
    <FormDialog
      open={open}
      title={point ? 'Rename monitoring point' : 'New monitoring point'}
      submitLabel={point ? 'Save' : 'Create'}
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
        helperText="Where on the machine the sensor sits, e.g. Bearing DE."
        rules={{
          validate: (value) => value.trim().length > 0 || 'Name is required',
          maxLength: {
            value: POINT_NAME_MAX_LENGTH,
            message: `Use at most ${POINT_NAME_MAX_LENGTH} characters`,
          },
        }}
      />
    </FormDialog>
  );
}
