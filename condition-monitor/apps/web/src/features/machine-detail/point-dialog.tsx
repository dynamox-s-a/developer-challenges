import {
  locationsFor,
  POINT_NAME_MAX_LENGTH,
  type Location,
  type MachineType,
  type MonitoringPoint,
  type UpdatePointRequest,
} from '@condition-monitor/shared';
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
import type { RequestFailure } from '../../api/failure';
import { FailureAlert } from '../../components/failure-alert';

export interface PointDialogProps {
  open: boolean;
  point: MonitoringPoint | null;
  machineType: MachineType;
  /** Positions taken by the machine's other points. */
  taken: Location[];
  onSubmit: (changes: UpdatePointRequest) => Promise<RequestFailure | null>;
  onClose: () => void;
}

/** Renames a point, or moves it to a free position of the same machine type. */
export function PointDialog({
  open,
  point,
  machineType,
  taken,
  onSubmit,
  onClose,
}: PointDialogProps) {
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [name, setName] = useState('');
  const [location, setLocation] = useState<Location>('OTHER');
  const [failure, setFailure] = useState<RequestFailure | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open && point) {
      setName(point.name);
      setLocation(point.location);
      setFailure(null);
    }
  }, [open, point]);

  const nameMissing = name.trim() === '';
  const options = locationsFor(machineType).filter(
    (option) => option.code === point?.location || !taken.includes(option.code),
  );

  const submit = async () => {
    setBusy(true);
    const result = await onSubmit({ name: name.trim(), location });
    setBusy(false);
    if (result) setFailure(result);
    else onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Edit monitoring point</DialogTitle>
      <DialogContent>
        {failure && (
          <FailureAlert
            message={failure.message}
            reasons={failure.fieldErrors.map((error) => error.message)}
          />
        )}
        <TextField
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
          margin="normal"
          error={nameMissing}
          helperText={nameMissing ? 'Required.' : undefined}
          inputProps={{ maxLength: POINT_NAME_MAX_LENGTH }}
        />
        <TextField
          select
          label="Position"
          value={location}
          onChange={(event) => setLocation(event.target.value as Location)}
          fullWidth
          margin="normal"
        >
          {options.map((option) => (
            <MenuItem key={option.code} value={option.code}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => void submit()} disabled={busy || nameMissing}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
