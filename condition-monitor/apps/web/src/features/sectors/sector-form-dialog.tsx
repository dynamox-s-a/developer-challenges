import {
  createSectorSchema,
  SECTOR_NAME_MAX_LENGTH,
  type CreateSectorRequest,
  type Sector,
} from '@condition-monitor/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import type { RequestFailure } from '../../api/failure';

type SectorForm = z.input<typeof createSectorSchema>;

export interface SectorFormDialogProps {
  open: boolean;
  /** The sector to edit, or null to create one. */
  sector: Sector | null;
  /** Resolves with the failure to show, or null when the API accepted the change. */
  onSubmit: (values: CreateSectorRequest) => Promise<RequestFailure | null>;
  onClose: () => void;
}

/** Creates or edits a sector, validated by the shared schema (ADR 0007). */
export function SectorFormDialog({ open, sector, onSubmit, onClose }: SectorFormDialogProps) {
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [failure, setFailure] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SectorForm, unknown, CreateSectorRequest>({
    resolver: zodResolver(createSectorSchema),
    defaultValues: { code: '', name: '' },
  });

  useEffect(() => {
    if (open) {
      reset({ code: sector?.code ?? '', name: sector?.name ?? '' });
      setFailure(null);
    }
  }, [open, sector, reset]);

  const submit = async (values: CreateSectorRequest) => {
    setFailure(null);
    const result = await onSubmit(values);
    if (!result) {
      onClose();
      return;
    }
    for (const fieldError of result.fieldErrors) {
      if (fieldError.field === 'code' || fieldError.field === 'name') {
        setError(fieldError.field, { message: fieldError.message });
      }
    }
    if (result.fieldErrors.length === 0) {
      setFailure(result.message);
    }
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
        <DialogTitle>{sector ? `Edit sector ${sector.code}` : 'New sector'}</DialogTitle>
        <DialogContent>
          {failure && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {failure}
            </Alert>
          )}
          <TextField
            {...register('code')}
            label="Code"
            fullWidth
            margin="normal"
            autoFocus
            error={Boolean(errors.code)}
            helperText={errors.code?.message ?? '2 to 10 letters or digits, such as DRY.'}
            inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 10 }}
          />
          <TextField
            {...register('name')}
            label="Name"
            fullWidth
            margin="normal"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            inputProps={{ maxLength: SECTOR_NAME_MAX_LENGTH }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {sector ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
