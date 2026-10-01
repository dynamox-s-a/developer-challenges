import {
  locationsFor,
  OTHER_LOCATION,
  POINT_NAME_MAX_LENGTH,
  type CreatePositionsRequest,
  type Location,
  type MachineType,
} from '@condition-monitor/shared';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import type { RequestFailure } from '../../api/failure';
import { FailureAlert } from '../../components/failure-alert';

export interface AddPositionsDialogProps {
  open: boolean;
  machineType: MachineType;
  /** Positions the machine already has; OTHER may repeat and is never listed here. */
  taken: Location[];
  onSubmit: (positions: CreatePositionsRequest['positions']) => Promise<RequestFailure | null>;
  onClose: () => void;
}

/**
 * Selects the positions of a machine at once (B11, B12). Only positions of its type are
 * offered, in power-flow order; taken ones show but cannot be selected. Points are named
 * after their position, except OTHER, which takes a name typed here.
 */
export function AddPositionsDialog({
  open,
  machineType,
  taken,
  onSubmit,
  onClose,
}: AddPositionsDialogProps) {
  const fullScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
  const [selected, setSelected] = useState<Location[]>([]);
  const [otherName, setOtherName] = useState('');
  const [failure, setFailure] = useState<RequestFailure | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected([]);
      setOtherName(OTHER_LOCATION.label);
      setFailure(null);
    }
  }, [open]);

  const toggle = (location: Location) =>
    setSelected((current) =>
      current.includes(location)
        ? current.filter((item) => item !== location)
        : [...current, location],
    );

  const otherNameMissing = selected.includes('OTHER') && otherName.trim() === '';

  const submit = async () => {
    setBusy(true);
    setFailure(null);
    const result = await onSubmit(
      selected.map((location) =>
        location === 'OTHER' ? { location, name: otherName.trim() } : { location },
      ),
    );
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
      <DialogTitle>Add positions</DialogTitle>
      <DialogContent>
        {failure && (
          <FailureAlert
            message={failure.message}
            reasons={failure.fieldErrors.map((error) => error.message)}
          />
        )}
        <DialogContentText sx={{ mb: 1 }}>
          Where sensors are mounted on this {machineType.toLowerCase()}, along the power flow.
        </DialogContentText>
        {/* FormGroup declares no role of its own; assistive technology needs it named. */}
        <FormGroup role="group" aria-label="Positions">
          {locationsFor(machineType).map((option) => {
            const isTaken = taken.includes(option.code);
            return (
              <FormControlLabel
                key={option.code}
                control={
                  <Checkbox
                    checked={selected.includes(option.code)}
                    onChange={() => toggle(option.code)}
                    disabled={isTaken}
                  />
                }
                label={isTaken ? `${option.label} (already added)` : option.label}
              />
            );
          })}
        </FormGroup>
        {selected.includes('OTHER') && (
          <TextField
            label="Name of the other location"
            value={otherName}
            onChange={(event) => setOtherName(event.target.value)}
            fullWidth
            margin="normal"
            error={otherNameMissing}
            helperText={otherNameMissing ? 'Required.' : 'Describe where the sensor sits.'}
            inputProps={{ maxLength: POINT_NAME_MAX_LENGTH }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => void submit()}
          disabled={busy || selected.length === 0 || otherNameMissing}
        >
          Add {selected.length > 0 ? selected.length : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
