import {
  buildMachineTag,
  createMachineSchema,
  MACHINE_NAME_MAX_LENGTH,
  MACHINE_NUMBER_MAX,
  MACHINE_TYPES,
  type CreateMachineRequest,
  type Machine,
  type MachineType,
  type Sector,
} from '@condition-monitor/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import type { RequestFailure } from '../../api/failure';
import { FailureAlert } from '../../components/failure-alert';

type MachineForm = z.input<typeof createMachineSchema>;

const FIELDS = ['sectorId', 'type', 'number', 'name'] as const;

export interface MachineFormDialogProps {
  open: boolean;
  /** The machine to edit, or null to create one. */
  machine: Machine | null;
  sectors: Sector[];
  /** Sector preselected when creating: the filtered one, or the first. */
  defaultSectorId: string | null;
  /** The number the API suggests for a sector and type, or null when it cannot answer. */
  suggestNumber: (sectorId: string, type: MachineType) => Promise<number | null>;
  /** Resolves with the failure to show, or null when the API accepted the change. */
  onSubmit: (values: CreateMachineRequest) => Promise<RequestFailure | null>;
  onClose: () => void;
}

function tagPreview(sectors: Sector[], values: Partial<MachineForm>): string | null {
  const sector = sectors.find((candidate) => candidate.id === values.sectorId);
  const number = Number(values.number);
  if (!sector || !values.type || !Number.isInteger(number) || number < 1) return null;
  if (number > MACHINE_NUMBER_MAX) return null;
  return buildMachineTag(sector.code, values.type as MachineType, number);
}

/**
 * Creates or edits a machine. Creating asks for as little as the challenge does: the
 * sector comes preselected and the number prefilled, so a name and a type are enough.
 */
export function MachineFormDialog({
  open,
  machine,
  sectors,
  defaultSectorId,
  suggestNumber,
  onSubmit,
  onClose,
}: MachineFormDialogProps) {
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [failure, setFailure] = useState<RequestFailure | null>(null);
  // Once the user types a number, suggestions stop overwriting it.
  const numberEdited = useRef(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MachineForm, unknown, CreateMachineRequest>({
    resolver: zodResolver(createMachineSchema),
  });

  useEffect(() => {
    if (!open) return;
    numberEdited.current = Boolean(machine);
    setFailure(null);
    reset(
      machine
        ? {
            sectorId: machine.sector.id,
            type: machine.type,
            number: machine.number,
            name: machine.name,
          }
        : { sectorId: defaultSectorId ?? '', type: undefined, number: undefined, name: '' },
    );
  }, [open, machine, defaultSectorId, reset]);

  const sectorId = watch('sectorId');
  const type = watch('type');
  useEffect(() => {
    if (!open || numberEdited.current || !sectorId || !type) return;
    let current = true;
    void suggestNumber(sectorId, type as MachineType).then((number) => {
      if (current && number !== null && !numberEdited.current) {
        setValue('number', number, { shouldValidate: true });
      }
    });
    return () => {
      current = false;
    };
  }, [open, sectorId, type, suggestNumber, setValue]);

  const tag = tagPreview(sectors, watch());
  const numberField = register('number', { valueAsNumber: true });

  const submit = async (values: CreateMachineRequest) => {
    setFailure(null);
    const result = await onSubmit(values);
    if (!result) {
      onClose();
      return;
    }
    const known = result.fieldErrors.filter((error) =>
      (FIELDS as readonly string[]).includes(error.field),
    );
    for (const fieldError of known) {
      setError(fieldError.field as (typeof FIELDS)[number], { message: fieldError.message });
    }
    if (known.length === 0) {
      setFailure(result);
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
        <DialogTitle>{machine ? `Edit machine ${machine.tag}` : 'New machine'}</DialogTitle>
        <DialogContent>
          {failure && <FailureAlert message={failure.message} reasons={failure.reasons} />}
          <TextField
            {...register('name')}
            label="Name"
            fullWidth
            margin="normal"
            autoFocus
            error={Boolean(errors.name)}
            helperText={errors.name?.message ?? 'Free text, such as Hood exhaust fan.'}
            inputProps={{ maxLength: MACHINE_NAME_MAX_LENGTH }}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                select
                label="Type"
                fullWidth
                margin="normal"
                error={Boolean(errors.type)}
                helperText={errors.type?.message}
              >
                {MACHINE_TYPES.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="sectorId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ''}
                select
                label="Sector"
                fullWidth
                margin="normal"
                error={Boolean(errors.sectorId)}
                helperText={errors.sectorId?.message}
              >
                {sectors.map((sector) => (
                  <MenuItem key={sector.id} value={sector.id}>
                    {sector.code} ({sector.name})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            {...numberField}
            onChange={(event) => {
              numberEdited.current = true;
              void numberField.onChange(event);
            }}
            label="Number"
            type="number"
            fullWidth
            margin="normal"
            error={Boolean(errors.number)}
            helperText={
              errors.number?.message ?? 'Suggested as the next free one; you may change it.'
            }
            inputProps={{ min: 1, max: MACHINE_NUMBER_MAX }}
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {tag ? (
              <>
                Tag: <strong>{tag}</strong>
              </>
            ) : (
              'The tag appears once the sector, type and number are set.'
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {machine ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
