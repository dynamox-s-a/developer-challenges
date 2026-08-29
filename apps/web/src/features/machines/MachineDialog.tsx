import type { Machine, MachineType } from "@dyn/contracts";
import { machineTypeSchema } from "@dyn/contracts";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";

interface MachineDialogProps {
  open: boolean;
  machine: Machine | null;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (input: { name: string; type: MachineType }) => void;
}

export function MachineDialog({
  open,
  machine,
  pending,
  error,
  onClose,
  onSubmit,
}: MachineDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<MachineType>("Pump");

  useEffect(() => {
    if (open) {
      setName(machine?.name ?? "");
      setType(machine?.type ?? "Pump");
    }
  }, [machine, open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ name: name.trim(), type });
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>{machine ? "Edit machine" : "Add machine"}</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <Stack component="form" id="machine-form" onSubmit={handleSubmit} spacing={2} pt={1}>
          <TextField
            autoFocus
            disabled={pending}
            inputProps={{ maxLength: 120 }}
            label="Machine name"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
          <FormControl fullWidth size="small">
            <InputLabel id="machine-type-label">Machine type</InputLabel>
            <Select
              disabled={pending}
              label="Machine type"
              labelId="machine-type-label"
              onChange={(event) => setType(event.target.value as MachineType)}
              value={type}
            >
              {machineTypeSchema.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={pending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={pending || !name.trim()}
          form="machine-form"
          type="submit"
          variant="contained"
        >
          {pending ? <CircularProgress color="inherit" size={20} /> : machine ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
